import {
  SET_LOADING,
  GET_MEMBERS,
  GET_DAILY_DATA,
  CLEAR_DAILY_LOGOUT,
  SORT
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case SORT:
      return { ...state, sort: !state.sort };

    case SET_LOADING:
      return { ...state, loading: true };

    case GET_MEMBERS:
      return {
        ...state,
        members: action.payload,
        loading: false
      };

    case GET_DAILY_DATA:
      return {
        ...state,
        dailySource: action.payload,
        loading: false
      };

    case CLEAR_DAILY_LOGOUT:
      return {
        ...state,
        members: [],
        dailySource: [],
        loading: false
      };

    default:
      return state;
  }
};
