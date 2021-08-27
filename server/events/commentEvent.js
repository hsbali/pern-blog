const socketAuth = require("../utils/socketAuth");

const pool = require("../db");

const commentEvents = (io, socket) => {
  socket.on("new-user-comment", async (data) => {
    try {
      const isAuth = socketAuth(socket, data.token, ["2"]);
      if (!isAuth.result) {
        return socket.emit("set-alert", isAuth.data);
      }

      const newComment = await pool.query(
        "INSERT INTO tbl_comment (content, url, user_id, post_id) values ($1, $2, $3, $4) RETURNING *",
        [
          data.comment.content,
          data.comment.url,
          isAuth.data.id,
          data.comment.post_id,
        ]
      );
      const commentId = newComment.rows[0].comment_id;

      const getComment = await pool.query(
        "SELECT c.comment_id, c.content, c.url, c.create_time, c.is_approved, u.user_id, u.username, u.email, u.user_type, p.title FROM tbl_comment c JOIN tbl_user u ON c.user_id = u.user_id JOIN tbl_post p ON c.post_id = p.post_id WHERE c.comment_id = $1",
        [commentId]
      );
      const comment = getComment.rows[0];

      socket.to("admins").emit("new-comment-toast", comment);

      socket.emit("new-comment", comment);
      return socket.emit("set-alert", {
        msg: "Comment Saved",
        type: "success",
      });
    } catch (err) {
      console.log(err.message);
      return socket.emit("set-alert", {
        msg: "Something went wrong!",
        type: "danger",
      });
    }
  });

  socket.on("update-comment-status", async (data) => {
    try {
      const isAuth = socketAuth(socket, data.token, ["1"]);
      if (!isAuth.result) {
        return socket.emit("set-alert", isAuth.data);
      }

      const updateComment = await pool.query(
        "UPDATE tbl_comment SET is_approved = $1 WHERE comment_id = $2",
        [data.comment.is_approved, data.comment.comment_id]
      );

      const getComment = await pool.query(
        "SELECT c.comment_id, c.content, c.url, c.create_time, c.is_approved, u.user_id, u.username, u.email, u.user_type, p.title FROM tbl_comment c JOIN tbl_user u ON c.user_id = u.user_id JOIN tbl_post p ON c.post_id = p.post_id WHERE c.comment_id = $1",
        [data.comment.comment_id]
      );
      const comment = getComment.rows[0];

      socket.to("users").to("guests").emit("on-update-comment-status", comment);

      socket.emit("on-update-comment-status", comment);
      return socket.emit("set-alert", {
        msg: "Comment Status Updated",
        type: "success",
      });
    } catch (err) {
      console.log(err.message);
      return socket.emit("set-alert", {
        msg: "Something went wrong!",
        type: "danger",
      });
    }
  });

  socket.on("delete-comment", async (data) => {
    try {
      const isAuth = socketAuth(socket, data.token, ["1"]);
      if (!isAuth.result) {
        return socket.emit("set-alert", isAuth.data);
      }

      const deleteComment = await pool.query(
        "DELETE FROM tbl_comment WHERE comment_id = $1",
        [data.comment.comment_id]
      );

      socket.to("users").to("guests").emit("on-delete-comment", data.comment);

      socket.emit("on-delete-comment", data.comment);
      return socket.emit("set-alert", {
        msg: "Comment Deleted",
        type: "success",
      });
    } catch (err) {
      console.log(err.message);
      return socket.emit("set-alert", {
        msg: "Something went wrong!",
        type: "danger",
      });
    }
  });
};

module.exports = commentEvents;
