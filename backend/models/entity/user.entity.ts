import mongoose from "mongoose"

export interface UserItf extends Document {
  _id: string,
  email: string,
  password: string,
  displayName: string,
  role: "USER" | "ADMIN",
  refreshToken: string
  createdAt: Date,
  updatedAt: Date
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
    match: /.+@.+\..+/,
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
    default: "User",
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  },
  refreshToken: {
    type: String,
    maxLength: 255
  }
})

const UserModel = mongoose.model<UserItf>("user", userSchema);
export default UserModel;