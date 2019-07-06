const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../schema/userSchema.js");
const bcrypt = require("bcrypt");

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

module.exports = router;
