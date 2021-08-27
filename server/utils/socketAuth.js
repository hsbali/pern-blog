const jwt = require("jsonwebtoken");

const socketAuth = (socket, token, types) => {
  if (!token) {
    return { result: false, data: { msg: "Access Denied", type: "danger" } };
  }

  const onlyToken = token.replace("Bearer ", "");

  // Verify token
  try {
    const decoded = jwt.verify(onlyToken, process.env.JWT_SECRET);
    if (!types.includes(decoded.data.user.type)) {
      return { result: false, data: { msg: "Access Denied", type: "danger" } };
    }

    return { result: true, data: decoded.data.user };
  } catch (err) {
    console.log(err);
    return { result: false, data: { msg: "Access Denied", type: "danger" } };
  }
};

module.exports = socketAuth;
