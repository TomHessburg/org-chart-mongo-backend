const router = require("express").Router();
const User = require("../schema/userSchema.js");
const Department = require("../schema/departmentSchema.js");
const bcrypt = require("bcrypt");
const { authenticate, generateToken } = require("../auth/tokenHandlers.js");

router.post("/register", async (req, res) => {
  const { username, full_name, email, password, company_id } = req.body;

  if (username && full_name && email && password) {
    hashedPassword = bcrypt.hashSync(password, 8);
    if (company_id) {
      // if a company id is present, user type is automaticall set to 1
      try {
        const newUser = await User.create({
          username,
          full_name,
          password: hashedPassword,
          email,
          company_id,
          title: req.body.title || "undeclared", // not a required field, but pass if it if you want
          manager_id: req.body.manager_id || null,
          department_id: req.body.department_id || null,
          account_type: 1
        });

        res.status(201).json({
          message: "We've added this user to your company",
          user: newUser
        });
      } catch (e) {
        res
          .status(500)
          .json({ message: "There was an issue with out servers." });
      }
    } else {
      // if making a new user, dont need to specify account type
      try {
        const newUser = await User.create({
          username,
          full_name,
          password: hashedPassword,
          email
        });

        res.status(201).json({
          message: "We've created your new account.",
          user: newUser
        });
      } catch (e) {
        res
          .status(500)
          .json({ message: "There was an issue with out servers." });
      }
    }
  } else {
    res.status(404).json({ message: "please provide all credentials" });
  }
});

router.post("/login", async (req, res) => {
  //destructure username and password
  const { username, password } = req.body;

  try {
    // find the user
    const curUser = await User.findOne({ username })
      .populate("company_id")
      .populate("manager_id")
      .populate("department_id")
      .exec();

    // check for possword correctness
    if (bcrypt.compareSync(password, curUser.password)) {
      const token = generateToken(curUser);
      let teamMates = [];
      let departments = [];
      // if the user is part of a company, find team mates and departments for
      // that company
      if (curUser["company_id"]) {
        //find team mates at this users company
        teamMates = await User.find({
          company_id: curUser.company_id._id
        })
          .populate("department_id")
          .populate("manager_id");
        // find departments at this users company
        departments = await Department.find({
          company_id: curUser.company_id._id
        }).populate("department_head");
      }

      // send back a message, jwt token, the user, the departments, and company team mates.
      res.status(200).json({
        message: "Successfully logged in.",
        token,
        user: curUser,
        departments: departments.map(dep => {
          return {
            id: dep._id,
            name: dep.name,
            department_head: {
              full_name: dep.department_head.full_name,
              username: dep.department_head.username,
              email: dep.department_head.email,
              id: dep.department_head._id
            }
          };
        }),
        teamMates: teamMates.map(m => {
          return {
            id: m._id,
            username: m.username,
            title: m.title,
            full_name: m.full_name,
            manager_id: m.manager_id,
            department_id: m.department_id
          };
        })
      });
    } else {
      // handel incorrect credentials
      res
        .status(404)
        .json({ message: "sorry, please supply correct user info" });
    }
  } catch (err) {
    // toss back an error should one occur
    res
      .status(500)
      .json({ message: "Sorry, there was an error handeling your request." });
  }
});

module.exports = router;
