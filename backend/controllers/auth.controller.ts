import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import UserModel from "../models/entity/user.entity.js"
import generateUsername from "../helper/username-generator.js"
dotenv.config()

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body

    const existingUser = await UserModel.findOne({ email }).exec()
    if (existingUser) {
      return res.status(409).json({ message: "Pengguna telah terdaftar" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await UserModel.create({
      email,
      username: await generateUsername(email.split("@")[0]),
      password: hashedPassword,
      displayName: displayName?.toLowerCase() || ( email.split("@")[0].length > 5 ? email.split("@")[0].slice(0, 5).toLowerCase() : email.split("@")[0].toLowerCase() )
    })

    res.status(201).json({
      message: "Pengguna berhasil didaftarkan",
      data: newUser
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Unknown error" });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password, rememberMe } = req.body

    const user = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    }).exec()

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" })
    } else if (!(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ message: "Password salah" })
    }

    const accessToken = jwt.sign(
      {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m"
      }
    )

    const refreshToken = jwt.sign(
      {
        id: user.id.toString(),
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
      message: "Login Berhasil",
      accessToken,
      user
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Unknown error" });
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken

    if (!refreshTokenFromCookie) {
      return res.status(401).json({ message: "You're not logged in" })
    }

    // CEK REFRESH TOKEN DI DB
    const user = await UserModel.findOne({ refreshToken: refreshTokenFromCookie }).exec()
    if (!user) {
      console.log("refresh token not found in db")
      return res.status(401).json({ message: "Invalid or expired refresh token" })
    }
    
    // CEK EXPIRED REFRESH TOKEN
    const decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.JWT_SECRET!
    )
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired refresh token" })
    }
    
    // BUAT TOKEN BARU
    const newAccessToken = jwt.sign(
      {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m"
      }
    )

    res.status(200).json({
      message: "Refresh Sukses",
      newAccessToken,
      user
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Unknown error" });
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken

    if (refreshTokenFromCookie) {
      const user = await UserModel.findOne({ refreshToken: refreshTokenFromCookie }).exec()

      if (user) {
        await UserModel.findOneAndUpdate(
          { refreshToken: refreshTokenFromCookie },
          { $unset: { refreshToken: "" } }
        )
      } else {
        return res.status(403).json({ message: "Invalid or expired refresh token" })
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/v1/auth"
    })

    res.status(200).json({
      message: "Logout Berhasil"
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Unknown error" });
  }
}