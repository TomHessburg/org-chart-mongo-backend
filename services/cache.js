const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

// set up clinet
const client = redis.createClient("redis://127.0.0.1:6379");
// by default, hget requires a cb. this prevents us from needing to specift
// a callback
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

// add a method to the mongoose prototype which allows us to specify
// which calls wed like to cache
mongoose.Query.prototype.cache = function(options = {}) {
  // specify that we want to use the cache
  this.useCache = true;
  // key of user to place this nested hash into
  this.hashKey = JSON.stringify(options.key || "");
  return this;
};

// patching the exec function to add requests to redis
mongoose.Query.prototype.exec = async function() {
  // if were not caching anything, just do the normal stuff!
  if (!this.useCache) {
    console.log("not caching");
    return exec.apply(this, arguments);
  }

  // the key for this specific request,
  // string containint the query + the name of the
  // collection being queried to.
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  // see if we have a value for key in redis
  const cacheValue = await client.hget(this.hashKey, key);

  // if we do, return that
  if (cacheValue) {
    console.log("returning from cache");
    const doc = JSON.parse(cacheValue);
    // if its an array, handel
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  // else issue the query and store the value in redis
  // (if we just returned, exec.apply in this instance
  // is what is normally called on exec)
  const result = await exec.apply(this, arguments);

  //-----
  // cache the value in the user (hashKey) with a key of the
  // above key, and the value of the result

  // currently having issues with this not actually expiring...
  // not sure if its a difference between hset and set, but its
  // 2 am on a sunday as im writing this so ill probably just leave
  // this be for the time being hahaha
  client.hset(this.hashKey, key, JSON.stringify(result));
  client.expire(this.hashKey, 1200);
  console.log("returning from mongo");
  return result;
};

// clearHash is a function to clear a specific users redis cache
// Its used in the cleanCache middleware for any controllers who
// reference and id in req.params, and is also used independently
// in several places where it either dosnt, or i needed more flexibility.
module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
