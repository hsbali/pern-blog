const postEvents = require("./events/postEvent");
const commentEvents = require("./events/commentEvent");

const events = (io) => {
  io.on("connection", (socket) => {
    console.log("new connection");
    socket.join("guests");

    socket.on("user-auth", () => {
      socket.join("users");
      socket.leave("guests");
      console.log("guest to user");
    });

    socket.on("user-logout", () => {
      socket.leave("users");
      socket.join("guests");
      console.log("user to guest");
    });

    socket.on("admin-auth", () => {
      socket.join("admins");
      socket.leave("guests");
      console.log("guest to admin");
    });

    socket.on("admin-logout", () => {
      socket.leave("admins");
      socket.join("guests");
      console.log("admin to guest");
    });

    socket.on("refresh-fail", () => {
      socket.leave("admins");
      socket.leave("users");
      socket.join("guests");
    });

    postEvents(io, socket);
    commentEvents(io, socket);

    socket.on("disconnect", () => {
      console.log("disconnect");
    });
  });
};

module.exports = { events };
