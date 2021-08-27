const express = require("express");
const pool = require("./../../../db");

const auth = require("./../../../middleware/auth");

const router = express.Router();

// @route       GET /posts
// @desc        Get All Approved and user comments
// @access      Public
router.get("/", auth, async (req, res) => {
  try {
    const getComments = await pool.query(
      "SELECT c.comment_id, c.content, c.url, c.create_time, c.is_approved, u.user_id, u.username, u.email, u.user_type, p.title FROM tbl_comment c JOIN tbl_user u ON c.user_id = u.user_id JOIN tbl_post p ON c.post_id = p.post_id ORDER BY create_time DESC OFFSET $1 LIMIT $2",
      [parseInt(req.query.offset), parseInt(req.query.limit)]
    );
    const comments = getComments.rows;

    return res.json({ status: 1, msg: "Comments loaded", data: comments });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

module.exports = router;
