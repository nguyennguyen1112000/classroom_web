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
                        T??n c???t ??i???m
                      </th>
                      <th className="text-center" scope="col">
                        ??i???m th???c t???
                      </th>
                      <th className="text-center" scope="col">
                        ??i???m mong mu???n
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
                  placeholder="Ph???n h???i tin nh???n"
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
                Ph???n h???i
              </button>
            </div>
          </div>
        ));
      else
        return (
          <div className="row">

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
                      T??n sinh vi??n
                    </th>
                    <th className="text-center" scope="col">
                      T??n c???t ??i???m
                    </th>
                    <th className="text-center" scope="col">
                      ??i???m hi???n t???i
                    </th>
                    <th className="text-center" scope="col">
                      ??i???m mong mu???n
                    </th>
                    <th className="text-center" scope="col">
                      ??i???m sau ph??c kh???o
                    </th>
                    <th className="text-center" scope="col">
                      Chi ti???t
                    </th>
                    <th className="text-center" scope="col">
                      Tr???ng th??i
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
              <h3>L???ch s??? ph??c kh???o</h3>
            </div>
          </div>
          {renderHistory()}
        </div>
      </div>
    </div>
  );
}

export default HistoryReview;
