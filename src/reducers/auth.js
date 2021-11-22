import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, UPDATE_PROFILE } from "../actions/type";


const user = JSON.parse(localStorage.getItem("user"));
console.log(JSON.parse(localStorage.getItem("token")));
const authReducerInitialState = user
  ? {
      currentUser: user,
      isLoggedIn: true,
    }
  : { currentUser: null, isLoggedIn: false };

const authReducer = (state = authReducerInitialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, isLoggedIn: true, currentUser: action.payload };
    case LOGIN_FAIL:
      return { ...state, isLoggedIn: false, currentUser: null };
    case LOGOUT:
      return { ...state, isLoggedIn: false, currentUser: null };
    case UPDATE_PROFILE:
      return { ...state, isLoggedIn: true, currentUser: action.payload };
    default:
      return state;
  }
};
export default authReducer;
