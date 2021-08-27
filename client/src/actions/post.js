import axios from "axios";
import store from "./../store";
import * as t from "./types";

// Get posts
export const getPublishedPosts = (offset, limit) => async (dispatch) => {
  try {
    dispatch({
      type: t.FETCH_POSTS_REQUEST,
    });

    const res = await axios.get(
      `http://localhost:5500/api/v1/posts?offset=${offset}&limit=${limit}`
    );

    if (offset !== 0) {
      dispatch({
        type: t.ADD_NEXT_POSTS,
        payload: res.data.data,
      });
    } else {
      dispatch({
        type: t.FETCH_POSTS_SUCCESS,
        payload: res.data.data,
      });
    }
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.FETCH_POSTS_FAIL,
    });
  }
};

// Get all posts
export const getAllPosts = (offset, limit) => async (dispatch) => {
  try {
    dispatch({
      type: t.FETCH_POSTS_REQUEST,
    });

    const res = await axios.get(
      `http://localhost:5500/api/v1/admin/posts?offset=${offset}&limit=${limit}`
    );

    if (offset !== 0) {
      dispatch({
        type: t.ADD_NEXT_POSTS,
        payload: res.data.data,
      });
    } else {
      dispatch({
        type: t.FETCH_POSTS_SUCCESS,
        payload: res.data.data,
      });
    }
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.FETCH_POSTS_FAIL,
    });
  }
};

// Get Published posts
export const getPublishedPost = (id) => async (dispatch) => {
  try {
    dispatch({
      type: t.FETCH_POST_REQUEST,
    });

    const res = await axios.get("http://localhost:5500/api/v1/posts/" + id);

    dispatch({
      type: t.FETCH_POST_SUCCESS,
      payload: res.data.data,
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.FETCH_POST_FAIL,
    });
  }
};

// Get All type post
export const getAllTypePost = (id) => async (dispatch) => {
  try {
    dispatch({
      type: t.FETCH_POST_REQUEST,
    });

    const res = await axios.get(
      "http://localhost:5500/api/v1/admin/posts/" + id
    );

    dispatch({
      type: t.FETCH_POST_SUCCESS,
      payload: res.data.data,
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.FETCH_POST_FAIL,
    });
  }
};

// add post to list
export const updatePostList = (post) => async (dispatch) => {
  try {
    return dispatch({
      type: t.ADD_POSTS_SUCCESS,
      payload: post,
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.ADD_POSTS_FAIL,
    });
  }
};

// add post to list
export const onEditPost = (post) => async (dispatch) => {
  try {
    const statePost = store.getState().post.post;

    if (statePost !== null && statePost.post_id === post.post_id) {
      dispatch({
        type: t.ON_EDIT_POST_SUCCESS,
        payload: post,
      });
    }

    if (store.getState().post.posts.some((p) => p.post_id === post.post_id)) {
      dispatch({
        type: t.ON_EDIT_POST_LIST_SUCCESS,
        payload: post,
      });
    } else {
      dispatch({
        type: t.ADD_POSTS_SUCCESS,
        payload: post,
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

// On delete post from socket
export const onDeletePost = (post) => async (dispatch) => {
  try {
    const statePost = store.getState().post.post;

    if (statePost !== null && statePost.post_id === post.post_id) {
      dispatch({
        type: t.ON_DELETE_POST_SUCCESS,
        payload: post,
      });
    }

    if (store.getState().post.posts.some((p) => p.post_id === post.post_id)) {
      dispatch({
        type: t.ON_DELETE_POST_LIST_SUCCESS,
        payload: post,
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};
