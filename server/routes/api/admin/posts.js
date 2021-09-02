const express = require("express");
const pool = require("./../../../db");

const auth = require("./../../../middleware/auth");

const router = express.Router();

// @route       GET /posts
// @desc        Get All posts
// @access      Public
router.get("/", auth(1), async (req, res) => {
  try {
    const getPosts = await pool.query(
      "SELECT p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, u.user_id, u.username, u.email, u.user_type, COUNT(c.post_id) AS comment_count FROM tbl_user u JOIN tbl_post p ON u.user_id = p.author_id LEFT JOIN tbl_comment c ON p.post_id = c.post_id GROUP BY p.post_id, u.user_id, u.username, u.email, u.user_type ORDER BY update_time DESC OFFSET $1 LIMIT $2",
      [parseInt(req.query.offset), parseInt(req.query.limit)]
    );
    const posts = getPosts.rows;

    return res.json({ status: 1, msg: "Posts loaded", data: posts });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

// @route       GET /posts
// @desc        Get Published Post by id
// @access      Public
router.get("/:post_id", auth(1), async (req, res) => {
  try {
    const getPost = await pool.query(
      "SELECT p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, u.user_id, u.username, u.email, u.profile_id, u.user_type FROM tbl_post p JOIN tbl_user u ON p.author_id = u.user_id WHERE p.post_id = $1",
      [parseInt(req.params.post_id)]
    );
    const post = getPost.rows[0];

    return res.json({ status: 1, msg: "Posts loaded", data: post });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

module.exports = router;
