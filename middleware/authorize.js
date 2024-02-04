const jwt = require("jsonwebtoken");

// because this middleware function will be used with the route on line 147 in users.js (the root route "/")
// it knows that the req is coming from that route, and can therefore also access the information
// sent from the client in the request
module.exports = (req, res, next) => {
  // get the info from the header authorization sent from the client with their get request to the root "/" route
  const bearerTokenString = req.headers.authorization;

  // check to make sure the client sent the header authorization with their get request
  // if they didn't let them know they need to send it
  if (!bearerTokenString) {
    return res
      .status(401)
      .json({
        error: "Resource requires Bearer token in Authorization header",
      });
  }

  // turn the header authorization from a string to an array split on the space in between `Bearer token`
  const splitBearerTokenString = bearerTokenString.split(" ");

  // check to see that the header authorization was only two words, if it wasn't let the user know
  // they did not pass header authorization properly
  if (splitBearerTokenString.length !== 2) {
    return res.status(400).json({ error: "Bearer token is malformed" });
  }

  // get just the token from the array create above with split() which will be index 1 in the array
  const token = splitBearerTokenString[1];

  // use jsonwebtoken library to verify token
  // as another way to utilize .verify() ... we used a different means to do this in the users.js file with the route /current
  // we can use an optional 3rd argument, which is an anonymous callback function that
  // includes a first argument for any errors, and a 2nd argument for a variable that
  // will hode the decoded token info (can be called anything, but 'decoded' is practical)
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    // if there's an error, let client side know
    // this will stop the rest of this code from running, and the root route "/" will not be accessible
    if (err) {
      return res.status(403).json({ error: "Invalid JWT" });
    }
    /* if we wanted to pass info about a specific user to the root route "/"
         we could do this (similar to what we did with the /current route)...req.user would then be accesible in our 
         code with the route set up after line 148

		   delete req.password;
           req.user = decoded;
        */

    // assuming our token was validated, we then tell this function to proceed to exectute
    // the rest of the code in our root "/" route setup
    // NOTE: this comes from the 3rd paramater passed in above when we set this function up with
    // (req, res, next)
    next();
  });
};
