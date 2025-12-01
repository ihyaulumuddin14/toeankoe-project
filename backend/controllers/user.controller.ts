import { Request, Response } from "express"

import UserModel from "../models/entity/user.entity.js"

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({
      message: "User retrivied successfully",
      users
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id)
    return res.status(200).json({
      message: "User retrivied successfully",
      user
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    })
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.user!.id, req.body, { new: true })
    return res.status(200).json({
      message: "Update user successfully",
      user
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    })
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    return res.status(204).json({ message: "User deleted" })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    })
  }
};