import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";
import { message } from "antd";
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

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
    msg: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    setAuthToken(localStorage.token);

    try {
      const res = await axios.get("/api/auth");

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR, payload: err.response.data.msg });
    }
  };

  // Register User
  const register = async formData => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post("/api/users", formData, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg
      });
    }
  };

  // Login User
  const login = async (formData, _loginSuccess) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post("/api/auth", formData, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      message.success(_loginSuccess);

      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg
      });
    }
  };

  // Forgot Password
  const forgotPassword = async formData => {
    setLoading();

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(
        "/api/auth/forgotpassword",
        formData,
        config
      );
      console.log(res.data);
      dispatch({
        type: FORGOT_PASSWORD,
        msg: res.data.data
      });
    } catch (err) {
      dispatch({
        type: FORGOT_FAIL,
        msg: err.response.data.msg
      });
    }
  };

  // Request Reset Password
  const resetRequest = async resetToken => {
    setLoading();

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.get(
        `/api/auth/resetpassword`,
        {
          params: {
            resetToken
          }
        },
        config
      );
      console.log(res.data);

      dispatch({
        type: RESET_PASSWORD,
        msg: res.data.msg
      });
    } catch (err) {
      dispatch({
        type: RESET_FAIL,
        msg: err.response.data.msg
      });
    }
  };

  // Reset Password
  const updatePassword = async formData => {
    setLoading();

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.put(`/api/auth/updatepassword`, formData, config);
      console.log(res.data);

      dispatch({
        type: RESET_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: RESET_FAIL,
        msg: err.response.data.msg
      });
    }
  };

  const setLoading = () => dispatch({ type: SET_LOADING });

  // Logout
  const logout = () => dispatch({ type: LOGOUT, payload: "Unauthorized" });

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  // Clear Message
  const clearMsg = () => dispatch({ type: CLEAR_MSG });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        msg: state.msg,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
        forgotPassword,
        resetRequest,
        updatePassword,
        clearMsg
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
