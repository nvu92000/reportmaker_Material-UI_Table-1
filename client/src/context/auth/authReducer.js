import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  RESET_PASSWORD,
  RESET_FAIL,
  FORGOT_PASSWORD,
  FORGOT_FAIL,
  CLEAR_MSG,
  RESET_SUCCESS,
  SET_LOADING
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case RESET_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        msg: null,
        error: null
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };

    case SET_LOADING:
      return {
        ...state,
        loading: true
      };

    case FORGOT_PASSWORD:
    case RESET_PASSWORD:
      return { ...state, msg: action.msg };

    case FORGOT_FAIL:
    case RESET_FAIL:
      return { ...state, error: action.msg };

    case CLEAR_MSG:
      return { ...state, msg: null, loading: false };

    default:
      return state;
  }
};
