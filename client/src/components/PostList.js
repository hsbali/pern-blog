import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import {
  getPublishedPosts,
  getPublishedWithFavPosts,
  addFavourite,
  removeFavourite,
} from "../actions/post";

const ShowDate = ({ create, update }) => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (create < update) {
      console.log(create);
      setDate(update);
    } else {
      setDate(create);
    }
  }, [create, update]);

  return <>{date}</>;
};

const PostList = ({
  posts,
  getPublishedPosts,
  auth,
  isAuthenticated,
  getPublishedWithFavPosts,
  addFavourite,
  removeFavourite,
}) => {
  useEffect(() => {
    if (isAuthenticated && auth.user !== null) {
      getPublishedWithFavPosts(auth.user.user_id, 0, 3);
    } else {
      getPublishedPosts(0, 3);
    }
  }, [auth.user]);

  const onToggleFav = (post) => {
    console.log("clicking");
    if (post.fav_id === null) {
      addFavourite(post.post_id);
    } else {
      console.log(post.post_id, post.fav_id);
      removeFavourite(post.post_id, post.fav_id);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col mx-md-5">
            {posts.length !== 0 ? (
              <>
                {posts.map((post, i) => {
                  return (
                    <Fragment key={i}>
                      <div>
                        <div
                          className="px-5 py-3"
                          style={{
                            borderBottom: "1px solid grey",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <h1 className="flex-grow-1">
                              <Link
                                to={"/post/" + post.post_id}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                {post.title}
                              </Link>
                            </h1>
                            {post.fav_id !== undefined ? (
                              <>
                                <div
                                  className="d-flex align-items-center pointer"
                                  onClick={() => onToggleFav(post)}
                                >
                                  <div className="me-3">Favourites</div>
                                  <input
                                    type="checkbox"
                                    className="pointer"
                                    checked={!!post.fav_id}
                                    readOnly
                                  ></input>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="d-flex align-items-center">
                            <h5 className="flex-grow-1 m-0">{post.username}</h5>
                            <h6 className="m-0">
                              <ShowDate
                                create={post.create_time}
                                update={post.update_time}
                              />
                            </h6>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={(e) =>
                      auth.isAuthenticated && auth.user !== null
                        ? getPublishedWithFavPosts(
                            auth.user.user_id,
                            posts.length,
                            3
                          )
                        : getPublishedPosts(posts.length, 3)
                    }
                  >
                    Load more
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-center">No Posts</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  getPublishedPosts: PropTypes.func.isRequired,
  getPublishedWithFavPosts: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  addFavourite: PropTypes.func.isRequired,
  removeFavourite: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.post.posts,
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  getPublishedPosts,
  getPublishedWithFavPosts,
  addFavourite,
  removeFavourite,
})(PostList);
