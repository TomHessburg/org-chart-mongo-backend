const router = require("express").Router();
const Company = require("../schema/companySchema.js");
const User = require("../schema/userSchema.js");
const cleanCache = require("../services/cleanCache.js");
const { clearCache } = require("../services/cache.js");

// get all companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().exec();

    if (companies) {
      res.status(200).json(companies);
    } else {
      res.status(404).json({
        message: "Sorry, we couldnt find any companies."
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error connection to the server."
    });
  }
});

// get company by id
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).cache({
      key: req.params.id
    });

    if (company) {
      res.status(200).json(company);
    } else {
      res.status(404).json({
        message: "Sorry, we couldnt find that company."
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error connection to the server."
    });
  }
});

// create a company and send the ID of the user who created it
router.post("/", async (req, res) => {
  try {
    if (req.body.name && req.body.user_id) {
      const newCompany = await Company.create({
        name: req.body.name
      });
      // update user who created the company
      const updatedUser = await User.findByIdAndUpdate(
        req.body.user_id,
        {
          company_id: newCompany._id,
          account_type: 2 // 2 === owner of company
        },
        {
          new: true,
          useFindAndModify: false
        }
      );

      if (newCompany) {
        res.status(201).json(newCompany);
        clearCache(req.body.user_id);
      } else {
        res.status(404).json({
          message: "Unable to create this company."
        });
      }
    } else {
      res.status(404).json({
        message:
          "please mke sure to send the name of the company, as well as the ID of the creator as 'user_id'"
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error connection to the server."
    });
  }
});

// update a company.
router.put("/:id", cleanCache, async (req, res) => {
  try {
    const newCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        useFindAndModify: false
      }
    );

    if (newCompany) {
      res.status(201).json(newCompany);
    } else {
      res.status(404).json({
        message: "Unable to update this company."
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error connection to the server."
    });
  }
});

// delete a company
router.delete("/:id", cleanCache, async (req, res) => {
  try {
    // delete the company
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);

    // update all users in this company to no longer be a part of a ocmpany
    const updatedUsers = await User.updateMany(
      { company_id: req.params.id },
      {
        company_id: null,
        account_type: 0,
        department_id: null
      }
    );

    res.status(201).json({
      message: "Deleted company."
    });
  } catch (err) {
    res.status(500).json({
      message: "Error connection to the server."
    });
  }
});

// _______
// _______
// _______
// _______
// _______

// this is just a practice endpoint for implementing a
// basic redis cache for a single endpoint. Obviously a bit
// basic, but just to get the hang of it.

// get company by id
/*
router.get("/redispractice/:id", async (req, res) => {
  // connects to our redis instance
  const redis = require("redis");
  const redisUrl = "redis://127.0.0.1:6379";
  const client = redis.createClient(redisUrl);
  // util gives us promisify, promisifies redisClient.get
  // so that we dont have to pass it a cb.
  const util = require("util");
  client.get = util.promisify(client.get);

  try {
    // DO WE HAVE ANY CACHED DATA IN REDIS RELATED TO THIS QUERY?

    // can await because this is promisified
    const cachedCompany = await client.get(req.params.id);

    //IF YES, RETURN IT
    if (cachedCompany) {
      console.log("SERVING FROM CACHE!");
      return res.status(200).json(JSON.parse(cachedCompany));
    }

    // ELSE, CONTINUE AND UPDATE OUT CACH TO STORE OUR DATA
    const company = await Company.findById(req.params.id).exec();

    if (company) {
      console.log("SERVING FROM MONGO!");
      res.status(200).json(company);

      // if we get this far, company wasnt in our cache, thus we
      // must add it.
      // the second too arguments can be read as "Expire after 60 seconds"
      client.set(req.params.id, JSON.stringify(company), "EX", 60);
    } else {
      res.status(404).json({
        message: "Sorry, we couldnt find that company."
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error connection to the server."
    });
  }
});
*/

module.exports = router;
