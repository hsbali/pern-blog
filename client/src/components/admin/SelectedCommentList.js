import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { getPostComments } from "../../actions/comment";
import axios from "axios";

const SelectedCommentList = ({ socket, comments, error, getPostComments }) => {
  const { postId } = useParams();

  useEffect(() => {
    getPostComments(postId, 0, 10);
  }, []);

  const onDelete = (comment) => {
    socket.emit("delete-comment", {
      comment,
      token: axios.defaults.headers.common["Authorization"],
    });
  };
  const onApprove = (comment) => {
    comment.is_approved = true;
    socket.emit("update-comment-status", {
      comment,
      token: axios.defaults.headers.common["Authorization"],
    });
  };
  const onUnApprove = (comment) => {
    comment.is_approved = false;
    socket.emit("update-comment-status", {
      comment,
      token: axios.defaults.headers.common["Authorization"],
    });
  };

  if (error !== null) {
    return <p>{error.msg}</p>;
  }

  if (comments.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>
        <h3>All Comments</h3>

        <div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Post Title</th>
                <th scope="col">Comment</th>
                <th scope="col">Status</th>
                <th scope="col">User</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.length !== 0 ? (
                <>
                  {comments.map((comment, i) => {
                    return (
                      <Fragment key={i}>
                        <tr>
                          <th scope="row">{i + 1}</th>
                          <td>{comment.title}</td>
                          <td>{comment.content}</td>
                          <td>
                            {comment.is_approved ? "Approved" : "Not Approved"}
                          </td>
                          <td>{comment.username}</td>
                          <td>
                            <div className="d-flex">
                              {!comment.is_approved ? (
                                <i
                                  class="bi bi-check-lg pointer me-3"
                                  onClick={() => onApprove(comment)}
                                ></i>
                              ) : comment.user_type === "2" ? (
                                <i
                                  class="bi bi-x-lg pointer me-3"
                                  onClick={() => onUnApprove(comment)}
                                ></i>
                              ) : (
                                ""
                              )}
                              <i
                                class="bi bi-trash pointer"
                                onClick={() => onDelete(comment)}
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
                  <p className="text-center">No Comments</p>
                </>
              )}
            </tbody>
          </table>
          {comments.length !== 0 ? (
            <>
              <div className="text-right">
                <button
                  className="btn btn-primary"
                  onClick={() => getPostComments(postId, comments.length, 10)}
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

SelectedCommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  getPostComments: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  comments: state.comment.comments,
  error: state.comment.error,
  socket: state.socket.socket,
});

export default connect(mapStateToProps, { getPostComments })(
  SelectedCommentList
);
