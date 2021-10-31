import { combineReducers } from "redux";
import classReducer from "./class";
import authReducer from "./auth";

const rootReducer = combineReducers({
  auth: authReducer,
  class: classReducer
});

export default rootReducer;