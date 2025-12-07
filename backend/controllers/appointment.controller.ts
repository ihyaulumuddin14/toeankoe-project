import { Request, Response, NextFunction } from "express";
import AppointmentModel from "../models/entity/appointment.entity.js";
import UserModel from "../models/entity/user.entity.js"
import ServiceModel from "../models/entity/service.entity.js"
import { isConsecutiveSlotAvailable } from "../helper/availability-check-slot.js";
import { buildDateTime } from "../helper/build-date-time.js";
import toLocalISOString from "../helper/local-iso-string.js";

interface CreateAppointmentPayload {
  date: string;
  startTime: string;
  capsterId?: string;
  customerName?: string;
  services: string[];
}

export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, status } = req.query;
    const user = req.user;

    let filter: {
      customerId?: string,
      capsterId?: string,
      date?: any,
      reservationStatus?: string
    } = {};

    if (user?.role === "CUSTOMER") {
      filter.customerId = user.id;
    } else if (user?.role === "STAFF") {
      filter.capsterId = user.id;
    }

    if (startDate && endDate) filter.date = {
      $gte: startDate,
      $lte: endDate
    };
    if (status) filter.reservationStatus = status as string;

    const appointments = await AppointmentModel.find(filter);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data appointment" })
  }
};

export const getAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const appointment = await AppointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment tidak ditemukan" })
    }

    if (user?.role === "CUSTOMER" && appointment!.customerId?.toString() !== user.id)
      return res.status(403).json({ message: "Anda tidak berhak mengakses appointment ini" });
    if (user?.role === "STAFF" && appointment!.capsterId?.toString() !== user.id)
      return res.status(403).json({ message: "Anda tidak berhak mengakses appointment ini" });
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data appointment" })
  }
};


export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const data: CreateAppointmentPayload = req.body;
    
    if (user?.role === "ADMIN") {
      return res.status(403).json({ message: "Admin tidak diperbolehkan membuat appointment" })
    }

    if (data.startTime! < toLocalISOString(new Date())) {
      return res.status(400).json({ message: "Waktu tidak valid" });
    }

    let totalDurationMinutes: number = 0;
    let totalPrice: number = 0;

    const serviceDocs = await ServiceModel.find({
      _id: {
        $in: data.services
      }
    });

    if (serviceDocs.length !== data.services.length) {
      return res.status(404).json({ message: "Service tidak ditemukan" });
    }
    const appointmentServices = serviceDocs.map(service => {
      totalDurationMinutes += service.durationMinute;
      totalPrice += service.price;

      return {
        serviceId: service._id,
        serviceName: service.serviceName,
        price: service.price,
        durationMinute: service.durationMinute
      }
    });

    // validasi slot
    const availability = await isConsecutiveSlotAvailable(data.date, data.startTime, totalDurationMinutes);
    if (!availability.available) {
      return res.status(400).json({ 
        message: "Slot waktu tidak tersedia untuk durasi service tersebut"
      });
    }

    const realStart = buildDateTime(data.date, availability.startTime as string);
    const realEnd = new Date(realStart.getTime() + totalDurationMinutes * 60000);

    let customerName: string | undefined = undefined
    if (user?.role === "CUSTOMER") {
      customerName = (await UserModel.findById(user.id))?.displayName as string
    } else {
      customerName = data.customerName
    }

    const newAppointment = await AppointmentModel.create({
      date: data.date,
      startTime: realStart,
      endTime: realEnd,
      customerName,
      appointmentType: user?.role === "CUSTOMER" ? "RESERVATION" : "WALKIN",
      customerId: user?.role === "CUSTOMER" ? user.id : null,
      capsterId: user?.role === "STAFF" ? user.id : data.capsterId,
      services: appointmentServices,
      totalPrice,
      rescheduleHistory: []
    });

    res.status(201).json({
      message: "Appointment berhasil dibuat",
      data: newAppointment
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: "Gagal membuat appointment" })
    }
  }
};

export const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const { date, startTime } = req.body;

    if (user?.role !== "CUSTOMER") {
      return res.status(403).json({ message: "Hanya customer yang dapat melakukan reschedule" });
    }

    const appointment = await AppointmentModel.findById(id);

    if (user?.id !== appointment?.customerId) {
      return res.status(404).json({ message: "Appointment tidak cocok" });
    }

    if (!appointment) {
      return res.status(404).json({ message: "Appointment tidak ditemukan" });
    }

    if (appointment.customerId?.toString() !== user.id) {
      return res.status(403).json({ message: "Anda tidak berhak mengubah appointment ini" });
    }

    // pastikan appointment punya startTime yang valid
    if (!appointment.startTime) {
      return res.status(400).json({ message: "Appointment tidak punya startTime" });
    }

    const now = new Date();
    const oldStart = new Date(appointment.startTime);

    // validasi 2 jam sebelum jadwal lama
    const diffHours = (oldStart.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 2) {
      return res.status(400).json({ message: "Reschedule hanya dapat dilakukan maksimal 2 jam sebelum jadwal" });
    }

    // simpan history
    appointment.rescheduleHistory.push({
      oldDate: appointment.date,
      oldStart: appointment.startTime.toISOString(),
      newDate: date,
      newStart: startTime,

      changedAt: new Date()
    });

    // update data
    appointment.date = date;
    appointment.startTime = new Date(startTime);

    // development pending
    // appointment.endTime = new Date(appointment.startTime.getTime() + (appointment.services.reduce((total, service) => total + service?.durationMinute, 0) * 60000));

    await appointment.save();

    res.status(200).json({
      message: "Reschedule berhasil",
      data: appointment
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal reschedule appointment" });
  }
};


export const changeAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const { reservationStatus } = req.body;
    
    if (user?.role !== "STAFF") {
      return res.status(403).json({ message: "Hanya staff yang boleh mengubah status appointment" });
    }

    const appointment = await AppointmentModel.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment tidak ditemukan" });
    }

    // cek apakah appointment milik staff tersebut
    if (appointment.capsterId?.toString() !== user.id) {
      return res.status(403).json({ message: "Anda tidak berhak mengubah status appointment ini" });
    }

    appointment.reservationStatus = reservationStatus;

    await appointment.save();

    res.status(200).json({
      message: "Status appointment berhasil diubah",
      data: appointment
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengubah status appointment" });
  }
};
