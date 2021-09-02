import React, { Fragment, useEffect } from "react";
import { connect, Provider } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import AppLayout from "../components/layouts/AppLayout";
import ShowDate from "../components/ShowDate";

import { getFavPosts, rearrangePosts } from "../actions/favPost";
import axios from "axios";

const Favourites = ({ auth, posts, socket, getFavPosts, rearrangePosts }) => {
  useEffect(() => {
    if (auth.user !== null) {
      getFavPosts(auth.user.user_id);
    }
  }, [auth.isAuthenticated]);

  const handleDrop = (result) => {
    rearrangePosts(result);

    // socket.emit("rearrange-fav-post", {
    //   token: axios.defaults.headers.common["Authorization"],
    //     result: ""
    // });
  };

  return (
    <AppLayout navTitle="Favourites">
      <div className="container">
        <div className="row">
          <DragDropContext onDragEnd={handleDrop}>
            <Droppable droppableId="favourites">
              {(provided) => (
                <div
                  className="col mx-md-5"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {posts.map((post, i) => {
                    return (
                      <Fragment key={i}>
                        <Draggable draggableId={i.toString()} index={i}>
                          {(provided) => (
                            <Fragment>
                              <div
                                className="d-flex align-items-center"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="mx-4">
                                  <i className="bi bi-grip-vertical"></i>
                                </div>
                                <Link
                                  to={"/post/" + post.post_id}
                                  className={`post-card flex-grow-1 px-5 py-3`}
                                  title={"Go to " + post.title}
                                >
                                  <h1>{post.title}</h1>
                                  <div className="d-flex align-items-center">
                                    <h5 className="flex-grow-1 m-0">
                                      {post.username}
                                    </h5>
                                    <h6 className="m-0">
                                      <ShowDate
                                        create={post.create_time}
                                        update={post.update_time}
                                      />
                                    </h6>
                                  </div>
                                </Link>
                              </div>
                            </Fragment>
                          )}
                        </Draggable>
                      </Fragment>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </AppLayout>
  );
};

Favourites.propTypes = {
  posts: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  getFavPosts: PropTypes.func.isRequired,
  rearrangePosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.favPost.posts,
  auth: state.auth,
  socket: state.socket.socket,
});

export default connect(mapStateToProps, { getFavPosts, rearrangePosts })(
  Favourites
);
