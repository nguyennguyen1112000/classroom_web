import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import TagsInput from "../tags-input";
import { authHeader, logOut } from "../../helper/utils";
import axios from "axios";
import { userLogout } from "../../actions/auth";

InviteUserModal.propTypes = {
  role: PropTypes.string,
  modalId: PropTypes.node,
  classroomId: PropTypes.number,
};
InviteUserModal.defaultProps = {
  role: "",
  modalId: "",
  classroomId: 0,
};

function InviteUserModal(props) {
  const { role, modalId, classroomId } = props;
  const [emails, setEmails] = useState([]);
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;

  function handleSubmit(event) {
    event.preventDefault();
    if (emails.length > 0) {
      for (let i = 0; i < emails.length; i++) {
        axios
          .post(
            `${API_URL}/classrooms/invite/${classroomId}`,
            {
              email: emails[i],
              role,
            },
            authHeader()
          )
          .then((res) => {
            console.log("Response", res);
            document.getElementById("close-create-modal").click();
          })
          .catch((err) => {
            if (err.response.status === 401) {
              const logoutAction = userLogout();
              logOut();
              dispatch(logoutAction);
            }
            console.log("Fail to send emails");
          });
        setEmails([]);
      }
    }
  }
  function handleSelecetedTags(items) {
    setEmails(items);
  }
  return (
    <div
      className="course_tabs_1 modal fade"
      id={modalId}
      tabIndex="-1"
      role="dialog"
      aria-labelledby={modalId}
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="title">
              <i className="uil uil-info-circle" />
              Mời {role === "teacher" ? "giảng viên" : "sinh viên"}
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
                <label>
                  Email {role === "teacher" ? "giảng viên" : "sinh viên"}
                </label>
                <TagsInput
                  selectedTags={handleSelecetedTags}
                  fullWidth
                  variant="outlined"
                  id="tags"
                  name="emails"
                  placeholder="Nhập email"
                  label="emails"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-default steps_btn"
              onClick={handleSubmit}
            >
              Mời tham gia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteUserModal;
