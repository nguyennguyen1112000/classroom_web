import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { userLogout } from "../../actions/auth";
import { authHeader, formatDate, logOut } from "../../helper/utils";
import axios from "axios";
import { useDispatch } from "react-redux";

UserRow.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  reload: PropTypes.func,
};

function UserRow({ user, index, reload }) {
  const [isEdit, setIsEdit] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    setStudentId(user.studentId);
  }, [user]);
  const handleClick = () => {
    if (isEdit) {
      const API_URL = process.env.REACT_APP_API_URL;
      axios
        .patch(
          `${API_URL}/users/studentId`,
          {
            studentId,
            userId: user.id,
          },
          authHeader()
        )
        .then((res) => {
          toast.success("Cập nhật thành công!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          reload();
        })
        .catch((err) => {
          if (err.response.status === 401) {
            const logoutAction = userLogout();
            logOut();
            dispatch(logoutAction);
          }
          setStudentId(user.studentId);
          toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
    setIsEdit(!isEdit);
  };

  const updateUserStatus = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    axios
      .patch(
        `${API_URL}/users/user-status`,
        {
          status: user.status === "active" ? "banned" : "active",
          userId: user.id,
        },
        authHeader()
      )
      .then((res) => {
        toast.success("Cập nhật thành công!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        reload();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  const handleChange = (event) => {
    console.log(event.target.value);
    setStudentId(event.target.value);
  };
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <a href={`/profile/${user.id}`}>{user.email}</a>
      </td>
      <td>{user.firstName + " " + user.lastName}</td>
      {isEdit ? (
        <td>
          {" "}
          <input
            className="point-input col-md-offset-5 col-md-5"
            type="text"
            name="studentId"
            value={studentId}
            onChange={handleChange}
          />
        </td>
      ) : (
        <td>{user.studentId}</td>
      )}
      <td>
        <b
          className={user.status === "active" ? "text-inactive" : "text-active"}
        >
          {user.status.toUpperCase()}
        </b>
      </td>
      <td>{formatDate(new Date(user.created_at))}</td>
      <td>
        {user.status === "active" ? (
          <button
            href="#"
            title="Delete"
            className="btn btn-danger btn-sm"
            onClick={updateUserStatus}
          >
            <i className="uil uil-lock" />
          </button>
        ) : (
          <button
            href="#"
            title="Delete"
            className="btn btn-success btn-sm"
            onClick={updateUserStatus}
          >
            <i className="uil uil-lock-open-alt" />
          </button>
        )}
        {!isEdit ? (
          <button
            href="#"
            title="Edit"
            className="btn btn-sm btn-info"
            onClick={handleClick}
          >
            <i className="uil uil-edit" />
          </button>
        ) : (
          <button
            href="#"
            title="Save"
            className="btn btn-sm btn-success"
            onClick={handleClick}
          >
            <i className="uil uil-check" />
          </button>
        )}
      </td>
    </tr>
  );
}

export default UserRow;
