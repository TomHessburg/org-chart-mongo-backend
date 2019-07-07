const router = require("express").Router();
const User = require("../schema/userSchema.js");

// get single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: "Sorry, we couldnt find that user."
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "There was an error retrieving this user." });
  }
});

// get all users in a company
router.get("/company/:id", async (req, res) => {
  try {
    const users = await User.find({ company_id: req.params.id }).exec();

    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({
        message: "Sorry, we couldnt find those users."
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "There was an error retrieving this companies users." });
  }
});

// update a user by ID
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false
    }).exec();

    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).json({
        message: "Sorry, we couldnt find that user."
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "There was an error retrieving this user." });
  }
});

// delete a user by id
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).exec();

    res.status(201).json({ message: "Successfully deleted user." });
  } catch (e) {
    res
      .status(500)
      .json({ message: "There was an error retrieving this user." });
  }
});

module.exports = router;
