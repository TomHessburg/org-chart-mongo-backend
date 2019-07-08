const { clearHash } = require("./cache.js");

// a piece of middle ware which will run only if the put/post/delete
// controller runs. Not usable everywhere as of right now because
// everywhere dosnt refer to ID in req.params, plus some controllers
// require clearing the cash for multiple users, but this is used in most
// pieces of the API.
module.exports = async (req, res, next) => {
  await next();
  clearHash(req.params.id);
};
