const express = require("express");
const pool = require("./../../db");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("../../middleware/auth");

const router = express.Router();

// @route       POST /auth/refresh
// @desc        Refresh Access Token
// @access      Private(refresh_token)
router.get("/refresh", (req, res) => {
  try {
    const token = req.cookies.___refresh_token;

    if (!token && token !== "") {
      return res.status(401).json({ status: 0, msg: "Access Denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET).data;

    if (!Number.isInteger(decoded.userId)) {
      return res.status(401).json({ status: 0, msg: "Access Denied" });
    }

    // return jsonwebtoken
    const access_payload = {
      user: {
        id: decoded.userId,
        type: decoded.userType,
      },
    };

    const refresh_payload = {
      userId: decoded.userId,
      userType: decoded.userType,
    };

    let refreshToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000 + 60 * 60 * 169),
        data: refresh_payload,
      },
      process.env.JWT_SECRET
    );

    let accessToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000 + 60 * 20),
        data: access_payload,
      },
      process.env.JWT_SECRET
    );

    let authCookie = {};
    if (decoded.userType === "1") {
      authCookie.name = "___authenticated_admin";
      authCookie.value = true;
      authCookie.options = {
        path: "/",
        expires: new Date(new Date().getTime() + 168 * 60 * 60 * 1000),
        httpOnly: false,
      };
    } else {
      authCookie.name = "___authenticated";
      authCookie.value = true;
      authCookie.options = {
        path: "/",
        expires: new Date(new Date().getTime() + 168 * 60 * 60 * 1000),
        httpOnly: false,
      };
    }

    return res
      .cookie(authCookie.name, authCookie.value, authCookie.options)
      .cookie("___refresh_token", refreshToken, {
        path: "/",
        expires: new Date(new Date().getTime() + 168 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        status: 1,
        msg: "Access refreshed successfully",
        data: {
          token: accessToken,
        },
      });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .cookie("___authenticated", false, {
        path: "/",
        expires: new Date(new Date().getTime() + 1000),
        httpOnly: false,
      })
      .cookie("___authenticated_admin", false, {
        path: "/",
        expires: new Date(new Date().getTime() + 1000),
        httpOnly: false,
      })
      .cookie("___refresh_token", "", {
        path: "/",
        expires: new Date(new Date().getTime() + 1000),
        httpOnly: false,
      })
      .json({ status: 0, msg: "Something went wrong!" });
  }
});

// @route       POST /auth/logout
// @desc        Logout user
// @access      Private
router.get("/logout", auth, async (req, res) => {
  try {
    return res
      .cookie("___authenticated", false, {
        path: "/",
        expires: new Date(new Date().getTime() + 1000),
        httpOnly: false,
      })
      .cookie("___authenticated_admin", false, {
        path: "/",
        expires: new Date(new Date().getTime() + 1000),
        httpOnly: false,
      })
      .cookie("___refresh_token", "", {
        path: "/",
        expires: new Date(new Date().getTime() + 1000),
        httpOnly: false,
      })
      .json({
        status: 1,
        msg: "User Logged out",
      });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

// @route       POST /auth
// @desc        Get User by access_token
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const getUser = await pool.query(
      "SELECT user_id, email, username, user_type FROM tbl_user WHERE user_id = $1",
      [req.user.id]
    );
    const user = getUser.rows[0];

    return res.json({ status: 1, msg: "User loaded", data: { user } });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

// @route       POST /auth
// @desc        login with email and password
// @access      Public
router.post(
  "/",
  [
    body("email", "Please enter a valid Email").isEmail(),
    body(
      "password",
      "Please enter a Password with 6 or more characters"
    ).notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.array();
      return res.status(400).json({ status: 0, msg: err[0].msg });
    }

    const { email, password } = req.body;
    try {
      // see if user already exist
      const getUser = await pool.query(
        "SELECT * FROM tbl_user WHERE email = $1",
        [email]
      );
      const user = getUser.rows[0];

      if (!user) {
        return res.status(400).json({ status: 0, msg: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.hashed_pass);

      if (!isMatch) {
        return res.status(401).json({ status: 0, msg: "Incorrect password" });
      }

      // return jsonwebtoken
      const access_payload = {
        user: {
          id: user.user_id,
          type: user.user_type,
        },
      };

      const refresh_payload = {
        userId: user.user_id,
        userType: user.user_type,
      };

      let refreshToken = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000 + 60 * 60 * 169),
          data: refresh_payload,
        },
        process.env.JWT_SECRET
      );

      let accessToken = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000 + 60 * 20),
          data: access_payload,
        },
        process.env.JWT_SECRET
      );

      let authCookie = {};
      if (user.user_type === "1") {
        authCookie.name = "___authenticated_admin";
        authCookie.value = true;
        authCookie.options = {
          path: "/",
          expires: new Date(new Date().getTime() + 168 * 60 * 60 * 1000),
          httpOnly: false,
        };
      } else {
        authCookie.name = "___authenticated";
        authCookie.value = true;
        authCookie.options = {
          path: "/",
          expires: new Date(new Date().getTime() + 168 * 60 * 60 * 1000),
          httpOnly: false,
        };
      }

      return res
        .cookie(authCookie.name, authCookie.value, authCookie.options)
        .cookie("___refresh_token", refreshToken, {
          path: "/",
          expires: new Date(new Date().getTime() + 168 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .json({
          status: 1,
          msg: "User loaded successfully",
          data: {
            token: accessToken,
            user: {
              user_id: user.user_id,
              username: user.username,
              email: user.email,
              user_type: user.user_type,
            },
          },
        });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ status: 0, msg: "Something went wrong!" });
    }
  }
);

module.exports = router;
