import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    sendTime: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

notificationSchema.set("toJSON", {
  transform: function (doc, ret) {
    const obj: any = { ...ret };
    
    obj.id = obj._id;
    delete obj._id;

    return obj;
  }
});

export default mongoose.model("Notification", notificationSchema);