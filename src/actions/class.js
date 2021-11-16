import { CREATE_CLASS, GET_ALL_CLASSES } from "./type";

export const addNewClass = (classroom) => {
  return {
    type: CREATE_CLASS,
    payload: classroom,
  };
};

export const getAllClasses = (classList) => {
  return {
    type: GET_ALL_CLASSES,
    payload: classList,
  };
};


