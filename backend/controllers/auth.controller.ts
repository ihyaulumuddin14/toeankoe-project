import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import UserModel from "../models/entity/user.entity.js"
dotenv.config()

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body

    const existingUser = await UserModel.findOne({ email }).exec()
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      displayName
    })

    res.status(201).json(newUser)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "unknown error" });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password, rememberMe } = req.body

    const user = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    }).exec()

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    } else if (!(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ error: "Incorrect password" })
    }

    const accessToken = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m"
      }
    )

    const refreshToken = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: rememberMe ? "7d" : "1d"
      }
    )

    await UserModel.findOneAndUpdate({ email: user.email }, {
      refreshToken
    }).exec()


    // set response
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/api/v1/auth"
    })

    res.status(200).json({
      message: "Login Successfully",
      accessToken,
      user
    })
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "unknown error" });
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken

    if (!refreshTokenFromCookie) {
      return res.status(401).json({ error: "No refresh token provided" })
    }

    // CEK REFRESH TOKEN DI DB
    const user = await UserModel.findOne({ refreshToken: refreshTokenFromCookie }).exec()
    if (!user) {
      return res.status(401).json("Invalid or expired refresh token")
    }
    
    // CEK EXPIRED REFRESH TOKEN
    const decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.JWT_SECRET!
    )
    if (!decoded) {
      return res.status(401).json("Invalid or expired refresh token")
    }
    
    // BUAT TOKEN BARU
    const newAccessToken = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m"
      }
    )

    res.status(200).json({
      message: "Refresh Successfully",
      newAccessToken
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "unknown error" });
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken
    console.log("Refresh Token:", refreshTokenFromCookie)

    if (refreshTokenFromCookie) {
      const user = await UserModel.findOne({ refreshToken: refreshTokenFromCookie }).exec()

      if (user) {
        await UserModel.findOneAndUpdate(
          { refreshToken: refreshTokenFromCookie },
          { $unset: { refreshToken: "" } }
        )
      } else {
        return res.status(403).json({ error: "Invalid refresh token" })
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/v1/auth"
    })

    res.status(200).json({
      message: "Logout Successfully"
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "unknown error" });
  }
}