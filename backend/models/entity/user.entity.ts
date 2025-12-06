import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
    match: /.+@.+\..+/,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 255
  },
  password: {
    type: String,
    required: true,
    maxLength: 255
  },
  displayName: {
    type: String,
    maxLength: 10,
    required: false,
    default: "user",
  },
  role: {
    type: String,
    enum: ["CUSTOMER", "STAFF", "ADMIN"],
    default: "CUSTOMER"
  },
  phoneNumber: {
    type: String,
    maxLength: 15,
    required: false
  },
  refreshToken: {
    type: String,
    maxLength: 255
  }
}, {
  timestamps: true
})

export default mongoose.model("User", userSchema)