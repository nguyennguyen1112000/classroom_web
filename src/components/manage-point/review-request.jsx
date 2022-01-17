import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { authHeader, logOut } from "../../helper/utils";
import { userLogout } from "../../actions/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
ReviewRequest.propTypes = {
  isDisplay: PropTypes.bool,
  detailPoint: PropTypes.object,
  classroom: PropTypes.object,
  setPointReview: PropTypes.func,
  reload: PropTypes.func,
};

function ReviewRequest({
  isDisplay,
  detailPoint,
  classroom,
  setPointReview,
  reload,
}) {
  const [review, setReview] = useState(
    detailPoint
      ? {
          oldPoint: detailPoint.detailPoint,
          requestPoint: 0,
          assignmentId: detailPoint.id,
          reasonToReview: "",
        }
      : null
  );
  const user = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    if (detailPoint)
      setReview({
        oldPoint: detailPoint.detailPoint,
        requestPoint: 0,
        assignmentId: detailPoint.id,
        reasonToReview: "",
      });
  }, [detailPoint]);
  /****************** On key press *********************/
  function onKeyPress(event) {
    if (!/^[+-]?\d*(?:[.]\d*)?$/.test(event.key)) {
      event.preventDefault();
    }
  }
  async function handleSubmit() {
    const API_URL = process.env.REACT_APP_API_URL;
    if(!user.studentId) toast.error("Cập nhật MSSV trước khi phúc khảo", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    const canReview = await axios.get(
      `${API_URL}/point-review/can-request/${review.assignmentId}`,
      authHeader()
    );
    if (canReview.data === true)
      axios
        .post(`${API_URL}/point-review/${classroom.id}`, review, authHeader())
        .then((res) => {
          toast.success("Gửi yêu cầu phúc khảo thành công!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setPointReview();
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
    else
      toast.error("Bạn đã gửi phúc khảo mục này rồi", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  }

  function handleChange(event) {
    switch (event.target.name) {
      case "point":
        setReview({
          ...review,
          requestPoint: event.target.value,
        });
        break;
      case "reason":
        setReview({
          ...review,
          reasonToReview: event.target.value,
        });
        break;
      default:
        break;
    }
  }

  if (isDisplay)
    return (
      <div className="course__form">
        <div className="general_info10">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="ui search focus mt-30 lbel25">
                <label>Tên cột điểm: </label>
                <b>{detailPoint.title}</b>
              </div>
              <div className="ui search focus mt-30 lbel25">
                <label>Điểm thực tế: </label> <b>{detailPoint.detailPoint}</b>
              </div>
              <div className="ui search focus mt-30 lbel25">
                <label>Điểm mong muốn*</label>
                <div className="ui left icon input swdh19">
                  <input
                    className="prompt srch_explore"
                    type="text"
                    placeholder="Nhập điểm mong muốn"
                    name="point"
                    value={review ? review.requestPoint : 0}
                    onKeyPress={onKeyPress}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12">
              <div className="ui search focus lbel25 mt-30">
                <label>Trình bày lý do*</label>
                <div className="ui form swdh30">
                  <div className="field">
                    <textarea
                      rows={3}
                      name="reason"
                      value={review ? review.reasonToReview : ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="help-block">
                  Sinh viên trình bày lý do cho điểm số mong muốn của bản thân
                </div>
              </div>
            </div>
            <button className="cmnt-btn" onClick={handleSubmit}>
              Đăng
            </button>
          </div>
        </div>
      </div>
    );
  else return <></>;
}

export default ReviewRequest;
