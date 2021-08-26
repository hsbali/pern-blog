import { io } from "socket.io-client";
import axios from "axios";
import store from "./../store";

import * as t from "./types";
import clientEvents from "../utils/clientEvents";

// Open main socket connection
export const openSocketConnection = (type) => async (dispatch) => {
  try {
    dispatch({
      type: t.SOCKET_CONNECTION_REQUEST,
    });
    const token = axios.defaults.headers.common.Authorization;

    const connection = await io.connect("http://localhost:5500", {
      withCredentials: true,
      query: {
        token: token ? token : "",
      },
    });

    clientEvents(connection);

    dispatch({
      type: t.SOCKET_CONNECTION_SUCCESS,
      payload: { socket: connection },
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: t.SOCKET_CONNECTION_FAIL,
      payload: err,
    });
  }
};
