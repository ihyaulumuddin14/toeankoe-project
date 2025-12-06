import { DAILY_SLOTS } from "../constant/dailySlot";
import AppointmentModel from "../models/entity/appointment.entity.js";
import { buildDateTime } from "./build-date-time";

export const isConsecutiveSlotAvailable = async (date: string, requiredMinutes: number) => {
  const requiredSlots = requiredMinutes / 45;

  const appointments = await AppointmentModel.find({ date });

  const slotStatus = DAILY_SLOTS.map(slot => {
    const slotStart = buildDateTime(date, slot.start);
    const slotEnd = buildDateTime(date, slot.end);

    const overlapping = appointments.some(app => {
      if (!app.startTime || !app.endTime) return false;

      const appStart = new Date(app.startTime);
      const appEnd = new Date(app.endTime);

      return appStart < slotEnd && appEnd > slotStart;
    });

    return overlapping;
  });

  for (let i = 0; i <= slotStatus.length - requiredSlots; i++) {
    const slice = slotStatus.slice(i, i + requiredSlots);
    const isAllFree = slice.every(s => s === false);

    if (isAllFree) {
      return {
        available: true,
        startSlotIndex: i,
        startTime: DAILY_SLOTS[i].start,
        slots: DAILY_SLOTS.slice(i, i + requiredSlots)
      };
    }
  }

  return { available: false };
};
