import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import { userLogout } from "../../actions/auth";
import Footer from "../../components/footer";

import { authHeader, logOut } from "../../helper/utils";
import Comments from "./comments";

function ReviewDetail() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [classroom, setClassroom] = useState();
  const [existed, setExisted] = useState(false);
  const [reload, setReload] = useState(false);
  const [review, setReview] = useState(null);
  const [input, setInput] = useState("");
  const [point, setPoint] = useState("");
  const dispatch = useDispatch();

  let { code, reviewId } = useParams();
  const search = useLocation().search;
  const user = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${API_URL}/classrooms/code/${code}`,
          authHeader()
        );
        if (result.data) {
          const reviewResult = await axios.get(
            `${API_URL}/point-review/detail/${result.data.id}/${reviewId}`,
            authHeader()
          );
          if (reviewResult.data) {
            setReview(reviewResult.data);
            if (reviewResult.data.finalPoint !== null)
              setPoint(reviewResult.data.finalPoint);
          }
          setExisted(true);
          setClassroom(result.data);
          const isTeacher =
            result.data.teachers.length > 0 &&
            result.data.teachers.some((teacher) => teacher.user.id === user.id);
          if (!isTeacher) setExisted(false);
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
  }, [reload]);
  const handleChange = (event) => {
    setInput(event.target.value);
  };
  const updateStatus = () => {
    const API_URL = process.env.REACT_APP_API_URL;

    axios
      .post(
        `${API_URL}/point-review/update-status/${classroom.id}/${review.id}`,
        {
          finalPoint: point,
          status: review.status === "pending" ? "closed" : "pending",
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
        reloadPage();
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
  const onKeyPress = (event) => {
    if (!/^[+-]?\d*(?:[.]\d*)?$/.test(event.key)) {
      event.preventDefault();
    }
  };
  const handleUpdatePoints = (event) => {
    setPoint(event.target.value);
  };
  const reloadPage = () => {
    setReload(!reload);
  };
  const handlePost = () => {
    axios
      .post(
        `${API_URL}/point-review/comment/${classroom.id}/${review.id}`,
        {
          content: input,
        },
        authHeader()
      )
      .then((res) => {
        setInput("");
        reloadPage();
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

  function formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  if (existed)
    return (
      <div className="wrapper _bg4586">
        <div className="_216b01">
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-md-10">
                <div className="section3125 rpt145">
                  <div className="row">
                    <div className="col-lg-7">
                      <a href="/" className="_216b22">
                        <span>
                          <i className="uil uil-windsock" />
                        </span>
                        Report Profile
                      </a>
                      <div className="dp_dt150">
                        <div className="prfledt1">
                          <h2>{classroom && classroom.name}</h2>
                          <span>{classroom && classroom.topic}</span>
                        </div>
                      </div>
                      <ul className="_ttl120">
                        <li>
                          <div className="_ttl121">
                            <div className="_ttl122">Số giảng viên</div>
                            <div className="_ttl123">
                              {classroom && classroom.teachers.length}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="_ttl121">
                            <div className="_ttl122">Số sinh viên</div>
                            <div className="_ttl123">
                              {classroom && classroom.students.length}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="_ttl121">
                            <div className="_ttl122">Ngày tạo lớp</div>
                            <div className="_ttl123">
                              {classroom &&
                                formatDate(new Date(classroom.created_at))}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="_215b15">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="course__form">
                  <div className="general_info10">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        {review && (
                          <h2 className="st_title">
                            <i className="uil uil-file-alt"></i> Phúc khảo{" "}
                            <b>{review.assignment.title}</b> -{" "}
                            {review.created_by.firstName +
                              " " +
                              review.created_by.lastName}{" "}
                            - {review.created_by.studentId}
                          </h2>
                        )}
                      </div>
                      <table className="table ucp-table">
                        <thead className="thead-s">
                          <tr>
                            <th className="text-center" scope="col">
                              Điểm thực tế
                            </th>
                            <th className="text-center" scope="col">
                              Điểm mong muốn
                            </th>
                            <th className="text-center" scope="col">
                              Trạng thái
                            </th>
                            <th className="text-center" scope="col">
                              Điểm cuối
                            </th>
                            <th className="text-center" scope="col">
                              Đóng/ Mở phúc khảo
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {review && (
                            <tr>
                              <td className="text-center">{review.oldPoint}</td>
                              <td className="text-center">
                                {review.requestPoint}
                              </td>
                              <td className="text-center">
                                <b className="text-active">
                                  {review.status.toUpperCase()}
                                </b>
                              </td>
                              <td className="text-center">
                                {review.status === "pending" ? (
                                  <input
                                    className="point-input col-md-offset-5 col-md-5"
                                    type="text"
                                    pattern="[0-9]*"
                                    name="detailPoint"
                                    value={point}
                                    onKeyPress={onKeyPress}
                                    onChange={handleUpdatePoints}
                                  />
                                ) : (
                                  review.finalPoint
                                )}
                              </td>
                              {review.status === "pending" ? (
                                <td className="text-center">
                                  <button
                                    className="btn btn-danger"
                                    onClick={updateStatus}
                                  >
                                    Kết thúc
                                  </button>
                                </td>
                              ) : (
                                <td className="text-center">
                                  <button
                                    className="btn btn-success"
                                    onClick={updateStatus}
                                  >
                                    Mở lại
                                  </button>
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {review ? (
                    review.comments.map((com) => (
                      <Comments
                        comment={com}
                        reload={reloadPage}
                        user={user}
                        key={com.id}
                      />
                    ))
                  ) : (
                    <></>
                  )}
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
                        value={input}
                        onChange={handleChange}
                      />
                    </div>
                    <button className="cmnt-btn" onClick={handlePost}>
                      Phản hồi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  else
    return (
      <div className="wrapper coming_soon_wrapper">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="cmtk_group">
                <div className="cmtk_dt">
                  <h1 className="title_404">404</h1>
                  <h4 className="thnk_title1">Lớp học không tồn tại</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ReviewDetail;
