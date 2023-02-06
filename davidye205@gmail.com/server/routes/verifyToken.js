const jwt = require("jsonwebtoken");

//Run the verify auth function everytime need to verify web token, when accessing protected dadata
function verifyAuth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(verified);
    req.user = verified;
    //Continues to next middleware
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = verifyAuth;
