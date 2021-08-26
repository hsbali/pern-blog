import * as t from "./../actions/types";

const initialState = [];

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case t.SET_ALERT:
      return [
        ...state,
        {
          id: payload.id,
          msg: payload.msg,
          type: payload.type,
        },
      ];
    case t.REMOVE_ALERT:
      return state.filter((el) => el.id !== payload.id);
    default:
      return state;
  }
}
