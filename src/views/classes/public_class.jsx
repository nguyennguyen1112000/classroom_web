import axios from "axios";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useLocation, useParams } from "react-router";
import { userLogout } from "../../actions/auth";
import PointStructureItem from "../../components/drag-item/point-structure-item";
import Footer from "../../components/footer";
import ManagePoints from "../../components/manage-point";
import { authHeader, logOut } from "../../helper/utils";
import { addUserToClass } from "../../services/api/class";

function PublicClass() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [classroom, setClassroom] = useState();
  const [existed, setExisted] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [cards, setCards] = useState([]);
  const [point, setPoint] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [reload, setReload] = useState(false);
  const dispatch = useDispatch();

  let { code } = useParams();
  const search = useLocation().search;
  const user = useSelector((state) => state.auth.currentUser);
  useEffect(() => {
    let role = new URLSearchParams(search).get("role");
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${API_URL}/classrooms/code/${code}`,
          authHeader()
        );
        if (result.data) {
          if (result.data.created_by.id === user.id) setRedirect(true);
          else {
            if (!role) role = "student";

            const userToClass = {
              userId: user.id,
              role: role,
              classroomId: result.data.id,
            };
            dispatch(addUserToClass(userToClass));
            if (user.studentId) {
              const pointData = await axios.get(
                `${API_URL}/student-to-assignment/myPoints/${result.data.id}`,
                authHeader()
              );
              setPoint(pointData.data);
            }
          }
          setExisted(true);
          setClassroom(result.data);

          const teacher =
            result.data.teachers.length > 0 &&
            result.data.teachers.some((teacher) => teacher.user.id === user.id);
          setIsTeacher(teacher);
          setCards(result.data.pointStructures);
          if (teacher) {
            if (result.data.studentsFile) {
              const students = await axios.get(
                `${API_URL}/file/studentList/${result.data.id}`,
                authHeader()
              );
              setStudentList(students.data);
            }
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
  }, [ API_URL, code, dispatch, search, user.id]);
  // function handleClick() {
  //   setUpdateStudentId(true);
  // }

  function formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  const renderPoint = () => {
    console.log("user", user);

    if (user && user.studentId)
      return (
        <table className="table ucp-table">
          <thead className="thead-s">
            <tr>
              <th>MSSV</th>
              <th>Họ và tên</th>
              {cards &&
                cards.map((card) => <th key={card.id}>{card.title}</th>)}
              <th>Tổng kết</th>
            </tr>
          </thead>
          <tbody>
            {user && (
              <tr>
                <td>{user.studentId}</td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                {point &&
                  point.map((p) => (
                    <td>
                      <b className="course_active">{p.detailPoint}</b>
                    </td>
                  ))}
              </tr>
            )}
          </tbody>
        </table>
      );
    return <div>Vui lòng cập nhật MSSV để coi điểm</div>;
  };
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
  if (redirect) {
    return <Redirect to={`/my-classes/${classroom.code}`} />;
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
                      <a
                        className="nav-item nav-link"
                        id="nav-point-detail-tab"
                        data-toggle="tab"
                        href="#nav-point-detail"
                        role="tab"
                        aria-selected="false"
                      >
                        Điểm số
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
                        <h3>Giáo viên</h3>

                        <div className="_14d25">
                          <div className="row">
                            {classroom &&
                              classroom.teachers.map((teacher) => (
                                <div
                                  className="col-lg-3 col-md-4"
                                  key={teacher.user.id}
                                >
                                  <div className="fcrse_1 mt-30">
                                    <div className="tutor_content_dt">
                                      <div className="tutor150">
                                        <a
                                          href="instructor_profile_view.html"
                                          className="tutor_name"
                                        >
                                          {teacher.user.firstName}{" "}
                                          {teacher.user.lastName}
                                        </a>
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
                        <h3>Sinh viên</h3>

                        <div className="_14d25">
                          <div className="row">
                            {classroom &&
                              classroom.students.map((stu) => (
                                <div
                                  className="col-lg-3 col-md-4"
                                  key={stu.user.id}
                                >
                                  <div className="fcrse_1 mt-30">
                                    <div className="tutor_content_dt">
                                      <div className="tutor150">
                                        <a
                                          href="instructor_profile_view.html"
                                          className="tutor_name"
                                        >
                                          {stu.user.firstName}{" "}
                                          {stu.user.lastName}
                                        </a>
                                      </div>
                                      <div className="tutor_cate">
                                        {stu.user.email}
                                      </div>
                                      {user.email === stu.user.email &&
                                        stu.studentId === null && (
                                          <div className="tutor_cate">
                                            Chưa cập nhật MSSV
                                          </div>
                                        )}
                                      {user.email !== stu.user.email &&
                                        stu.studentId && (
                                          <div className="tutor_cate">
                                            {stu.studentId}
                                          </div>
                                        )}
                                      {user.email !== stu.user.email &&
                                        stu.studentId === null && (
                                          <div className="tutor_cate">
                                            Chưa cập nhật MSSV
                                          </div>
                                        )}
                                      {user.email === stu.user.email &&
                                        stu.studentId && (
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
                                  {classroom && isTeacher && (
                                    <>
                                      <DndProvider backend={HTML5Backend}>
                                        <div>
                                          {cards.map((card, i) =>
                                            renderCard(card, i)
                                          )}
                                        </div>
                                      </DndProvider>
                                      <div className="section-add-item-wrap p-3">
                                        <button
                                          className="add_lecture"
                                          onClick={handleClickAdd}
                                        >
                                          <i className="far fa-plus-square mr-2" />
                                          Thêm mục mới
                                        </button>
                                      </div>
                                    </>
                                  )}
                                  {classroom && !isTeacher && (
                                    <div className="table-responsive">
                                      <table
                                        className="table ucp-table"
                                        id="content-table"
                                      >
                                        <thead className="thead-s">
                                          <tr>
                                            <th
                                              className="text-center"
                                              scope="col"
                                            >
                                              STT
                                            </th>
                                            <th scope="col">Tên cột điểm</th>
                                            <th
                                              className="text-center"
                                              scope="col"
                                            >
                                              Điểm
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {cards.map((card, index) => (
                                            <tr key={index}>
                                              <td className="text-center">
                                                {index + 1}
                                              </td>
                                              <td className="cell-ta">
                                                {card.title}
                                              </td>
                                              <td className="text-center">
                                                {card.point}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-point-detail"
                      role="tabpanel"
                    >
                      <div>
                        <div className="curriculum-section">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="table-responsive mt-30">
                                {!isTeacher && renderPoint()}
                                {isTeacher && (
                                  <ManagePoints
                                    cards={cards}
                                    classroom={classroom}
                                    studentList={studentList}
                                    reload={reload}
                                    setReload={setReload}
                                    setStudentList={setStudentList}
                                    setCards={setCards}
                                  />
                                )}
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
  else
    return (
      <div className="wrapper coming_soon_wrapper">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="cmtk_group">
                <div className="ct-logo">
                  <a href="index.html">
                    <img src="images/ct_logo.svg" alt="" />
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
}

export default PublicClass;
