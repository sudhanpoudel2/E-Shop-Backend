import mongoose, { Schema } from "mongoose";
import validator from "validator";

const customerSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "fullname is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validator: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Passcode is required"],
    },
    contact: {
      type: Number,
      required: [true, "contaci is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
