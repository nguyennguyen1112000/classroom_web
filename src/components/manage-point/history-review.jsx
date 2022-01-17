import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { authHeader, logOut } from "../../helper/utils";
import { userLogout } from "../../actions/auth";
import axios from "axios";
import Comments from "./comments";
HistoryReview.propTypes = {
  classroom: PropTypes.object,
  isTeacher: PropTypes.bool,
};

function HistoryReview({ classroom, isTeacher }) {
  const dispatch = useDispatch();
  const [history, setHistory] = useState([]);
  const [pointReviews, setPointReviews] = useState([]);
  const [submit, setSubmit] = useState(false);
  const user = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (classroom) {
          const API_URL = process.env.REACT_APP_API_URL;

          const result = await axios.get(
            `${API_URL}/point-review/${classroom.id}`,
            authHeader()
          );
          if (result.data) {
            setHistory(result.data);
            let reviews = [];
            result.data.forEach((x) => {
              reviews.push({
                pointReviewId: x.id,
                content: "",
              });
            });
            setPointReviews(reviews);
          }
        }
      } catch (error) {
        console.log("err", error);
        if (error.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
      }
    };
    fetchData();
  }, [classroom, submit]);

  const handleChange = (event) => {
    const pointReviewId = +event.target.getAttribute("data-value");
    let currentReview = pointReviews.find(
      (x) => x.pointReviewId === pointReviewId
    );
    const index = pointReviews.findIndex(
      (x) => x.pointReviewId === pointReviewId
    );
    currentReview.content = event.target.value;
    let newReview = [...pointReviews];
    newReview[index] = currentReview;
    setPointReviews(newReview);
  };
  /****************Reload************* */
  const reload = () => {
    setSubmit(!submit);
  };

  const handlePost = (event) => {
    const pointReviewId = event.currentTarget.getAttribute("data-value");
    const content = pointReviews.find(
      (x) => x.pointReviewId === +pointReviewId
    ).content;
    const API_URL = process.env.REACT_APP_API_URL;

    axios
      .post(
        `${API_URL}/point-review/comment/${classroom.id}/${pointReviewId}`,
        {
          content: content,
        },
        authHeader()
      )
      .then((res) => {
        setSubmit(!submit);
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
  const getCurrentComment = (id) => {
    const currentComment = pointReviews.find((c) => c.pointReviewId === +id);
    if (currentComment) return currentComment.content;
    return "";
  };
  const renderHistory = () => {
    if (history) {
      if (!isTeacher)
        return history.map((item) => (
          <div className="review_all120" key={item.id}>
            <div className="review_item">
              <div className="review_usr_dt">
                <table className="table ucp-table">
                  <thead className="thead-s">
                    <tr>
                      <th className="text-center" scope="col">
                        Tên cột điểm
                      </th>
                      <th className="text-center" scope="col">
                        Điểm thực tế
                      </th>
                      <th className="text-center" scope="col">
                        Điểm mong muốn
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">{item.assignment.title}</td>
                      <td className="text-center">{item.oldPoint}</td>
                      <td className="text-center">{item.requestPoint}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {item.comments.map((com) => (
              <Comments
                comment={com}
                reload={reload}
                user={user}
                key={com.id}
              />
            ))}

            <div className="cmmnt_1526">
              <div className="cmnt_group">
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
                  value={getCurrentComment(item.id)}
                  data-value={item.id}
                  onChange={handleChange}
                />
              </div>
              <button
                className="cmnt-btn"
                data-value={item.id}
                onClick={handlePost}
              >
                Phản hồi
              </button>
            </div>
          </div>
        ));
      else
        return (
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <ul className="more_options_tt">
                <li>
                  <button className="more_items_14 active">ALL</button>
                </li>
                <li>
                  <button className="more_items_14">PENDING</button>
                </li>
                <li>
                  <button className="more_items_14">CLOSED</button>
                </li>
                <li>
                  <div className="explore_search">
                    <div className="ui search focus">
                      <div className="ui left icon input swdh11 swdh15">
                        <input
                          className="prompt srch_explore"
                          type="text"
                          placeholder="Tìm kiếm"
                        />
                        <i className="uil uil-search-alt icon icon8" />
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-12 col-md-12 mt-2">
              <table className="table ucp-table">
                <thead className="thead-s">
                  <tr>
                    <th className="text-center" scope="col">
                      STT
                    </th>
                    <th className="text-center" scope="col">
                      MSSV
                    </th>
                    <th className="text-center" scope="col">
                      Tên sinh viên
                    </th>
                    <th className="text-center" scope="col">
                      Tên cột điểm
                    </th>
                    <th className="text-center" scope="col">
                      Điểm hiện tại
                    </th>
                    <th className="text-center" scope="col">
                      Điểm mong muốn
                    </th>
                    <th className="text-center" scope="col">
                      Điểm sau phúc khảo
                    </th>
                    <th className="text-center" scope="col">
                      Chi tiết
                    </th>
                    <th className="text-center" scope="col">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((review, index) => (
                    <tr key={review.id}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        {review.created_by.studentId}
                      </td>
                      <td className="text-center">
                        {review.created_by.firstName +
                          " " +
                          review.created_by.lastName}
                      </td>
                      <td className="text-center">{review.assignment.title}</td>
                      <td className="text-center">{review.oldPoint}</td>
                      <td className="text-center">{review.requestPoint}</td>
                      <td className="text-center">
                        {review.finalPoint ? review.finalPoint : ""}
                      </td>
                      <td className="text-center">
                        <a
                          style={{ display: "table-cell" }}
                          href={`/classrooms/${classroom.code}/reviews/${review.id}`}
                          target="_blank"
                        >
                          Xem
                        </a>
                      </td>
                      <td className="text-center">
                        <b className="text-active">
                          {review.status.toUpperCase()}
                        </b>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    } else return <></>;
  };
  return (
    <div className="student_reviews">
      <div className="row">
        <div className="col-lg-12">
          <div className="review_right">
            <div className="review_right_heading">
              <h3>Lịch sử phúc khảo</h3>
            </div>
          </div>
          {renderHistory()}
        </div>
      </div>
    </div>
  );
}

export default HistoryReview;
