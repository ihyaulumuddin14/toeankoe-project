import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    capsterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    checkInTime: Date ,
    checkOutTime: Date ,
    attendanceStatus: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE", "OFF"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);