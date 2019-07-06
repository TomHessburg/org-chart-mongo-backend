var faker = require("faker");

const Department = require("../schema/departmentSchema.js");
const User = require("../schema/userSchema.js");
const Request = require("../schema/requestSchema.js");
const Company = require("../schema/companySchema.js");

const bcrypt = require("bcrypt");

module.exports = async function seedData() {
  const firstUser = await User.create({
    username: faker.internet.userName(),
    password: bcrypt.hashSync("password", 8),
    full_name: faker.name.findName(),
    email: faker.internet.email(),
    title: faker.name.jobTitle(),
    account_type: 2 // account type will be updated depending on permission.
    // 0 == unassigned to a company
    // 1 == employee of a company
    // 2 == owner of a company
  });

  const secondUser = await User.create({
    username: faker.internet.userName(),
    password: bcrypt.hashSync("password", 8),
    full_name: faker.name.findName(),
    email: faker.internet.email(),
    title: faker.name.jobTitle(),
    account_type: 1 // see first user for explination
  });

  const firstCompany = await Company.create({
    name: faker.company.companyName()
  });

  const firstDepartment = await Department.create({
    name: faker.commerce.department(),
    company_id: firstCompany._id, // References the user, use .populate to automatically populate fields like these
    department_head: firstUser._id // Believe I can just use .id, but there are cases in which you cant, and im not 100% clear on those yet, thus jsut running with _id for now
  });

  const firstRequest = await Request.create({
    sender_id: secondUser._id,
    recipient_id: firstUser._id,
    subject: faker.lorem.word(),
    content: faker.lorem.sentence()
  });
};
