const express = require("express");
const pool = require("./../../db");

const auth = require("./../../middleware/auth");

const router = express.Router();

// @route       GET /comments
// @desc        Get All Approved comments
// @access      Public
router.get("/posts/:postId", async (req, res) => {
  try {
    const getComments = await pool.query(
      "SELECT c.comment_id, c.content, c.url, c.create_time, c.is_approved, u.user_id, u.username, u.email, u.user_type FROM tbl_comment c JOIN tbl_user u ON c.user_id = u.user_id WHERE c.is_approved = true AND c.post_id = $1 ORDER BY create_time DESC OFFSET $2 LIMIT $3",
      [
        parseInt(req.params.postId),
        parseInt(req.query.offset),
        parseInt(req.query.limit),
      ]
    );
    const comments = getComments.rows;

    return res.json({ status: 1, msg: "Comments loaded", data: comments });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

// @route       GET /posts
// @desc        Get All Approved and user comments
// @access      Public
router.get("/users/posts/:postId", auth(2), async (req, res) => {
  try {
    const getComments = await pool.query(
      "SELECT c.comment_id, c.content, c.url, c.create_time, c.is_approved, u.user_id, u.username, u.email, u.user_type FROM tbl_comment c JOIN tbl_user u ON c.user_id = u.user_id WHERE (c.is_approved = true OR c.user_id = $1) AND c.post_id = $2 ORDER BY create_time DESC OFFSET $3 LIMIT $4",
      [
        req.user.id,
        parseInt(req.params.postId),
        parseInt(req.query.offset),
        parseInt(req.query.limit),
      ]
    );
    const comments = getComments.rows;

    return res.json({ status: 1, msg: "Comments loaded", data: comments });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

module.exports = router;
