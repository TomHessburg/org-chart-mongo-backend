const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const mongoose = require("mongoose");
const { authenticate } = require("./auth/tokenHandlers.js");

// seed file
const seedData = require("./seed/seeds.js");

// import routes
const authRouter = require("./routers/authRouter.js");
const userRouter = require("./routers/userRouter.js");
const departmentRouter = require("./routers/departmentRouter.js");
const companyRouter = require("./routers/companyRouter.js");

// server instantiation and middleware
const server = express();
server.use(cors());
server.use(json());
server.use(urlencoded({ extended: true }));
server.use(morgan("dev"));
// route hookup
server.use("/api/auth", authRouter);
server.use("/api/users", authenticate, userRouter);
server.use("/api/departments", authenticate, departmentRouter);
server.use("/api/companies", authenticate, companyRouter);

// server connection
const connect = () => {
  return mongoose.connect("mongodb://localhost:27017/org-chart", {
    useNewUrlParser: true
  });
};

const port = process.env.PORT || 5000;
connect()
  .then(conn => {
    server.listen(port, () => {
      // edit the seed data in seeds.js and run this function to see some preliminary data
      // seedData();
      console.log(`Server listning on port: ${port}`);
    });
  })
  .catch(err => {
    console.log("error connecting to your server", err);
  });
