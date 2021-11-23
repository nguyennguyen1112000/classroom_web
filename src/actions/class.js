import { CREATE_CLASS, GET_ALL_CLASSES, GET_ALL_JOINED_CLASSES } from "./type";

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

export const getJoinedClasses = (classList) => {
  return {
    type: GET_ALL_JOINED_CLASSES,
    payload: classList,
  };
};
