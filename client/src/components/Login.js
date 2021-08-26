import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Link, useHistory } from "react-router-dom";

import { login } from "./../actions/auth";

import AppLayout from "./layouts/AppLayout";

const Login = ({ isAuthenticated, login, isAdmin }) => {
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, [isAuthenticated]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChangeValue = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();

    // Login
    login(formData);

    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <AppLayout navTitle={"Log in"}>
        <main className="m-md-5 m-2">
          <div className="container">
            <div className="row p-md-5 p-2">
              <div className="col">
                <div className="">
                  <h1>Log In</h1>
                  <div>
                    or <Link to="/signin">Sign In</Link>
                  </div>

                  <br />

                  <form
                    className="d-flex flex-column"
                    onSubmit={(e) => onSubmitLogin(e)}
                  >
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

                    <div className="my-3">
                      <button className="btn btn-primary" type="submit">
                        Login
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

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
