import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import AppLayout from "../components/layouts/AppLayout";
import PostList from "../components/PostList";

const Home = ({ user, logout }) => {
  return (
    <>
      <AppLayout navTitle={"Home"}>
        <PostList />
      </AppLayout>
    </>
  );
};

export default connect(null, {})(Home);
