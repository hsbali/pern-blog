import * as t from "./../actions/types";

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case t.FETCH_COMMENTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case t.FETCH_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: payload,
        loading: false,
      };
    case t.FETCH_COMMENTS_FAIL:
      return {
        ...state,
        error: payload,
      };
    case t.ADD_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: [payload, ...state.comments],
      };
    case t.ADD_NEXT_COMMENTS:
      console.log(payload);
      return {
        ...state,
        comments: [...state.comments, ...payload],
      };

    case t.ON_EDIT_COMMENT_LIST_SUCCESS:
      return {
        ...state,
        comments: state.comments.map((el) =>
          el.comment_id === payload.comment_id ? payload : el
        ),
      };

    case t.ON_DELETE_COMMENT_LIST_SUCCESS:
      return {
        ...state,
        comments: state.comments.filter(
          (el) => el.comment_id !== payload.comment_id
        ),
      };
    default:
      return state;
  }
}
