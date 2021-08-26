import * as t from "./../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: false,
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case t.FETCH_POSTS_REQUEST:
      return {
        ...state,
        loadin: true,
      };
    case t.FETCH_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: payload,
      };
    case t.FETCH_POSTS_FAIL:
      return {
        ...state,
        loading: false,
      };
    case t.ADD_POSTS_SUCCESS:
      return {
        ...state,
        posts: [...state.posts, payload],
      };

    default:
      return state;
  }
}
