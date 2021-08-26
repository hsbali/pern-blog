import * as t from "./../actions/types";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  toRefresh: true,
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case t.LOGIN_REQUEST:
    case t.REGISTER_REQUEST:
    case t.FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case t.LOGIN_SUCCESS:
    case t.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: payload.data.user,
        toRefresh: true,
      };
    case t.FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: payload.data.user,
        toRefresh: true,
      };
    case t.LOGIN_FAIL:
    case t.REGISTER_FAIL:
    case t.FETCH_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case t.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        toRefresh: false,
      };
    case t.REFRESH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        toRefresh: true,
      };
    case t.REFRESH_FAIL:
      return {
        ...state,
        loading: false,
        toRefresh: false,
      };
    default:
      return state;
  }
}
