import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, UPDATE_PROFILE } from "./type";

export const userLoginSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  };
};
export const userLoginFail = (user) => {
  return {
    type: LOGIN_FAIL,
  };
};

export const userLogout = () => {
  return {
    type: LOGOUT,
  };
};

export const updateProfile = (user) => {
  return {
    type: UPDATE_PROFILE,
    payload: user,
  };
};

