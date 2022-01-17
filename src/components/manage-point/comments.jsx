import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { authHeader, findDaysDifferent, logOut } from "../../helper/utils";
import { userLogout } from "../../actions/auth";
import axios from "axios";
Comments.propTypes = {
  comment: PropTypes.object,
  saveComment: PropTypes.func,
  reload: PropTypes.func,
  user: PropTypes.object,
};

function Comments({ comment, reload, user }) {
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;
  const [input, setInput] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);
  
  
  /***********Handle Change************/
  const handleChange = (event) => {
    console.log('commentcontent', comment.content, input);
    
    setInput(event.target.value);
  };
  /***********Handle Edit************/
  const handleEdit = () => {
    setIsEdit(true);
    console.log("edit", isEdit);
  };
  /***********Handle Cancel************/
  const handleCancel = () => {
    setIsEdit(false);
  };
  /***********HandlePost*********** */
  const handlePost = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    axios
      .patch(
        `${API_URL}/point-review/comment/${comment.id}`,
        {
          content: input,
        },
        authHeader()
      )
      .then((res) => {
        reload();
        setIsEdit(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
        console.log("Error", err);
      });
  };
  /****************Handle Delete************* */
  const handleDelete = (event) => {
    const commentId = event.currentTarget.getAttribute("data-value");
    axios
      .delete(`${API_URL}/point-review/comment/${commentId}`, authHeader())
      .then((res) => {
        reload();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
        console.log("Error", err);
      });
  };
  if (!isEdit)
    return (
      <div className="review_item">
        <div className="review_usr_dt">
          {comment.created_by.imageUrl ? (
            <img src={comment.created_by.imageUrl} alt="" />
          ) : (
            <img src="/images/left-imgs/user.png" alt="" />
          )}

          <div className="rv1458">
            <h4 className="tutor_name1">
              {comment.created_by.firstName + " " + comment.created_by.lastName}
            </h4>
            <span className="time_145">
              {findDaysDifferent(new Date(comment.created_at))}
            </span>
          </div>
          {comment.created_by.id === user.id && (
            <div className="eps_dots more_dropdown">
              <a href="#">
                <i className="uil uil-ellipsis-v" />
              </a>

              <div className="dropdown-content">
                <span onClick={handleEdit}>
                  <i className="uil uil-comment-alt-edit" />
                  Chỉnh sửa
                </span>
                <span onClick={handleDelete} data-value={comment.id}>
                  <i className="uil uil-trash-alt" />
                  Xóa
                </span>
              </div>
            </div>
          )}
        </div>
        <p className="rvds10">{comment.content}</p>
      </div>
    );
  else
    return (
      <div className="review_item">
        <div className="review_usr_dt">
          <div className="img160">
            {user && user.imageUrl ? (
              <img src={user.imageUrl} alt="" />
            ) : (
              <img src="/images/left-imgs/user.png" alt="" />
            )}
          </div>
          <textarea
            className="_cmnt001"
            placeholder="Phản hồi tin nhắn"
            value={input}
            onChange={handleChange}
          />
        </div>
        <div className="cmnt_group">
          <button className="cmnt-btn" onClick={handlePost}>
            Cập nhật
          </button>
          <button className="cancel-btn ml-2" onClick={handleCancel}>
            Thoát
          </button>
        </div>
      </div>
    );
}

export default Comments;
