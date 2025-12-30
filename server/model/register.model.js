

const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    registration_type: {
      type: String,
      enum: ["student", "professional"],
      required: true,
    },
    company: {
      type: String,
      required: function () {
        return this.registration_type === "professional";
      },
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Registration", registerSchema);