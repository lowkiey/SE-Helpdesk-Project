const jwt = require("jsonwebtoken");
const secretKey = "s1234rf,.lp";

module.exports = function authenticationMiddleware(req, res, next) {
  const cookies = req.cookies;

  if (!cookies) {
    return res.status(401).json({ message: "No Cookie provided" });
  }

  const token = cookies.token;
  if (!token) {
    return res.status(405).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded.user;
    next();
  });
};
