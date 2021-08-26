const socketAuth = require("../utils/socketAuth");

const pool = require("./../db");

const postEvents = (io, socket, users) => {
  socket.on("new-post", async (data) => {
    try {
      const isAuth = socketAuth(socket, data.token);
      if (!isAuth.result) {
        return socket.emit("set-alert", isAuth.data);
      }

      if (!data.post.title && data.post.title !== "") {
        return socket.emit("set-alert", {
          msg: "Title is Required",
          type: "danger",
        });
      }
      if (["1", "2", "3"].indexOf(data.post.status) === -1) {
        return socket.emit("set-alert", {
          msg: "Enter valid status",
          type: "danger",
        });
      }

      const setNewPost = await pool.query(
        "INSERT INTO tbl_post (title, content, tags, status, create_time, update_time, author_id) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $5) RETURNING *",
        [
          data.post.title,
          data.post.content,
          data.post.tags,
          data.post.status,
          isAuth.data.id,
        ]
      );
      const postId = setNewPost.rows[0].post_id;

      const getPost = await pool.query(
        "SELECT p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, u.user_id, u.username, u.email, u.profile_id, u.user_type FROM tbl_post p JOIN tbl_user u ON p.author_id = u.user_id WHERE p.post_id = $1",
        [postId]
      );
      const post = getPost.rows[0];

      console.log(postId, post);

      socket.to("guests").to("users").emit("new-publish", post);

      return socket.emit("set-alert", { msg: "Post Saved", type: "success" });
    } catch (err) {
      console.log(err.message);
      return socket.emit("set-alert", {
        msg: "Something went wrong!",
        type: "danger",
      });
    }
  });
};

module.exports = postEvents;
