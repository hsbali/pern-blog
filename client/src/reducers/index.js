import { combineReducers } from "redux";

import auth from "./auth";
import alert from "./alert";
import post from "./post";
import adminAuth from "./adminAuth";
import socket from "./socket";

export default combineReducers({
  alert,
  auth,
  post,
  socket,
  adminAuth,
});
