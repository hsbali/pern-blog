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
    case t.ADMIN_LOGIN_REQUEST:
    case t.FETCH_ADMIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case t.ADMIN_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: payload.data.user,
        toRefresh: true,
      };
    case t.FETCH_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: payload.data.user,
        toRefresh: true,
      };
    case t.ADMIN_LOGIN_FAIL:
    case t.FETCH_ADMIN_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case t.ADMIN_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        toRefresh: false,
      };
    case t.ADMIN_REFRESH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        toRefresh: true,
      };
    case t.ADMIN_REFRESH_FAIL:
      return {
        ...state,
        loading: false,
        toRefresh: false,
      };
    default:
      return state;
  }
}
