import store from "./../store";

import * as t from "./types";

// Set alert
export const setAlert = (msg, type) => async (dispatch) => {
  try {
    const id = store.getState().alert.length;

    dispatch({
      type: t.SET_ALERT,
      payload: {
        id,
        msg,
        type,
      },
    });

    setTimeout(() => {
      dispatch({
        type: t.REMOVE_ALERT,
        payload: { id },
      });
    }, 3000);
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.ALERT_ERROR,
    });
  }
};
