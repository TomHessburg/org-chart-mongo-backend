const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    full_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: "undeclared"
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      default: null
    },
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      default: null
    },
    account_type: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", user);

module.exports = User;
