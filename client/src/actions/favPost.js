import axios from "axios";
import store from "./../store";
import * as t from "./types";

// Get posts
export const getFavPosts = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: t.FETCH_FAVS_REQUEST,
    });

    const res = await axios.get(
      `http://localhost:5500/api/v1/posts/favourites/users/${userId}`
    );

    dispatch({
      type: t.FETCH_FAVS_SUCCESS,
      payload: res.data.data,
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.FETCH_FAVS_FAIL,
    });
  }
};

export const rearrangePosts = (result) => (dispatch) => {
  try {
    const items = Array.from(store.getState().favPost.posts);

    if (result.old < result.new) {
      items.map((el) => {
        if (el.position === result.old) {
          el.position = result.new;
        } else if (
          el.position < result.new + 1 &&
          !(el.position < result.old)
        ) {
          el.position--;
        }
        return el;
      });
    } else if (result.old > result.new) {
      items.map((el) => {
        if (el.position === result.old) {
          el.position = result.new;
        } else if (
          el.position > result.new - 1 &&
          !(el.position > result.old)
        ) {
          el.position++;
        }
        return el.position;
      });
    }

    dispatch({
      type: t.REARR_SUCCESS,
      payload: items,
    });

    return items;
  } catch (err) {
    console.log(err);
    return dispatch({
      type: t.REARR_FAIL,
    });
  }
};

export const setFavPosts = (list) => async (dispatch) => {
  try {
    dispatch({
      type: t.FETCH_FAVS_REQUEST,
    });

    dispatch({
      type: t.FETCH_FAVS_SUCCESS,
      payload: list,
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.FETCH_FAVS_FAIL,
    });
  }
};
