import UserModel from "../models/entity/user.entity.js";
import AppointmentModel from "../models/entity/appointment.entity.js";
import { Request, Response } from "express";

export const addCapster = async (req: Request, res: Response) => {
  try {
    const { email, username, password, phoneNumber, displayName } = req.body;

    const exists = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ message: "Email atau username sudah dipakai" });
    }

    const capster = await UserModel.create({
      email,
      username,
      password,
      phoneNumber,
      displayName,
      role: "STAFF"
    });

    return res.status(201).json({ message: "Capster berhasil dibuat", data: capster });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllCapster = async (req: Request, res: Response) => {
  try {
    const capsters = await UserModel.find({ role: "STAFF" });
    return res.status(200).json({ data: capsters });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getCapsterById = async (req: Request, res: Response) => {
  try {
    const capster = await UserModel.findOne({
      _id: req.params.id,
      role: "STAFF"
    });
    if (!capster) {
      return res.status(404).json({ message: "Capster tidak ditemukan" });
    }
    return res.status(200).json({ data: capster });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const updateCapster = async (req: Request, res: Response) => {
  try {
    const updated = await UserModel.findOneAndUpdate(
      { _id: req.params.id, role: "STAFF" },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Capster tidak ditemukan" });
    }

    return res.status(200).json({ message: "Berhasil update", data: updated });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteCapster = async (req: Request, res: Response) => {
  try {
    const deleted = await UserModel.findOneAndDelete({
      _id: req.params.id,
      role: "STAFF"
    });

    if (!deleted) {
      return res.status(404).json({ message: "Capster tidak ditemukan" });
    }

    return res.status(200).json({ message: "Capster berhasil dihapus", data: deleted });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteAllCapster = async (req: Request, res: Response) => {
  try {
    const result = await UserModel.deleteMany({ role: "STAFF" });
    return res.status(200).json({
      message: "Semua capster dihapus",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const createWalkIn = async (req: Request, res: Response) => {
  try {
    const { customerName, services, totalPrice, startTime, endTime } = req.body;

    if (!customerName || !services || !startTime || !endTime) {
      return res.status(400).json({ message: "Data walk-in incomplete" });
    }

    const appointment = await AppointmentModel.create({
      appointmentType: "WALKIN",
      customerName,
      capsterId: req.user?.id,
      reservationStatus: "WAITING",
      totalPrice: totalPrice || 0,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      services
    });

    return res.status(201).json({ message: "Walk-in appointment created", data: appointment });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


// 2. Change Status Walk-In (capster can only change their own)
export const changeStatusWalkIn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await AppointmentModel.findOne({ _id: id, capsterId: req.user?.id, appointmentType: "WALKIN" });
    if (!appointment) {
      return res.status(404).json({ message: "Walk-in appointment not found or not yours" });
    }

    appointment.reservationStatus = status;
    await appointment.save();

    return res.status(200).json({ message: "Status updated", data: appointment });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


// 3. Change Status Reservation (capster can only change their own)
export const changeStatusReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await AppointmentModel.findOne({ _id: id, capsterId: req.user?.id, appointmentType: "RESERVATION" });
    if (!appointment) {
      return res.status(404).json({ message: "Reservation appointment not found or not yours" });
    }

    appointment.reservationStatus = status;
    await appointment.save();

    return res.status(200).json({ message: "Status updated", data: appointment });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
