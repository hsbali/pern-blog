import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

const AddPost = ({ socket }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    status: "1",
  });

  const { title, content, tags, status } = formData;

  const onChangeValue = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCreatePost = (e) => {
    e.preventDefault();

    socket.emit("new-post", {
      post: formData,
      token: axios.defaults.headers.common["Authorization"],
    });

    setFormData({
      title: "",
      content: "",
      tags: "",
      status: "1",
    });
  };

  return (
    <>
      <div>
        <form className="d-flex flex-column" onSubmit={(e) => onCreatePost(e)}>
          <div className="d-flex mb-4 ">
            <h3 className="flex-grow-1 m-0">Add new post</h3>
            <button className="btn btn-primary" type="submit">
              Create Post
            </button>
          </div>
          <div className="my-2">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter Title"
              value={title}
              className="form-control"
              rows="4"
              onChange={(e) => onChangeValue(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="my-2">
            <div className="row">
              <div className="col-md-6 mb-2 mb-md-0">
                <label>Select Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={status}
                  onChange={(e) => onChangeValue(e)}
                >
                  <option value="1">Draft</option>
                  <option value="2">Published</option>
                  <option value="3">Achived</option>
                </select>
              </div>
              <div className="col-md-6 mt-2 mt-md-0">
                <label>
                  Tags <small>(Comma Seperated)</small>
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="Enter Title"
                  value={tags}
                  className="form-control"
                  onChange={(e) => onChangeValue(e)}
                />
              </div>
            </div>
          </div>
          <div className="my-2">
            <label>Content</label>
            <textarea
              name="content"
              placeholder="Start here..."
              value={content}
              className="form-control"
              onChange={(e) => onChangeValue(e)}
              rows="20"
            ></textarea>
          </div>
        </form>
      </div>
    </>
  );
};

AddPost.propTypes = {
  socket: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  socket: state.socket.socket,
});

export default connect(mapStateToProps, {})(AddPost);
