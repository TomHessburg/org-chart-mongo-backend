const router = require("express").Router();
const Department = require("../schema/departmentSchema.js");
const User = require("../schema/userSchema.js");

// get a single department by id
router.get("/:id", async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate("department_head")
      .exec();

    res.status(200).json(department);
  } catch (err) {
    res.status(500).json({ message: "Sorry, there was a server error." });
  }
});

// get all departments in a company
router.get("/company/:id", async (req, res) => {
  try {
    const departments = await Department.find({ company_id: req.params.id })
      .populate("department_head")
      .exec();

    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ message: "Sorry, there was a server error." });
  }
});

// edit a department by id
router.put("/:id", async (req, res) => {
  try {
    const department = await Department.findOneAndUpdate(
      req.params.id,
      req.body,
      { new: true, useFindAndModify: false }
    )
      .populate("department_head")
      .exec();

    if (req.body.department_head) {
      // if theres a new department head, change their department
      console.log("changing dept head");
      const newUser = await User.findOneAndUpdate(
        req.body.department_head,
        {
          department_id: department._id
        },
        { new: true, useFindAndModify: false }
      );
    }

    res.status(200).json(department);
  } catch (err) {
    res.status(500).json({ message: "Sorry, there was a server error." });
  }
});

// delete a department by id
router.delete("/:id", async (req, res) => {
  try {
    // deletes department
    const department = await Department.findByIdAndDelete(req.params.id).exec();
    // update all users with this department id to have a department id of null
    const updatedUsers = await User.updateMany(
      { department_id: req.params.id },
      {
        department_id: null
      }
    );

    res.status(201).json({ message: "Successfully deleted department." });
  } catch (e) {
    res.status(500).json({ message: "Sorry, there was a server error." });
  }
});

// post a new department.
// Must include the ID of the user who is to be the
// department head as department_head
router.post("/", async (req, res) => {
  try {
    // create department
    const department = await Department.create(req.body);

    // update the use who is the department head to have a department_id
    // of the new departments ID
    const user = await User.findOneAndUpdate(
      req.body.department_head,
      {
        department_id: department._id
      },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json(department);
  } catch (e) {
    res.status(500).json({ message: "Sorry, there was a server error." });
  }
});

module.exports = router;
