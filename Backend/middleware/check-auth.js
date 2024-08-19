const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "the_car_is_expensive");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
}