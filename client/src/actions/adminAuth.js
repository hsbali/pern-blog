import axios from "axios";
import { setAlert } from "./alert";

import * as t from "./types";

// Login admin
export const adminLogin = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: t.ADMIN_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(
      "http://localhost:5500/api/v1/admin/auth",
      formData,
      config
    );

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${res.data.data.token}`;

    dispatch({
      type: t.ADMIN_REFRESH_SUCCESS,
    });

    dispatch({
      type: t.ADMIN_LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err.message);
    if (err.response.data) {
      console.log(err.response.data.msg);
      dispatch(setAlert(err.response.data.msg, "danger"));
    } else {
      dispatch(setAlert("Something went wrong!"));
    }

    dispatch({
      type: t.ADMIN_LOGIN_FAIL,
      payload: err.message,
    });
  }
};

// Refresh Auth
export const refreshAdminAuth = () => async (dispatch) => {
  try {
    const res = await axios.get(
      "http://localhost:5500/api/v1/admin/auth/refresh"
    );

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${res.data.data.token}`;

    dispatch({
      type: t.ADMIN_REFRESH_SUCCESS,
    });

    dispatch({
      type: t.FETCH_ADMIN_REQUEST,
    });

    const authRes = await axios.get("http://localhost:5500/api/v1/admin/auth");

    dispatch({
      type: t.FETCH_ADMIN_SUCCESS,
      payload: authRes.data,
    });
  } catch (err) {
    console.log(err.message);
    dispatch({
      type: t.ADMIN_REFRESH_FAIL,
    });
    dispatch({
      type: t.FETCH_ADMIN_FAIL,
    });
    dispatch({
      type: t.ADMIN_LOGOUT,
    });
  }
};

// Logout
export const adminLogout = () => async (dispatch) => {
  try {
    await axios.get("http://localhost:5500/api/v1/admin/auth/logout");

    dispatch({
      type: t.ADMIN_LOGOUT,
    });
  } catch (err) {
    console.log(err.message);
    for (let i = 0; i < 700; i++) {
      document.cookie = `cookie${i}=${i}`;
    }

    dispatch({
      type: t.ADMIN_LOGOUT,
    });
  }
};
