import * as t from "./../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: false,
  error: null,
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case t.FETCH_FAVS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case t.FETCH_FAVS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: payload,
      };
    case t.FETCH_FAVS_FAIL:
      return {
        ...state,
        loading: false,
      };
    case t.REARR_SUCCESS:
      return {
        ...state,
        posts: payload,
      };
    case t.REARR_FAIL:
      return {
        ...state,
      };
    // case t.ON_EDIT_POST_SUCCESS:
    //   return {
    //     ...state,
    //     post: payload,
    //   };
    // case t.ON_EDIT_POST_LIST_SUCCESS:
    //   return {
    //     ...state,
    //     posts: state.posts.map((el) =>
    //       el.post_id === payload.post_id ? payload : el
    //     ),
    //   };

    // case t.ON_EDIT_POST_SUCCESS:
    //   return {
    //     ...state,
    //     post: null,
    //     error: {
    //       msg: "Post Deleted",
    //     },
    //   };
    // case t.ON_DELETE_POST_LIST_SUCCESS:
    //   return {
    //     ...state,
    //     posts: state.posts.filter((el) => el.post_id !== payload.post_id),
    //   };
    default:
      return state;
  }
}
