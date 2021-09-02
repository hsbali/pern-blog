import React, { Fragment, useEffect, useState } from "react";
import { connect, Provider } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import $ from "jquery";
import "jquery-ui-dist/jquery-ui";

import AppLayout from "../components/layouts/AppLayout";
import ShowDate from "../components/ShowDate";

import { getFavPosts, rearrangePosts } from "../actions/favPost";
import axios from "axios";

const Favourites = ({ auth, posts, socket, getFavPosts, rearrangePosts }) => {
  const [displayPosts, setDisplayPosts] = useState([]);

  useEffect(() => {
    if (auth.user !== null) {
      getFavPosts(auth.user.user_id);
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    setDisplayPosts(posts);
  }, [posts]);

  useEffect(() => {
    $(".sortable").sortable({
      update: function (event, ui) {
        const newIndex = $(".sortable").children().index(ui.item);
        const oldIndex = parseInt(
          $(".sortable").children().get(newIndex).dataset.position
        );

        const list = rearrangePosts({
          old: oldIndex,
          new: newIndex,
        });

        socket.emit("update-fav-list", {
          token: axios.defaults.headers.common["Authorization"],
          result: {
            old: oldIndex,
            new: newIndex,
          },
        });

        setDisplayPosts(list);
      },
    });
  }, []);

  return (
    <AppLayout navTitle="Favourites">
      <div className="container">
        <div className="row">
          <div className="sortable col mx-md-5">
            {displayPosts.map((post, i) => {
              return (
                <Fragment key={i}>
                  <div
                    data-position={post.position}
                    className="d-flex align-items-center"
                  >
                    <div className="mx-4">
                      <i className="bi bi-grip-vertical"></i>
                    </div>
                    <Link
                      to={"/post/" + post.post_id}
                      className={`post-card flex-grow-1 px-5 py-3`}
                      title={"Go to " + post.title}
                    >
                      <h1>{post.title}</h1>
                      <div className="d-flex align-items-center">
                        <h5 className="flex-grow-1 m-0">{post.username}</h5>
                        <h6 className="m-0">
                          <ShowDate
                            create={post.create_time}
                            update={post.update_time}
                          />
                        </h6>
                      </div>
                    </Link>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

Favourites.propTypes = {
  posts: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  getFavPosts: PropTypes.func.isRequired,
  rearrangePosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.favPost.posts,
  auth: state.auth,
  socket: state.socket.socket,
});

export default connect(mapStateToProps, { getFavPosts, rearrangePosts })(
  Favourites
);
