import axios from "axios";
import { userLogout } from "../../actions/auth";
import { addNewClass, getAllClasses } from "../../actions/class";
import { authHeader, logOut } from "../../helper/utils";
const API_URL = process.env.REACT_APP_API_URL;
export const getAll = () => {
  return (dispatch) => {
    return axios
      .get(`${API_URL}/classrooms`, authHeader())
      .then((res) => {
        const classList = res.data;
        const action = getAllClasses(classList);
        dispatch(action);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
        console.log("Fail to get data classes");
      });
  };
};

export const createClass = (classroom) => {
  return (dispatch) => {
    return axios
      .post(`${API_URL}/classrooms`, classroom, authHeader())
      .then((res) => {
        const createdClass = res.data;
        const action = addNewClass(createdClass);
        dispatch(action);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
        console.log("Fail to create new class");
      });
  };
};

export const addUserToClass = (userToClass) => {
  return (dispatch) => {
    return axios
      .post(`${API_URL}/user-to-class`, userToClass, authHeader())
      .then((res) => {
        console.log("Add user to class successfully");
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
        console.log("Fail to add user to class");
      });
  };
};
