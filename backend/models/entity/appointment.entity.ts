import mongoose from "mongoose"

const appointmentServiceSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true },
  serviceName: String,
  price: Number,
  durationMinute: Number
});


const rescheduleSchema = new mongoose.Schema({
  oldDate: String,
  oldStart: String,
  newDate: String,
  newStart: String,
  changedAt: {
    type: Date,
    default: Date.now
  }
});

const appointmentSchema = new mongoose.Schema({
    appointmentType: {
      type: String,
      enum: ["RESERVATION", "WALKIN"],
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    customerName: {
      type: String,
      default: null
    },
    capsterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reservationStatus: {
      type: String,
      enum: ["WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      required: true,
      default: "WAITING"
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    date: {
      type: String,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    services: [appointmentServiceSchema],
    rescheduleHistory: [rescheduleSchema]
  }, {
    timestamps: true
  }
)

appointmentSchema.set("toJSON", {
  transform: function (doc, ret) {
    const obj: any = { ...ret };
    
    obj.id = obj._id;
    delete obj._id;

    return obj;
  }
});

export default mongoose.model("Appointment", appointmentSchema)