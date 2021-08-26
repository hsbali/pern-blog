import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AdminLayout from "../layouts/AdminLayout";

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  loading,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          <Redirect to="/admin/login" />
        ) : (
          <>
            <AdminLayout>
              <Component {...props} />
            </AdminLayout>
          </>
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.adminAuth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, {})(PrivateRoute);
