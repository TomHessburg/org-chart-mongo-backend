const router = require("express").Router();
const Request = require("../schema/requestSchema.js");

// get single message
router.get("/:id", async (req, res) => {
  try {
    const message = await Request.findById(req.params.id)
      .populate("sender_id")
      .populate("recipient_id")
      .exec();

    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ message: "Sorry, unable to find that message." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Sorry, there was an error with the server." });
  }
});

// get all recipient messages
router.get("/recipient/:recipientid", async (req, res) => {
  try {
    const messages = await Request.find({
      recipient_id: req.params.recipientid
    })
      .populate("sender_id")
      .populate("recipient_id")
      .exec();

    if (messages) {
      res.status(200).json(messages);
    } else {
      res.status(404).json({ message: "Sorry, unable to find messages." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Sorry, there was an error with the server." });
  }
});

// get all sender messages
router.get("/sender/:senderid", async (req, res) => {
  try {
    const messages = await Request.find({ sender_id: req.params.senderid })
      .populate("sender_id")
      .populate("recipient_id")
      .exec();

    if (messages) {
      res.status(200).json(messages);
    } else {
      res.status(404).json({ message: "Sorry, unable to find messages." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Sorry, there was an error with the server." });
  }
});

// add a message
router.post("/", async (req, res) => {
  try {
    const newMessage = await Request.create(req.body);

    res.status(201).json(newMessage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Sorry, there was an error with the server." });
  }
});

// update a message
router.put("/:id", async (req, res) => {
  try {
    const newMessage = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        useFindAndModify: false
      }
    );

    res.status(201).json(newMessage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Sorry, there was an error with the server." });
  }
});

// delete a message
router.delete("/:id", async (req, res) => {
  try {
    const deletedMessage = await Request.findByIdAndDelete(
      req.params.id
    ).exec();

    res.status(201).json({ message: "Deleted message" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Sorry, there was an error with the server." });
  }
});

module.exports = router;
