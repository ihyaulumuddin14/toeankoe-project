import { Request, Response } from "express"

import UserModel from "../models/entity/user.entity.js"

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({
      message: "User retrivied successfully",
      users
    })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user?.id)
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { username, ...rest } = req.body;
    if (username) {
      const exists = await UserModel.exists({
        username,
        _id: { $ne: userId }
      });

      if (exists) {
        return res.status(409).json({
          message: "Username sudah digunakan"
        });
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { username, ...rest },
      { new: true }
    );

    return res.status(200).json({
      message: "Perubahan disimpan",
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await UserModel.findByIdAndDelete(req.user?.id);
    return res.status(204).json({ message: "Berhasil menghapus akun" })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
};


export const deleteCustomerByAdmin = async (req: Request, res: Response) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    return res.status(204).json({ message: "Berhasil menghapus akun" })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
};