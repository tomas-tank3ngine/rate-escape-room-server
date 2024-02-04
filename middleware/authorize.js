const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const bearerTokenString = req.headers.authorization;

  if (!bearerTokenString) {
    return res
      .status(401)
      .json({
        error: "Resource requires Bearer token in Authorization header",
      });
  }

  // turn the header authorization from a string to an array split on the space in between `Bearer token`
  const splitBearerTokenString = bearerTokenString.split(" ");


  if (splitBearerTokenString.length !== 2) {
    return res.status(400).json({ error: "Bearer token is malformed" });
  }

  //get token from bearer
  const token = splitBearerTokenString[1];

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid JWT" });
    }
    next();
  });
};
