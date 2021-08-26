const express = require("express");
const pool = require("./../../db");

const router = express.Router();

// @route       GET /posts
// @desc        Get All posts
// @access      Public
router.get("/", async (req, res) => {
  try {
    const getPosts = await pool.query(
      "SELECT p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, u.user_id, u.username, u.email, u.profile_id, u.user_type FROM tbl_post p JOIN tbl_user u ON p.author_id = u.user_id LIMIT $1",
      [parseInt(req.query.limit)]
    );
    const posts = getPosts.rows;

    return res.json({ status: 1, msg: "Posts loaded", data: posts });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

module.exports = router;
