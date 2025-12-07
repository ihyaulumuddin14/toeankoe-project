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

serviceModel.set("toJSON", {
  transform: function (doc, ret) {
    const obj: any = { ...ret };
    
    obj.id = obj._id;
    delete obj._id;

    return obj;
  }
});

export default mongoose.model("Service", serviceModel)