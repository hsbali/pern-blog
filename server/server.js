require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
const { events } = require("./events");

var cookieParser = require("cookie-parser");
const cors = require("cors");

// CORS middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// cookies-parser
app.use(cookieParser());

// express req.body
app.use(express.json());

events(io);

app.get("/", (req, res) => {
  return res.json({ status: 1, msg: "API Running :)" });
});

app.use("/api/v1/users", require("./routes/api/users"));
app.use("/api/v1/auth", require("./routes/api/auth"));
app.use("/api/v1/posts", require("./routes/api/posts"));
app.use("/api/v1/comments", require("./routes/api/comments"));

app.use("/api/v1/admin/users", require("./routes/api/admin/users"));
app.use("/api/v1/admin/auth", require("./routes/api/admin/auth"));
app.use("/api/v1/admin/posts", require("./routes/api/admin/posts"));
app.use("/api/v1/admin/comments", require("./routes/api/admin/comments"));

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
