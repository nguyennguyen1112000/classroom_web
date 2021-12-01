import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { userLogout } from "../../actions/auth";
import Footer from "../../components/footer";
import InviteUserModal from "../../components/modal/invite-user";
import { authHeader, logOut } from "../../helper/utils";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PointStructureItem from "../../components/drag-item/point-structure-item";
function DetailClass() {
  const API_URL = process.env.REACT_APP_API_URL;
  const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;
  const [classroom, setClassroom] = useState();
  const [role, setRole] = useState("giảng viên");
  const [modalId, setModalId] = useState("inviteTeachers");
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();
  let { code } = useParams();
  const user = useSelector((state) => state.auth.currentUser);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${API_URL}/classrooms/code/${code}`,
          authHeader()
        );
        if (result.data.created_by.id !== user.id) setRedirect(true);
        else {
          setClassroom(result.data);
          setCards(result.data.pointStructures);
        }
      } catch (error) {
        if (error.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
      }
    };
    fetchData();
  }, [API_URL, code, dispatch, user.id]);
  function formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  function handleClickTeachers(event) {
    setModalId("inviteTeachers");
    setRole("teacher");
  }
  function handleClickStudents(event) {
    setModalId("inviteStudents");
    setRole("student");
  }
  const moveCard = (dragIndex, hoverIndex) => {
    const dragCard = cards[dragIndex];
    const dragOrder = dragCard.order;
    let newCards = [...cards];
    newCards[dragIndex] = newCards[hoverIndex];
    newCards[hoverIndex] = dragCard;
    newCards[hoverIndex].order = newCards[dragIndex].order;
    newCards[dragIndex].order = dragOrder;
    if (!newCards[dragIndex].isNew)
      axios
        .patch(
          `${API_URL}/point-structure/${newCards[dragIndex].id}`,
          newCards[dragIndex],
          authHeader()
        )
        .then((res) => {})
        .catch((err) => {
          if (err.response.status === 401) {
            const logoutAction = userLogout();
            logOut();
            dispatch(logoutAction);
          }
          console.log("Error", err);
        });
    if (!newCards[hoverIndex].isNew)
      axios
        .patch(
          `${API_URL}/point-structure/${newCards[hoverIndex].id}`,
          newCards[hoverIndex],
          authHeader()
        )
        .then((res) => {})
        .catch((err) => {
          if (err.response.status === 401) {
            const logoutAction = userLogout();
            logOut();
            dispatch(logoutAction);
          }
          console.log("Error", err);
        });
    setCards(newCards);
  };
  const renderCard = (card, index) => {
    return (
      <PointStructureItem
        key={card.id}
        index={index}
        id={card.id}
        title={card.title}
        point={card.point}
        moveCard={moveCard}
        updateCards={updateCard}
        removeCard={removeCard}
        isEdit={card.isEdit ? true : false}
        isNew={card.isNew ? true : false}
        classroomId={classroom && classroom.id}
        order={card.order}
      />
    );
  };
  const handleClickAdd = () => {
    const nextId = Math.max(...cards.map((card) => card.id)) + 1;
    const nextOrder = Math.max(...cards.map((card) => card.order)) + 1;
    setCards([
      ...cards,
      {
        id: nextId,
        title: "",
        point: 0,
        isNew: true,
        isEdit: true,
        order: nextOrder,
      },
    ]);
  };
  const updateCard = (id, newCard) => {
    const index = cards.findIndex((card) => card.id === id);
    let newCards = [...cards];
    newCards[index] = newCard;
    setCards(newCards);
  };
  const removeCard = (id) => {
    const index = cards.findIndex((card) => card.id === id);
    let newCards = [...cards.slice(0, index), ...cards.slice(index + 1)];
    setCards(newCards);
  };
  if (redirect)
    return (
      <div className="wrapper coming_soon_wrapper">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="cmtk_group">
                <div className="ct-logo">
                  <a href="index.html">
                    <img src="images/ct_logo.svg" alt="logo" />
                  </a>
                </div>
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
  else
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
                            <div className="_ttl122">Mã lớp học</div>
                            <div className="_ttl123">
                              {classroom && classroom.code}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="_ttl121">
                            <div className="_ttl122">Số giảng viên</div>
                            <div className="_ttl123">
                              {classroom && 1 + classroom.teachers.length}
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
                    <div className="col-lg-5">
                      <div className="eps_dots more_dropdown">
                        <button className="msg125 btn500">
                          <span className="vdt14"> Chia sẻ mã lớp</span>
                          <span>
                            <i className="uil uil-share-alt" />
                          </span>
                        </button>
                        <div className="dropdown-content">
                          <span
                            onClick={() => {
                              navigator.clipboard.writeText(
                                classroom
                                  ? `${PUBLIC_URL}/classrooms/${classroom.code}`
                                  : ""
                              );
                            }}
                          >
                            <i className="uil uil-link-alt" />
                            Sao chép đường liên kết
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <InviteUserModal
          modalId={modalId}
          role={role}
          classroomId={classroom && classroom.id}
        />
        <div className="_215b15">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="course_tabs">
                  <nav>
                    <div
                      className="nav nav-tabs tab_crse"
                      id="nav-tab"
                      role="tablist"
                    >
                      <a
                        className="nav-item nav-link active"
                        id="nav-about-tab"
                        data-toggle="tab"
                        href="#nav-about"
                        role="tab"
                        aria-selected="true"
                      >
                        Bài đăng
                      </a>
                      <a
                        className="nav-item nav-link"
                        id="nav-courses-tab"
                        data-toggle="tab"
                        href="#nav-courses"
                        role="tab"
                        aria-selected="false"
                      >
                        Thành viên
                      </a>
                      <a
                        className="nav-item nav-link"
                        id="nav-point-structure-tab"
                        data-toggle="tab"
                        href="#nav-point-structure"
                        role="tab"
                        aria-selected="false"
                      >
                        Cấu trúc điểm
                      </a>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="_215b17">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="course_tab_content">
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="nav-about"
                      role="tabpanel"
                    >
                      <div className="student_reviews">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="review_right">
                              <div className="review_right_heading">
                                <h3>Trao đổi với lớp học tại đây</h3>
                              </div>
                            </div>
                            <div className="cmmnt_1526">
                              <div className="cmnt_group">
                                <div className="img160">
                                  <img
                                    src={`${process.env.REACT_APP_PUBLIC_URL}/images/left-imgs/img-1.jpg`}
                                    alt="avatar"
                                  />
                                </div>
                                <textarea
                                  className="_cmnt001"
                                  placeholder="Thêm nội dung nào đó cho lớp học của bạn"
                                  defaultValue={""}
                                />
                              </div>
                              <button className="cmnt-btn" type="submit">
                                Đăng
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-courses"
                      role="tabpanel"
                    >
                      <div className="crse_content">
                        <h3>
                          Giáo viên
                          <a
                            className="option_links"
                            title="Messages"
                            href="/"
                            data-toggle="modal"
                            data-target={`#${modalId}`}
                            onClick={handleClickTeachers}
                          >
                            <i className="uil uil-user-plus"></i>
                          </a>
                        </h3>

                        <div className="_14d25">
                          <div className="row">
                            <div
                              className="col-lg-3 col-md-4"
                              key={classroom && classroom.created_by.id}
                            >
                              <div className="fcrse_1 mt-30">
                                <div className="tutor_img">
                                  <a href="/">
                                    <img
                                      src={`${process.env.REACT_APP_PUBLIC_URL}/images/left-imgs/img-1.jpg`}
                                      alt="owner"
                                    />
                                  </a>
                                </div>
                                <div className="tutor_content_dt">
                                  <div className="tutor150">
                                    <a
                                      href="instructor_profile_view.html"
                                      className="tutor_name"
                                    >
                                      {classroom &&
                                        classroom.created_by.firstName}{" "}
                                      {classroom &&
                                        classroom.created_by.lastName}
                                    </a>
                                    <div className="mef78" title="Verify">
                                      <i className="uil uil-check-circle" />
                                    </div>
                                  </div>
                                  <div className="tutor_cate">
                                    {classroom && classroom.created_by.email}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {classroom &&
                              classroom.teachers.map((teacher) => (
                                <div
                                  className="col-lg-3 col-md-4"
                                  key={teacher.user.id}
                                >
                                  <div className="fcrse_1 mt-30">
                                    <div className="tutor_img">
                                      <a href="instructor_profile_view.html">
                                        <img
                                          src={`${process.env.REACT_APP_PUBLIC_URL}/images/left-imgs/img-1.jpg`}
                                          alt="teacher"
                                        />
                                      </a>
                                    </div>
                                    <div className="tutor_content_dt">
                                      <div className="tutor150">
                                        <a
                                          href="instructor_profile_view.html"
                                          className="tutor_name"
                                        >
                                          {teacher.user.firstName}{" "}
                                          {teacher.user.lastName}
                                        </a>
                                        <div className="mef78" title="Verify">
                                          <i className="uil uil-check-circle" />
                                        </div>
                                      </div>
                                      <div className="tutor_cate">
                                        {teacher.user.email}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="crse_content">
                        <h3>
                          Sinh viên
                          <a
                            className="option_links"
                            title="Messages"
                            href="/"
                            data-toggle="modal"
                            data-target={`#${modalId}`}
                            onClick={handleClickStudents}
                          >
                            <i className="uil uil-user-plus"></i>
                          </a>
                        </h3>

                        <div className="_14d25">
                          <div className="row">
                            {classroom &&
                              classroom.students.map((stu) => (
                                <div
                                  className="col-lg-3 col-md-4"
                                  key={stu.user.id}
                                >
                                  <div className="fcrse_1 mt-30">
                                    <div className="tutor_img">
                                      <a href="/">
                                        <img
                                          src={`${process.env.REACT_APP_PUBLIC_URL}/images/left-imgs/img-1.jpg`}
                                          alt="student"
                                        />
                                      </a>
                                    </div>
                                    <div className="tutor_content_dt">
                                      <div className="tutor150">
                                        <a
                                          href="instructor_profile_view.html"
                                          className="tutor_name"
                                        >
                                          {stu.user.firstName}{" "}
                                          {stu.user.lastName}
                                        </a>
                                        <div className="mef78" title="Verify">
                                          <i className="uil uil-check-circle" />
                                        </div>
                                      </div>
                                      <div className="tutor_cate">
                                        {stu.user.email}
                                      </div>
                                      {stu.studentId === null && (
                                        <div className="tutor_cate">
                                          Chưa cập nhật MSSV
                                        </div>
                                      )}
                                      {stu.studentId && (
                                        <div className="tutor_cate">
                                          {stu.studentId}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-point-structure"
                      role="tabpanel"
                    >
                      <div>
                        <div className="curriculum-section">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="added-section-item mb-30">
                                <div className="section-header">
                                  <h4>
                                    <i className="fas fa-bars mr-2" />
                                    Chi tiết các mục điểm
                                  </h4>
                                </div>

                                <div className="section-group-list">
                                  <DndProvider backend={HTML5Backend}>
                                    <div>
                                      {cards.map((card, i) =>
                                        renderCard(card, i)
                                      )}
                                    </div>
                                  </DndProvider>
                                </div>
                                <div className="section-add-item-wrap p-3">
                                  <button
                                    className="add_lecture"
                                    onClick={handleClickAdd}
                                  >
                                    <i className="far fa-plus-square mr-2" />
                                    Thêm mục mới
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
}

export default DetailClass;
