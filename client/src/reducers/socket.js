import * as t from "./../actions/types";

const initialState = {
  socket: null,
  error: null,
  loading: false,
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case t.SOCKET_CONNECTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case t.SOCKET_CONNECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        socket: payload.socket,
      };
    case t.SOCKET_CONNECTION_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
}
