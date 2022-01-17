import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { authHeader, logOut } from "../../helper/utils";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { userLogout } from "../../actions/auth";
ManagePoints.propTypes = {
  cards: PropTypes.array,
  classroom: PropTypes.object,
  studentList: PropTypes.array,
  reload: PropTypes.bool,
  setReload: PropTypes.func,
  setStudentList: PropTypes.func,
  setCards: PropTypes.func,
  canUploadStudents: PropTypes.bool,
};

function ManagePoints(props) {
  const {
    cards,
    classroom,
    studentList,
    reload,
    setReload,
    setStudentList,
    setCards,
    canUploadStudents,
  } = props;
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;
  const [pointUpdated, setPointUpdated] = useState([]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (classroom) {
        updatePoints(classroom.id, pointUpdated);
        setPointUpdated([]);
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [pointUpdated, classroom]);
  const downloadStudentsTemplate = (e) => {
    e.preventDefault();
    const downloadLink = `${API_URL}/file/template/studentList`;
    const a = document.createElement("a");
    a.href = downloadLink;
    a.click();
  };

  const downloadMarkTemplate = (e) => {
    e.preventDefault();
    const downloadLink = `${API_URL}/file/template/mark/${classroom.id}`;
    axios({
      url: downloadLink,
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "MarkTemplate.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };

  const exportFinalFile = (e) => {
    e.preventDefault();
    const downloadLink = `${API_URL}/file/mark/${classroom.id}`;
    axios({
      url: downloadLink,
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "DetailPoint.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };
  /******************Delete file *********************/

  /****************** On key press *********************/
  function onKeyPress(event) {
    if (!/^[+-]?\d*(?:[.]\d*)?$/.test(event.key)) {
      event.preventDefault();
    }
  }
  /****************** Handle change input *********************/
  const handleUpdatePoints = (e) => {
    const newPoint = e.target.value;
    console.log("point", newPoint);

    let list = studentList;
    const studentId = e.currentTarget.getAttribute("data-value");
    const assignmentId = e.currentTarget.getAttribute("data-assignment");
    const index = list.findIndex((s) => s.studentId == studentId);

    let currentStudent = list[index];
    currentStudent.detailPoints.find((d) => d.id === +assignmentId).point =
      newPoint;
    list = [...list.slice(0, index), currentStudent, ...list.slice(index + 1)];
    setStudentList(list);
    let newPointUpdated = [...pointUpdated];
    const currentIndex = newPointUpdated.findIndex(
      (x) =>
        x.studentId === currentStudent.studentId &&
        x.assignmentId === assignmentId
    );
    let currentPoint = {
      point: newPoint === "" ? null : newPoint,
      studentId: currentStudent.studentId,
      assignmentId: assignmentId,
    };
    if (currentIndex >= 0) newPointUpdated[currentIndex] = currentPoint;
    else newPointUpdated.push(currentPoint);
    setPointUpdated(newPointUpdated);

    // setTimeout(
    //   updatePoints(
    //     classroom.id,
    //     newPoint,
    //     assignmentId,
    //     currentStudent.studentId
    //   ),
    //   3000
    // );
  };

  const updatePoints = (classroomId, updatePointsDto) => {
    axios
      .post(
        `${API_URL}/student-to-assignment/many/${classroomId}`,
        updatePointsDto,
        authHeader()
      )
      .then((res) => {
        setReload(!reload);
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
  const handleChangeFile = (e) => {
    const uploadLink = e.currentTarget.getAttribute("link");
    let formData = new FormData();
    let file = e.target.files[0];
    formData.append("file", file);
    axios
      .post(uploadLink, formData, authHeader())
      .then((res) => {
        document.getElementById(e.target.id).value = "";
        setReload(!reload);
        toast.success("Cập nhật thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error("Định dạng file không hợp lệ", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (err.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
        console.log("Error", err);
      });
  };

  const handleChangeSelect = (e) => {
    console.log("e.target.value", e.target.value);

    const assignmentId = +e.currentTarget.getAttribute("data-value");
    let newCards = [...cards];
    newCards.find((x) => x.id === assignmentId).isPublic = e.target.value;
    setCards(newCards);
    axios
      .patch(
        `${API_URL}/point-structure/status/${assignmentId}`,
        { status: e.target.value === "true" ? true : false },
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
  };
  /***************** Handle upload file*********************/
  const handleUploadFile = (e) => {
    e.preventDefault();
    const assignmentId = e.currentTarget.getAttribute("data-value");

    document
      .getElementById(`uploadFile_${assignmentId ? assignmentId : 0}`)
      .click();
  };
  const handleTooltipClick = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <div className="curriculum-section">
        <div className="row">
          <div className="col-md-12">
            <div className="my_courses_tabs">
              <ul
                className="nav nav-pills my_crse_nav"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="pills-my-courses-tab"
                    data-toggle="pill"
                    href="#pills-my-courses"
                    role="tab"
                    aria-controls="pills-my-courses"
                    aria-selected="true"
                  >
                    <i className="uil uil-book-alt" />
                    Bảng điểm chi tiết
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="pill"
                    href="#download-template"
                    role="tab"
                    aria-controls="pills-my-purchases"
                    aria-selected="false"
                  >
                    <i className="uil uil-download-alt" />
                    Tải về template/ Xuất bảng điểm
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="pill"
                    href="#upload-detail-file"
                    role="tab"
                    aria-controls="pills-upcoming-courses"
                    aria-selected="false"
                  >
                    <i className="uil uil-upload-alt" />
                    Tải lên file
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-my-courses"
                  role="tabpanel"
                >
                  <div className="table-responsive mt-30">
                    <table className="table ucp-table">
                      <thead className="thead-s">
                        <tr>
                          <th className="text-center" scope="col">
                            STT
                          </th>
                          <th>MSSV</th>
                          <th>Họ và tên</th>
                          {cards &&
                            cards.map((card) => (
                              <th key={card.id}>
                                {card.title}
                                <select
                                  value={card.isPublic}
                                  onChange={handleChangeSelect}
                                  data-value={card.id}
                                >
                                  <option value={true}>Điểm công khai</option>
                                  <option value={false}>Điểm riêng tư</option>
                                </select>
                              </th>
                            ))}
                          <th className="text-center" scope="col">
                            Tổng kết
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentList.map((student, index) => (
                          <tr key={index}>
                            <td>{"00" + (index + 1)}</td>
                            <td>{student.studentId}</td>
                            {student.mapStudent ? (
                              <td>
                                <a
                                  href="/"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title={student.email}
                                  onClick={handleTooltipClick}
                                >
                                  {student.studentName}
                                </a>
                              </td>
                            ) : (
                              <td>{student.studentName}</td>
                            )}

                            {student.detailPoints.map((obj) => (
                              <td key={obj.id}>
                                <input
                                  className="point-input col-md-offset-5 col-md-5"
                                  type="text"
                                  pattern="[0-9]*"
                                  name="detailPoint"
                                  value={obj.point == null ? "" : obj.point}
                                  data-value={student.studentId}
                                  data-assignment={obj.id}
                                  onKeyPress={onKeyPress}
                                  onChange={handleUpdatePoints}
                                />
                                / 10
                              </td>
                            ))}

                            <td>
                              <b className="text-active">
                                {student.finalPoint}
                              </b>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="download-template"
                  role="tabpanel"
                >
                  <div className="table-responsive mt-30">
                    <table className="table ucp-table">
                      <thead className="thead-s">
                        <tr>
                          <th className="text-center" scope="col">
                            STT
                          </th>
                          <th className="cell-ta" scope="col">
                            Tên file
                          </th>

                          <th className="text-ta" scope="col">
                            Mô tả chi tiết
                          </th>
                          <th className="text-center" scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">001</td>
                          <td className="cell-ta">StudentListTemplate.xlsx</td>

                          <td className="text-ta">
                            Template để nhập danh sách sinh viên lớp học
                          </td>
                          <td className="text-center">
                            <a
                              href="/"
                              title="Download"
                              className="text-active"
                              onClick={downloadStudentsTemplate}
                            >
                              Tải về
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center">002</td>
                          <td className="cell-ta">MarkTemplate.xlsx</td>

                          <td className="text-ta">
                            Template để nhập bảng điểm lớp học
                          </td>
                          <td className="text-center">
                            <a
                              href="/"
                              title="Download"
                              className="text-active"
                              onClick={downloadMarkTemplate}
                            >
                              Tải về
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center">001</td>
                          <td className="cell-ta">FinalPoint.xlsx</td>

                          <td className="text-ta">
                            Xuất bảng điểm chi tiết lớp học
                          </td>
                          <td className="text-center">
                            <a
                              href="/"
                              title="Download"
                              className="text-active"
                              onClick={exportFinalFile}
                            >
                              Tải về
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="upload-detail-file"
                  role="tabpanel"
                >
                  <div className="table-responsive mt-30">
                    <table className="table ucp-table">
                      <thead className="thead-s">
                        <tr>
                          <th className="text-center" scope="col">
                            STT
                          </th>
                          <th className="cell-ta">Tên file</th>

                          <th className="text-center" scope="col">
                            Trạng thái
                          </th>
                          <th className="text-center" scope="col">
                            Upload
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {canUploadStudents && (
                          <tr>
                            <td className="text-center">001</td>
                            <td className="cell-ta">Danh sách sinh viên</td>

                            <td className="text-center">
                              <b className="text-active">
                                {classroom && classroom.studentsFile
                                  ? "Đã cập nhật file"
                                  : "Chưa upload file"}
                              </b>
                            </td>
                            <td className="text-center">
                              <input
                                id="uploadFile_0"
                                type="file"
                                name="file"
                                style={{ display: "none" }}
                                link={`${API_URL}/file/studentList/${
                                  classroom && classroom.id
                                }`}
                                onChange={handleChangeFile}
                              />
                              <a
                                href="/"
                                title="Edit"
                                className="gray-s"
                                onClick={handleUploadFile}
                              >
                                <i className="uil uil-upload-alt" />
                              </a>
                              {/* <a
                                                href="/"
                                                title="Delete"
                                                className="gray-s"
                                                onClick={handleDeleteFile}
                                                link={`${API_URL}/file/studentList`}
                                              >
                                                <i className="uil uil-trash-alt" />
                                              </a> */}
                            </td>
                          </tr>
                        )}
                        {cards &&
                          cards.map((card, index) => (
                            <tr key={index}>
                              <td className="text-center">
                                <input
                                  id={`uploadFile_${card.id}`}
                                  type="file"
                                  name="file"
                                  style={{ display: "none" }}
                                  link={`${API_URL}/file/mark/${classroom.id}/${card.id}`}
                                  onChange={handleChangeFile}
                                />
                                {!canUploadStudents && "00" + (index + 1)}
                                {canUploadStudents && "00" + (index + 2)}
                              </td>
                              <td className="cell-ta">Điểm {card.title}</td>

                              <td className="text-center">
                                <b className="text-active">
                                  {card.markFile
                                    ? "Đã cập nhật file"
                                    : "Chưa upload file"}
                                </b>
                              </td>
                              <td className="text-center">
                                <a
                                  href="/"
                                  title="Edit"
                                  className="gray-s"
                                  onClick={handleUploadFile}
                                  data-value={card.id}
                                >
                                  <i className="uil uil-upload-alt" />
                                </a>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagePoints;
