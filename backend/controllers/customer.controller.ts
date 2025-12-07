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

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user?.id)

    if (user) return res.status(200).json({user});
    else return res.status(404).json({ message: "Pengguna tidak ditemukan"});

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { username, phoneNumber, displayName } = req.body;
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
      { username, phoneNumber, displayName },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({
        message: "Perubahan disimpan",
        user: updatedUser
      });
    } else {
      return res.status(404).json({
        message: "Pengguna tidak ditemukan"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


export const deleteMe = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user?.id);

    if (user?.role === 'ADMIN') {
      return res.status(403).json({
        message: "Akun admin tidak dapat dihapus"
      }); 
    } else if (user?.role === 'STAFF') {
      return res.status(403).json({
        message: "Staff tidak dapat menghapus akun sendiri"
      }); 
    }

    await UserModel.findByIdAndDelete(req.user?.id);
    return res.status(204).json({ message: "Berhasil menghapus akun" })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
};