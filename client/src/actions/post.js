import axios from "axios";
import * as t from "./types";

// Get posts
export const getPosts = (limit) => async (dispatch) => {
  try {
    dispatch({
      type: t.FETCH_POSTS_REQUEST,
    });

    const res = await axios.get(
      `http://localhost:5500/api/v1/posts?limit=${limit}`
    );

    return dispatch({
      type: t.FETCH_POSTS_SUCCESS,
      payload: res.data.data,
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.FETCH_POSTS_FAIL,
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
