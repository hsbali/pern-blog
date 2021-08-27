import store from "../store";

import * as t from "./types";

// Set alert
export const setToast = (toastData) => async (dispatch) => {
  try {
    toastData.id = store.getState().toast.length;

    return dispatch({
      type: t.SET_TOAST,
      payload: toastData,
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.TOAST_ERROR,
    });
  }
};

// Remove alert
export const removeToast = (id) => async (dispatch) => {
  try {
    return dispatch({
      type: t.REMOVE_TOAST,
      payload: {
        id,
      },
    });
  } catch (err) {
    console.log(err.message);
    return dispatch({
      type: t.TOAST_ERROR,
    });
  }
};
