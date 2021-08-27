import * as t from "./../actions/types";

const initialState = [];

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case t.SET_TOAST:
      return [...state, payload];
    case t.REMOVE_TOAST:
      return state.filter((el) => el.id !== payload.id);
    default:
      return state;
  }
}
