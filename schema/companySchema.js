const mongoose = require("mongoose");

const company = new mongoose.Schema(
  {
    name: String
  },
  { timestamps: true }
);

const Company = mongoose.model("company", company);

module.exports = Company;
