const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {

  const token =
  req.body.token /* || req.query.token || req.headers["x-access-token"] */;

  if (!token) {
    return res.send("");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded;
  } catch (err) {
    return res.send("");
  }
  return next();
};

module.exports = verifyToken;