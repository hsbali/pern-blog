import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Link, useHistory } from "react-router-dom";

import { register } from "./../actions/auth";
import AppLayout from "./layouts/AppLayout";

const Signin = ({ isAuthenticated, register }) => {
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, [isAuthenticated]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    // user_type: 1
  });

  const { username, email, password, password2 } = formData;

  const onChangeValue = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitSignin = (e) => {
    e.preventDefault();

    if (password !== password2) {
      return false;
    }

    // Signin
    register(formData);

    setFormData({
      username: "",
      email: "",
      password: "",
      password2: "",
    });
  };

  return (
    <>
      <AppLayout navTitle={"Sign in"}>
        <main className="m-md-5 m-2">
          <div className="container">
            <div className="row p-md-5 p-2">
              <div classNam="col">
                <div className="">
                  <h1>Sign In</h1>
                  <div>
                    or <Link to="/login">Log In</Link>
                  </div>
                  <br />

                  <form
                    className="d-flex flex-column"
                    onSubmit={(e) => onSubmitSignin(e)}
                  >
                    <div>
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter Username"
                        value={username}
                        className="form-control my-1"
                        onChange={(e) => onChangeValue(e)}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="email"
                        placeholder="Enter email"
                        value={email}
                        className="form-control my-1"
                        onChange={(e) => onChangeValue(e)}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        className="form-control my-1"
                        onChange={(e) => onChangeValue(e)}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        name="password2"
                        placeholder="Confirm Password"
                        value={password2}
                        className="form-control my-1"
                        onChange={(e) => onChangeValue(e)}
                        required
                      />
                    </div>

                    <div className="my-3">
                      <button className="btn btn-primary" type="submit">
                        Sign in
                      </button>
                      <button
                        className="btn btn-secondary mx-2"
                        onClick={(e) => history.push("/")}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AppLayout>
    </>
  );
};

Signin.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  register: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Signin);
