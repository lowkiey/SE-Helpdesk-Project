const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const authenticationMiddleware = (req, res, next) => {
  const cookie = req.cookies;

  if (!cookie) {
    return res.status(401).json({ message: "No cookie provided" });
  }

  const token = cookie.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(401).json({message: "Invalid token" });
    }

    req.user = decoded.user;
    next();
  });
};

module.exports = authenticationMiddleware;