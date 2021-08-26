const jwt = require("jsonwebtoken");
const postEvents = require("./events/postEvent");

const onlineUsers = {};
const onlineAdmins = {};
const onlineGuests = [];

const events = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.query.token && socket.handshake.query.token !== "") {
      try {
        const token = socket.handshake.query.token.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = decoded.data.user;
      } catch (err) {
        console.log(err);
      }
    } else {
      socket.user = {
        id: null,
        type: "0",
      };
    }
    next();
  });

  io.on("connection", (socket) => {
    if (socket.user.type === "1") {
      onlineAdmins[socket.user.id] = socket;
      socket.join("admins");
      console.log("admin connected");
    } else if (socket.user.type === "2") {
      onlineUsers[socket.user.id] = socket;
      socket.join("users");
      console.log("user connected");
    } else {
      onlineGuests.push(socket);
      socket.join("guests");
      console.log("guest connected");
    }

    postEvents(io, socket, { onlineAdmins, onlineUsers, onlineGuests });

    socket.on("disconnect", () => {
      if (socket.user.type === "1") {
        delete onlineAdmins[socket.user.id];
        console.log("Admin Disconnected");
      } else if (socket.user.type === "2") {
        delete onlineUsers[socket.user.id];
        console.log("User Disconnected");
      } else {
        onlineGuests.splice(onlineGuests.indexOf(socket), 1);
        console.log("Guest disconnected");
      }
    });
  });
};

module.exports = { events };
