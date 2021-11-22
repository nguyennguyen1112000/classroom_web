import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import TagsInput from "../tags-input";
import { authHeader, logOut } from "../../helper/utils";
import axios from "axios";
import { userLogout } from "../../actions/auth";

MapStudentModal.propTypes = {
  userId: PropTypes.number,
  classroomId: PropTypes.number,
  handleUpdate: PropTypes.func,
};
MapStudentModal.defaultProps = {
  userId: null,
  classroomId: null,
  handleUpdate: null,
};

function MapStudentModal(props) {
  const { userId, classroomId, handleUpdate } = props;
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;

  function handleSubmit(event) {
    event.preventDefault();
    if (id.length <= 0) {
      setError("MSSV không được để trống");
      return;
    }

    axios
      .put(
        `${API_URL}/user-to-class/mapStudentId`,
        {
          userId,
          classroomId,
          studentId: id,
        },
        authHeader()
      )
      .then((res) => {
        setId("");
        setError("");
        handleUpdate();
        document.getElementById("close-create-modal").click();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
        console.log("Fail to map studentId to class");
      });
  }
  function handleChange(event) {
    setId(event.target.value);
  }
  return (
    <div
      className="course_tabs_1"
      className="modal fade"
      id="mapStudentId"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="mapStudentId"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="title">
              <i className="uil uil-info-circle" />
              Cập nhật MSSV
            </h3>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              id="close-create-modal"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="col-lg-12 col-md-12">
              <div className="ui search focus mt-30 lbel25">
                <label>MSSV (Lưu ý chỉ nhập được 1 lần duy nhất)</label>
                <div className="ui left icon input swdh11 swdh19">
                  <input
                    id="studentId"
                    name="studentId"
                    defaultValue={id}
                    onChange={handleChange}
                    placeholder="Nhập MSSV của bạn"
                  />
                </div>
              </div>
              {error && (
                <div className="help-block text-danger ml-2">{error}</div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-default steps_btn"
              onClick={handleSubmit}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapStudentModal;
