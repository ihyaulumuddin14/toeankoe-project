import { NextFunction, Request, Response } from "express";
import HttpError from "../utils/http-error.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.header("Authorization")
    if (!header || !header.startsWith("Bearer")) {
      throw new HttpError(401, "Authentication failed: No token provided");
    }

    const accessToken = header.split(" ")[1];
    if (!accessToken) {
      throw new HttpError(401, "Authentication failed: Malformed token");
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
    if (!decoded) {
      throw new HttpError(401, "Authentication failed: Invalid or expired token");
    }

    req.user = decoded as JwtPayload;
    next();
  } catch (error: any) {
    if (error.name == "TokenExpiredError") {
      res.status(401).json({ 
        error: "Token expired",
        code: "TOKEN_EXPIRED"
      });
      return;
    }

    if (error.name == "JsonWebTokenError") {
      res.status(401).json({ 
        error: "Invalid token",
        code: "INVALID_TOKEN"
      });
      return;
    }

    res.status(401).json({ 
      error: "Authentication failed" 
    });
  }
}