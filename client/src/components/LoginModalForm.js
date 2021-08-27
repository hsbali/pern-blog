import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { login } from "./../actions/auth";

const LoginModalForm = ({ login }) => {
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
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Login to make comment
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form onSubmit={(e) => onSubmitLogin(e)}>
          <div className="modal-body">
            <div className="my-3">
              <label>Email</label>
              <input
                className="form-control"
                type="text"
                name="email"
                value={email}
                onChange={(e) => onChangeValue(e)}
                placeholder="Enter Email"
                required
              />
            </div>
            <div className="my-3">
              <label>Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={password}
                onChange={(e) => onChangeValue(e)}
                placeholder="Enter password"
                required
              ></input>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

LoginModalForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default connect(null, { login })(LoginModalForm);
