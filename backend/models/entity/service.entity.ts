import mongoose from "mongoose"

const serviceModel = new mongoose.Schema({
    serviceName: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    durationMinute: {
      type: Number,
      required: true
    }
  }, { timestamps: true }
)

export default mongoose.model("Service", serviceModel)