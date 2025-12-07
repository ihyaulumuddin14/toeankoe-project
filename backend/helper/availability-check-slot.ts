import { DAILY_SLOTS } from "../constant/dailySlot";
import AppointmentModel from "../models/entity/appointment.entity.js";
import { buildDateTime } from "./build-date-time";

export const isConsecutiveSlotAvailable = async (
  date: string, 
  startTime: string, 
  requiredMinutes: number
) => {
  const startSlotIndex = DAILY_SLOTS.findIndex(slot => slot.start === startTime);
  
  if (startSlotIndex === -1) {
    return { 
      available: false, 
      reason: "Waktu mulai tidak valid" 
    };
  }

  const requiredSlots = Math.ceil(requiredMinutes / 45);
  
  if (startSlotIndex + requiredSlots > DAILY_SLOTS.length) {
    return { 
      available: false, 
      reason: "Durasi melebihi jam operasional" 
    };
  }

  const requestedSlots = DAILY_SLOTS.slice(startSlotIndex, startSlotIndex + requiredSlots);

  const appointments = await AppointmentModel.find({ date });
  
  for (const slot of requestedSlots) {
    const slotStart = buildDateTime(date, slot.start);
    const slotEnd = buildDateTime(date, slot.end);
    
    const hasConflict = appointments.some(app => {
      if (!app.startTime || !app.endTime) return false;
      const appStart = new Date(app.startTime);
      const appEnd = new Date(app.endTime);
      
      // Cek overlap
      return appStart < slotEnd && appEnd > slotStart;
    });
    
    if (hasConflict) {
      return { 
        available: false, 
        reason: `Slot ${slot.start}-${slot.end} sudah terisi` 
      };
    }
  }

  return {
    available: true,
    startTime: requestedSlots[0].start,
    endTime: requestedSlots[requestedSlots.length - 1].end,
    slots: requestedSlots
  };
};