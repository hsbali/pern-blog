const socketAuth = require("../utils/socketAuth");

const pool = require("./../db");

const postEvents = (io, socket) => {
  socket.on("new-post", async (data) => {
    try {
      const isAuth = socketAuth(socket, data.token, ["1"]);
      if (!isAuth.result) {
        return socket.emit("set-alert", isAuth.data);
      }

      if (!data.post.title && data.post.title === "") {
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

      if (data.post.status === "2" && data.post.content === "") {
        return socket.emit("set-alert", {
          msg: "Content is required for Published posts",
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

      if (data.post.status === "2") {
        socket.to("guests").to("users").emit("new-publish", post);
      }

      return socket.emit("set-alert", { msg: "Post Saved", type: "success" });
    } catch (err) {
      console.log(err.message);
      return socket.emit("set-alert", {
        msg: "Something went wrong!",
        type: "danger",
      });
    }
  });

  socket.on("edit-post", async (data) => {
    try {
      const isAuth = socketAuth(socket, data.token, ["1"]);
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

      if (data.post.status === "2" && data.post.content === "") {
        return socket.emit("set-alert", {
          msg: "Content is required for Published posts",
          type: "danger",
        });
      }

      const setNewPost = await pool.query(
        "UPDATE tbl_post SET title=$1, content=$2, tags=$3, status=$4 WHERE post_id = $5",
        [
          data.post.title,
          data.post.content,
          data.post.tags,
          data.post.status,
          data.post.post_id,
        ]
      );

      const getPost = await pool.query(
        "SELECT p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, u.user_id, u.username, u.email, u.profile_id, u.user_type FROM tbl_post p JOIN tbl_user u ON p.author_id = u.user_id WHERE p.post_id = $1",
        [data.post.post_id]
      );
      const post = getPost.rows[0];

      if (data.post.status.toString() === "2") {
        socket.to("guests").to("users").emit("edit-publish", post);
      } else {
        socket.to("guests").to("users").emit("delete-publish", post);
      }

      socket.emit("edit-publish", post);

      return socket.emit("set-alert", { msg: "Post Updated", type: "success" });
    } catch (err) {
      console.log(err.message);
      return socket.emit("set-alert", {
        msg: "Something went wrong!",
        type: "danger",
      });
    }
  });

  socket.on("delete-post", async (data) => {
    try {
      const isAuth = socketAuth(socket, data.token, ["1"]);
      if (!isAuth.result) {
        return socket.emit("set-alert", isAuth.data);
      }

      const delPost = await pool.query(
        "DELETE FROM tbl_post WHERE post_id = $1",
        [data.post.post_id]
      );

      if (data.post.status.toString() === "2") {
        socket.to("guests").to("users").emit("delete-publish", data.post);
      }

      socket.emit("delete-publish", data.post);

      return socket.emit("set-alert", { msg: "Post Deleted", type: "success" });
    } catch (err) {
      console.log(err.message);
      return socket.emit("set-alert", {
        msg: "Something went wrong!",
        type: "danger",
      });
    }
  });

  socket.on("update-fav-list", async (data) => {
    const isAuth = socketAuth(socket, data.token, ["2"]);
    if (!isAuth.result) {
      return socket.emit("set-alert", isAuth.data);
    }

    if (data.result.old < data.result.new) {
      const updatePosts = await pool.query(
        "UPDATE tbl_fav SET position = (CASE WHEN position = $1 THEN $2 WHEN position < $2 + 1 AND NOT (position < $1) THEN position - 1 ELSE position END) WHERE user_id = $3",
        [data.result.old, data.result.new, isAuth.data.id]
      );
    } else if (data.result.old > data.result.new) {
      const updatePosts = await pool.query(
        "UPDATE tbl_fav SET position = (CASE WHEN position = $1 THEN $2 WHEN position < $2 - 1 AND NOT (position > $1) THEN position + 1 ELSE position END) WHERE user_id = $3",
        [data.result.old, data.result.new, isAuth.data.id]
      );
    }

    // socket.to("users").emit("on-update-fav-list", {
    //   userId: isAuth.data.id,
    //   result: data.result,
    // });

    // return socket.emit("set-alert", { msg: "List Updated", type: "success" });
  });
};

module.exports = postEvents;
