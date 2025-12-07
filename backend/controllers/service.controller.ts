import { Response, Request } from "express";
import ServiceModel from "../models/entity/service.entity.js";

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await ServiceModel.find();
    return res.status(200).json({ data: services });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await ServiceModel.findById(req.params.id);
    return res.status(200).json({ data: service });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const createService = async (req: Request, res: Response) => {
  try {
    const service = await ServiceModel.create(req.body);
    return res.status(200).json({ message: "Layanan berhasil dibuat", data: service });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await ServiceModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    return res.status(200).json({ message: "Layanan berhasil diubah", data: service });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await ServiceModel.findOneAndDelete({ _id: req.params.id });
    return res.status(200).json({ message: "Layanan berhasil dihapus", data: service });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteAllServices = async (req: Request, res: Response) => {
  try {
    const result = await ServiceModel.deleteMany({});
    return res.status(200).json({ message: "Semua layanan dihapus", deletedCount: result.deletedCount });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}