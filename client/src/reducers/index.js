import { combineReducers } from "redux";

import auth from "./auth";
import alert from "./alert";
import toast from "./toast";
import post from "./post";
import comment from "./comment";
import adminAuth from "./adminAuth";
import socket from "./socket";

export default combineReducers({
  alert,
  toast,
  auth,
  post,
  comment,
  socket,
  adminAuth,
});
