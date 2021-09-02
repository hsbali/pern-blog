const express = require("express");
const { body, validationResult } = require("express-validator");
const pool = require("./../../db");

const auth = require("./../../middleware/auth");

const router = express.Router();

// @route       GET /posts
// @desc        Get All published posts
// @access      Public
router.get("/", async (req, res) => {
  try {
    const getPosts = await pool.query(
      "SELECT p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, u.user_id, u.username, u.email, u.profile_id, u.user_type FROM tbl_post p JOIN tbl_user u ON p.author_id = u.user_id WHERE p.status = '2' ORDER BY update_time DESC OFFSET $1 LIMIT $2",
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
// @desc        Get All published posts
// @access      Public
router.get("/users/:userId", async (req, res) => {
  try {
    const getPosts = await pool.query(
      "SELECT p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, u.user_id, u.username, u.email, u.profile_id, u.user_type, f.fav_id FROM tbl_post p LEFT JOIN tbl_fav f ON p.post_id = f.post_id AND f.user_id = $3 JOIN tbl_user u ON p.author_id = u.user_id WHERE p.status = '2' ORDER BY update_time DESC OFFSET $1 LIMIT $2",
      [
        parseInt(req.query.offset),
        parseInt(req.query.limit),
        parseInt(req.params.userId),
      ]
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
router.get("/:post_id", async (req, res) => {
  try {
    const getPost = await pool.query(
      "SELECT p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, u.user_id, u.username, u.email, u.profile_id, u.user_type FROM tbl_post p JOIN tbl_user u ON p.author_id = u.user_id WHERE p.status = '2' AND p.post_id = $1",
      [parseInt(req.params.post_id)]
    );
    const post = getPost.rows[0];

    return res.json({ status: 1, msg: "Posts loaded", data: post });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

// @route       GET /posts/favourites
// @desc        Get all Favourite posts
// @access      Private
router.get("/favourites/users/:userId", auth(2), async (req, res) => {
  try {
    const getPosts = await pool.query(
      "SELECT f.fav_id, f.position, p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, p.author_id, u.username, u.email, u.profile_id, u.user_type FROM tbl_fav f JOIN tbl_post p ON f.post_id = p.post_id JOIN tbl_user u ON p.author_id = u.user_id WHERE f.user_id = $1 ORDER BY position ASC",
      [parseInt(req.params.userId)]
    );
    const posts = getPosts.rows;

    return res.json({ status: 1, msg: "Favourite posts Loaded", data: posts });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

// @route       GET /posts/favourites
// @desc        Add to favourite
// @access      Private
router.post(
  "/favourites",
  [auth(2), body("postId", "Post not indentified").isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.array();
      return res.status(400).json({ status: 0, msg: err[0].msg });
    }

    const { postId } = req.body;
    try {
      const count = await pool.query(
        "SELECT COUNT(*) FROM tbl_fav WHERE user_id = $1",
        [req.user.id]
      );

      const isAlready = await pool.query(
        "SELECT COUNT(*) FROM tbl_fav WHERE user_id = $1 AND post_id = $2",
        [req.user.id, postId]
      );

      if (isAlready.rows[0].count === "1") {
        return res
          .status(400)
          .json({ status: 0, msg: "Already added to favourites" });
      }

      const addFav = await pool.query(
        "INSERT INTO tbl_fav (user_id, post_id, position) values ($1, $2, $3)",
        [req.user.id, postId, Number(count.rows[0].count)]
      );

      const getdata = await pool.query(
        "SELECT p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, u.user_id, u.username, u.email, u.profile_id, u.user_type, f.fav_id FROM tbl_post p LEFT JOIN tbl_fav f ON p.post_id = f.post_id AND f.user_id = $1 JOIN tbl_user u ON p.author_id = u.user_id WHERE p.post_id = $2",
        [req.user.id, postId]
      );
      const data = getdata.rows[0];

      return res.json({ status: 1, msg: "Added to Favourite", data });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ status: 0, msg: "Something went wrong!" });
    }
  }
);

// @route       GET /posts/favourites
// @desc        REmove from favourite
// @access      Private
router.delete(
  "/favourites",
  [
    auth(2),
    [
      body("postId", "Post not indentified").isInt(),
      body("favId", "Favourite post not identified").isInt(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.array();
      return res.status(400).json({ status: 0, msg: err[0].msg });
    }

    const { postId, favId } = req.body;
    try {
      const delrow = await pool.query(
        "DELETE FROM tbl_fav WHERE fav_id = $1 RETURNING *",
        [favId]
      );

      const delPosition = delrow.rows[0].position;

      const updateList = await pool.query(
        "UPDATE tbl_fav SET position = (CASE WHEN position > $1 THEN position - 1 ELSE position END) WHERE user_id = $2",
        [delPosition, req.user.id]
      );

      const getdata = await pool.query(
        "SELECT p.post_id, p.title, p.content, p.tags, p.status, p.create_time, p.update_time, u.user_id, u.username, u.email, u.profile_id, u.user_type, f.fav_id FROM tbl_post p LEFT JOIN tbl_fav f ON p.post_id = f.post_id AND f.user_id = $1 JOIN tbl_user u ON p.author_id = u.user_id WHERE p.post_id = $2",
        [req.user.id, postId]
      );
      const data = getdata.rows[0];

      return res.json({ status: 1, msg: "Added to Favourite", data });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ status: 0, msg: "Something went wrong!" });
    }
  }
);

module.exports = router;
