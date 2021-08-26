import store from "./../store";
import { setAlert } from "../actions/alert";
import { updatePostList } from "../actions/post";

const clientEvents = (socket) => {
  socket.on("set-alert", (data) => {
    store.dispatch(setAlert(data.msg, data.type));
  });

  socket.on("new-publish", (data) => {
    store.dispatch(updatePostList(data));
  });
};

export default clientEvents;
