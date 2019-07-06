const jwt = require("jsonwebtoken");

const jwtKey = process.env.JWT_SECRET || "totaly secrative";

function authenticate(req, res, next) {
  // a piece of middleware to run before any routes we wish to be protected
  // first we check to make sure the request has an auth header containing a jwt token
  const token = req.get("Authorization");

  if (token) {
    // then we verify that token
    jwt.verify(token, jwtKey, (err, decoded) => {
      // if there was an error we return the error
      if (err) return res.status(401).json(err);

      req.decoded = decoded;
      // else move on the next middleware
      next();
    });
  } else {
    return res.status(401).json({
      error: "No token provided, must be set on the Authorization Header"
    });
  }
}

function generateToken(user) {
  // takes a users credentialls and generates a jwt for them
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, jwtKey, options);
}

module.exports = {
  authenticate,
  generateToken
};
