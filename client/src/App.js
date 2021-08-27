import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import AdminProtectedRoute from "./components/routing/AdminProtectedRoute";

import axios from "axios";

import Home from "./pages/Home";
import Login from "./components/Login";
import Signin from "./components/Signin";
import Post from "./pages/Post";

import AdminDash from "./pages/admin/AdminDash";
import AdminLogin from "./components/admin/AdminLogin";
import AddPost from "./components/admin/AddPost";
import EditPost from "./components/admin/EditPost";
import PostListTable from "./components/admin/PostListTable";
import CommentListTable from "./components/admin/CommentListTable";

import { refreshAuth } from "./actions/auth";
import { refreshAdminAuth } from "./actions/adminAuth";
import { openSocketConnection } from "./actions/socket";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/css/global.css";

const App = ({
  isAuth,
  isAdminAuth,
  refreshAuth,
  refreshAdminAuth,
  toRefresh,
  toRefreshAdmin,
  openSocketConnection,
}) => {
  useEffect(() => {
    axios.defaults.withCredentials = true;

    refreshAuth();
    refreshAdminAuth();

    const refresher = setInterval(function () {
      if (toRefresh) {
        refreshAuth();
      }

      if (toRefreshAdmin) {
        refreshAdminAuth();
      }
    }, 18 * 60 * 1000);

    return () => {
      clearInterval(refresher);
    };
  }, []);

  useEffect(() => {
    openSocketConnection();
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signin" component={Signin} />

        <Route exact path="/post/:postId" component={Post} />

        <Route exact path="/admin/login" component={AdminLogin} />

        <AdminProtectedRoute exact path="/admin" component={AdminDash} />
        <AdminProtectedRoute exact path="/admin/post/add" component={AddPost} />
        <AdminProtectedRoute
          exact
          path="/admin/post/edit/:postId"
          component={EditPost}
        />
        <AdminProtectedRoute
          exact
          path="/admin/post/list"
          component={PostListTable}
        />
        <AdminProtectedRoute
          exact
          path="/admin/comment/list"
          component={CommentListTable}
        />
      </Switch>
    </Router>
  );
};

App.propTypes = {
  refreshAuth: PropTypes.func.isRequired,
  refreshAdminAuth: PropTypes.func.isRequired,
  openSocketConnection: PropTypes.func.isRequired,
  toRefresh: PropTypes.bool.isRequired,
  toRefreshAdmin: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
  isAdminAuth: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  toRefresh: state.auth.toRefresh,
  toRefreshAdmin: state.adminAuth.toRefresh,
  isAuth: state.auth.isAuthenticated,
  isAdminAuth: state.adminAuth.isAuthenticated,
});

export default connect(mapStateToProps, {
  refreshAuth,
  refreshAdminAuth,
  openSocketConnection,
})(App);
