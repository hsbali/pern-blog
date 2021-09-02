import axios from "axios";
import store from "./../store";

import * as t from "./types";

// Get All approved comments on post
export const getApprovedComments =
  (postId, offset, limit) => async (dispatch) => {
    try {
      dispatch({
        type: t.FETCH_COMMENTS_REQUEST,
      });
      const res = await axios.get(
        `http://localhost:5500/api/v1/comments/posts/${postId}?offset=${offset}&limit=${limit}`
      );

      if (offset !== 0) {
        dispatch({
          type: t.ADD_NEXT_COMMENTS,
          payload: res.data.data,
        });
      } else {
        dispatch({
          type: t.FETCH_COMMENTS_SUCCESS,
          payload: res.data.data,
        });
      }
    } catch (err) {
      console.log(err.message);
      return dispatch({
        type: t.FETCH_COMMENTS_FAIL,
        payload: { msg: "Can't load comments" },
      });
    }
  };

// Get All approved and user comments on post
export const getApprovedAndUserComments =
  (postId, offset, limit) => async (dispatch) => {
    try {
      dispatch({
        type: t.FETCH_COMMENTS_REQUEST,
      });
      const res = await axios.get(
        `http://localhost:5500/api/v1/comments/users/posts/${postId}?offset=${offset}&limit=${limit}`
      );

      if (offset !== 0) {
        dispatch({
          type: t.ADD_NEXT_COMMENTS,
          payload: res.data.data,
        });
      } else {
        dispatch({
          type: t.FETCH_COMMENTS_SUCCESS,
          payload: res.data.data,
        });
      }
    } catch (err) {
      console.log(err.message);
      return dispatch({
        type: t.FETCH_COMMENTS_FAIL,
        payload: { msg: "Can't load comments" },
      });
    }
  };

// Get All comments
export const getAllComments = (offset, limit) => async (dispatch) => {
  try {
    dispatch({
      type: t.FETCH_COMMENTS_REQUEST,
    });
    const res = await axios.get(
      `http://localhost:5500/api/v1/admin/comments?offset=${offset}&limit=${limit}`
    );

    if (offset !== 0) {
      dispatch({
        type: t.ADD_NEXT_COMMENTS,
        payload: res.data.data,
      });
    } else {
      dispatch({
        type: t.FETCH_COMMENTS_SUCCESS,
        payload: res.data.data,
      });
    }
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.FETCH_COMMENTS_FAIL,
      payload: { msg: "Can't load comments" },
    });
  }
};

// Get All comments on post
export const getPostComments = (postId, offset, limit) => async (dispatch) => {
  try {
    dispatch({
      type: t.FETCH_COMMENTS_REQUEST,
    });
    const res = await axios.get(
      `http://localhost:5500/api/v1/admin/comments/posts/${postId}?offset=${offset}&limit=${limit}`
    );

    if (offset !== 0) {
      dispatch({
        type: t.ADD_NEXT_COMMENTS,
        payload: res.data.data,
      });
    } else {
      dispatch({
        type: t.FETCH_COMMENTS_SUCCESS,
        payload: res.data.data,
      });
    }
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.FETCH_COMMENTS_FAIL,
      payload: { msg: "Can't load comments" },
    });
  }
};

// add post to list
export const updateCommentList = (comment) => async (dispatch) => {
  try {
    return dispatch({
      type: t.ADD_COMMENTS_SUCCESS,
      payload: comment,
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.ADD_COMMENTS_FAIL,
    });
  }
};

// add post to list
export const onEditComment = (comment) => async (dispatch) => {
  try {
    if (
      store
        .getState()
        .comment.comments.some((c) => c.comment_id === comment.comment_id)
    ) {
      dispatch({
        type: t.ON_EDIT_COMMENT_LIST_SUCCESS,
        payload: comment,
      });
    } else {
      dispatch({
        type: t.ADD_COMMENTS_SUCCESS,
        payload: comment,
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

// On delete post from socket
export const onDeleteComment = (comment) => async (dispatch) => {
  try {
    if (
      store
        .getState()
        .comment.comments.some((c) => c.comment_id === comment.comment_id)
    ) {
      dispatch({
        type: t.ON_DELETE_COMMENT_LIST_SUCCESS,
        payload: comment,
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};
