import AppointmentModel from "../models/entity/appointment.entity.js";
import { DAILY_SLOTS } from "../constant/dailySlot.js";
import { buildDateTime } from "./build-date-time.js";
import { Request, Response } from "express";

export const getSlotStatusForDate = async (req: Request, res: Response) => {
  const date = req.query.date as string;
  const appointments = await AppointmentModel.find({ date });

  const dailySlots = DAILY_SLOTS.map(slot => {
    const slotStart = buildDateTime(date, slot.start);
    const slotEnd = buildDateTime(date, slot.end);

    const overlapping = appointments.some(app => {
      if (!app.startTime || !app.endTime) return false;

      const appStart = new Date(app.startTime);
      const appEnd = new Date(app.endTime);

      return appStart < slotEnd && appEnd > slotStart;
    });

    return {
      ...slot,
      status: overlapping ? "OCCUPIED" : "FREE"
    };
  });

  res.status(200).json({
    data: dailySlots
  })
};
