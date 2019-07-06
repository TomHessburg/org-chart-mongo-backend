const mongoose = require("mongoose");

const request = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    subject: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 40
    },
    content: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 280
    },
    accepted: {
      type: Boolean,
      default: false
    },
    denied: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Request = mongoose.model("request", request);

module.exports = Request;
