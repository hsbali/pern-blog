import axios from "axios";
import store from "./../store";

import * as t from "./types";

// Set alert
export const setAlert = (msg, type) => async (dispatch) => {
  try {
    const id = store.getState().alert.length;

    return dispatch({
      type: t.SET_ALERT,
      payload: {
        id,
        msg,
        type,
      },
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.ALERT_ERROR,
    });
  }
};

// Remove alert
export const removeAlert = (id) => async (dispatch) => {
  try {
    console.log("in action");
    return dispatch({
      type: t.REMOVE_ALERT,
      payload: {
        id,
      },
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.ALERT_ERROR,
    });
  }
};
