import { CREATE_CLASS, GET_ALL_CLASSES, GET_ALL_JOINED_CLASSES } from "../actions/type";

const classReducerInitialState = {
  classList: [],
  joinedClasses: []
};
const classReducer = (state = classReducerInitialState, action) => {
  switch (action.type) {
    case GET_ALL_CLASSES:
      return { ...state, classList: action.payload };
    case GET_ALL_JOINED_CLASSES:
      return { ...state, joinedClasses: action.payload };
    case CREATE_CLASS:
      let newClassList = [...state.classList];
      newClassList.push(action.payload);
      return { ...state, classList: newClassList };
    default:
      return state;
  }
};
export default classReducer;
