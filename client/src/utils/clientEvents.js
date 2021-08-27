import store from "./../store";
import { setAlert } from "../actions/alert";
import { setToast } from "../actions/toast";
import { updatePostList, onEditPost, onDeletePost } from "../actions/post";
import {
  updateCommentList,
  onEditComment,
  onDeleteComment,
} from "../actions/comment";

const clientEvents = (socket) => {
  socket.on("set-alert", (data) => {
    store.dispatch(setAlert(data.msg, data.type));
  });

  socket.on("new-publish", (data) => {
    store.dispatch(updatePostList(data));
  });

  socket.on("edit-publish", (data) => {
    store.dispatch(onEditPost(data));
  });

  socket.on("delete-publish", (data) => {
    store.dispatch(onDeletePost(data));
  });

  socket.on("new-comment", (data) => {
    store.dispatch(updateCommentList(data));
  });

  socket.on("new-comment-toast", (data) => {
    store.dispatch(
      setToast({
        title: "New comment",
        subTitle: `Post: ${data.title}`,
        body: data.content,
      })
    );
  });

  socket.on("on-update-comment-status", (data) => {
    console.log("ll");
    store.dispatch(onEditComment(data));
  });

  socket.on("on-delete-comment", (data) => {
    store.dispatch(onDeleteComment(data));
  });
};

export default clientEvents;
