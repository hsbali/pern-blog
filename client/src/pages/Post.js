import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

import { useParams } from "react-router-dom";
import MarkdownView from "react-showdown";

import { getPublishedPost } from "../actions/post";
import {
  getApprovedComments,
  getApprovedAndUserComments,
} from "../actions/comment";

import AppLayout from "../components/layouts/AppLayout";
import LoginModalForm from "../components/LoginModalForm";

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

const AddComment = ({ isAuthenticated, socket, postId }) => {
  const [formData, setFormData] = useState({
    content: "",
    url: "",
  });

  const { content, url } = formData;

  const onChangeValue = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSaveComment = (e) => {
    e.preventDefault();

    formData["post_id"] = postId;

    socket.emit("new-user-comment", {
      comment: formData,
      token: axios.defaults.headers.common["Authorization"],
    });

    setFormData({
      content: "",
      url: "",
    });
  };
  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add Comment
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          {!isAuthenticated ? (
            <>
              <LoginModalForm />
            </>
          ) : (
            <>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Add Comment
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <form onSubmit={(e) => onSaveComment(e)}>
                  <div className="modal-body">
                    <div className="my-3">
                      <label>Comment</label>
                      <input
                        className="form-control"
                        type="text"
                        name="content"
                        value={content}
                        onChange={(e) => onChangeValue(e)}
                        placeholder="Type your comment..."
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div className="my-3">
                      <label>Add URL</label>
                      <input
                        className="form-control"
                        type="text"
                        name="url"
                        value={url}
                        onChange={(e) => onChangeValue(e)}
                        placeholder="Add relevant URL"
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
                    <button
                      type="button"
                      type="submit"
                      data-bs-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Save Comment
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const Post = ({
  getPublishedPost,
  getApprovedComments,
  getApprovedAndUserComments,
  post,
  error,
  comments,
  commentError,
  isAuthenticated,
  socket,
  auth,
}) => {
  const { postId } = useParams();

  useEffect(() => {
    getPublishedPost(postId);
  }, [postId]);

  useEffect(() => {
    if (isAuthenticated) {
      getApprovedAndUserComments(postId, 0, 5);
    } else {
      getApprovedComments(postId, 0, 5);
    }
  }, [postId, isAuthenticated]);

  if (error !== null) {
    return <div>{error.msg}</div>;
  }
  if (post === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AppLayout navTitle={post.title}>
        <main className="container">
          <div
            className="py-3"
            style={{
              borderBottom: "1px solid grey",
            }}
          >
            <h1>{post.title}</h1>
            <div className="d-flex align-items-center">
              <h5 className="flex-grow-1 m-0">{post.username}</h5>
              <h6 className="m-0">
                <ShowDate create={post.create_time} update={post.update_time} />
              </h6>
            </div>
          </div>
          <div
            className="content py-5"
            style={{
              borderBottom: "1px solid grey",
            }}
          >
            <MarkdownView
              markdown={post.content}
              options={{ tables: true, emoji: true }}
            />
          </div>
          <div className="comment-section py-3">
            <div className="d-flex">
              <h3 className="flex-grow-1">Comments</h3>
              <AddComment
                isAuthenticated={isAuthenticated}
                socket={socket}
                postId={postId}
              />
            </div>
            {commentError !== null ? (
              <>
                <p>{commentError.msg}</p>
              </>
            ) : comments.length === 0 ? (
              <></>
            ) : (
              <>
                {comments.map((comment, i) => {
                  return (
                    <Fragment key={i}>
                      {comment.is_approved ||
                      (auth.user !== null &&
                        comment.user_id === auth.user.user_id) ? (
                        <Fragment>
                          <div className="px-md-5 my-3">
                            <p className="fw-bold m-0">
                              {comment.content}
                              <>
                                {!comment.is_approved ? "(not approved)" : ""}
                              </>
                            </p>
                            <small>By: {comment.username}</small>
                          </div>
                        </Fragment>
                      ) : (
                        ""
                      )}
                    </Fragment>
                  );
                })}
              </>
            )}
            <div className="px-md-5">
              <button
                className="btn btn-primary"
                onClick={() =>
                  isAuthenticated
                    ? getApprovedAndUserComments(postId, comments.length, 5)
                    : getApprovedComments(postId, comments.length, 5)
                }
              >
                Load more
              </button>
            </div>
          </div>
        </main>
      </AppLayout>
    </>
  );
};

Post.propTypes = {
  getPublishedPost: PropTypes.func.isRequired,
  getApprovedComments: PropTypes.func.isRequired,
  getApprovedAndUserComments: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post.post,
  error: state.post.error,
  comments: state.comment.comments,
  commentError: state.comment.error,
  isAuthenticated: state.auth.isAuthenticated,
  socket: state.socket.socket,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getPublishedPost,
  getApprovedComments,
  getApprovedAndUserComments,
})(Post);
