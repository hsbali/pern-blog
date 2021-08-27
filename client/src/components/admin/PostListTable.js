import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

import { Link } from "react-router-dom";

import { getAllPosts } from "../../actions/post";

const PostListTable = ({ socket, posts, getAllPosts }) => {
  useEffect(() => {
    getAllPosts(0, 20);
  }, []);

  const onDelete = (post) => {
    socket.emit("delete-post", {
      token: axios.defaults.headers.common["Authorization"],
      post,
    });
  };

  return (
    <>
      <div>
        <h3>All posts</h3>

        <div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Author</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length !== 0 ? (
                <>
                  {posts.map((post, i) => {
                    return (
                      <Fragment key={i}>
                        <tr>
                          <th scope="row">{i + 1}</th>
                          <td>{post.title}</td>
                          <td>
                            {post.status === "1"
                              ? "Draft"
                              : post.status === "2"
                              ? "Published"
                              : post.status === "3"
                              ? "Archived"
                              : ""}
                          </td>
                          <td>{post.username}</td>
                          <td>
                            <div className="d-flex">
                              <Link to={"/admin/post/edit/" + post.post_id}>
                                <i class="bi bi-pencil-square me-3 pointer"></i>
                              </Link>
                              <i
                                class="bi bi-trash pointer"
                                onClick={() => onDelete(post)}
                              ></i>
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </>
              ) : (
                <>
                  <p className="text-center">No posts</p>
                </>
              )}
            </tbody>
          </table>
          {posts.length !== 0 ? (
            <>
              <div className="text-right">
                <button
                  className="btn btn-primary"
                  onClick={() => getAllPosts(posts.length, 10)}
                >
                  Load more
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

PostListTable.propTypes = {
  posts: PropTypes.array.isRequired,
  getAllPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.post.posts,
  socket: state.socket.socket,
});

export default connect(mapStateToProps, { getAllPosts })(PostListTable);
