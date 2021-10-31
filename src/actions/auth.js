import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from "./type";

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

