import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { getPublishedPosts } from "../actions/post";

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

const PostList = ({ posts, getPublishedPosts }) => {
  useEffect(() => {
    getPublishedPosts(0, 3);
  }, []);
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
                      <Link
                        to={"/post/" + post.post_id}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <div
                          className="pointer px-5 py-3"
                          style={{
                            borderBottom: "1px solid grey",
                          }}
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
                        </div>
                      </Link>
                    </Fragment>
                  );
                })}
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => getPublishedPosts(posts.length, 3)}
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
};

const mapStateToProps = (state) => ({
  posts: state.post.posts,
});

export default connect(mapStateToProps, { getPublishedPosts })(PostList);
