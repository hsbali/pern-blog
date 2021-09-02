const jwt = require("jsonwebtoken");

module.exports = function auth(...types) {
  return (req, res, next) => {
    // Check if not token
    if (!req.header("Authorization")) {
      return res.status(401).json({ status: 0, msg: "Access Denied" });
    }

    const token = req.header("Authorization").replace("Bearer ", "");

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!types.includes(decoded.data.user.type)) {
        req.user = decoded.data.user;
      }

      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ msg: "Access Denied" });
    }
  };
};
