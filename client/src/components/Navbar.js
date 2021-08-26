import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import getCookieValue from "../utils/getCookieValue";

import { logout } from "../actions/auth";

const AuthLink = ({ logout }) => {
  return (
    <ul
      className="navbar-nav my-2"
      style={{ marginLeft: "auto", gap: "0.5em" }}
    >
      <li className="nav-item">
        <button
          className="btn btn-dark"
          onClick={(e) => {
            console.log("working");
            logout();
          }}
        >
          Log out
        </button>
      </li>
    </ul>
  );
};

const GuestLink = () => {
  return (
    <ul
      className="navbar-nav my-2"
      style={{ marginLeft: "auto", gap: "0.5em" }}
    >
      <li className="nav-item">
        <Link to="/login">
          <button className="btn btn-dark">Log in</button>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/signin">
          <button className="btn btn-primary">Sign in</button>
        </Link>
      </li>
    </ul>
  );
};

const Navbar = ({ title, logout, isAuthenticated }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <h5 className="navbar-brand m-0">{title}</h5>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {isAuthenticated ? <AuthLink logout={logout} /> : <GuestLink />}
          </div>
        </div>
      </nav>
    </>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(Navbar);
