const mongoose = require("mongoose");

const department = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true
  },
  department_head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    default: null
  }
});

const Department = mongoose.model("department", department);

module.exports = Department;
