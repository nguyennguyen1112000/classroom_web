import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userLogout } from "../../actions/auth";
import { authHeader, logOut, findDaysDifferent } from "../../helper/utils";
function Header() {
  const user = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const result = await axios.get(
          `${API_URL}/notifications/lastest`,
          authHeader()
        );
        if (result.data) {
          setNotification(result.data);
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
  }, [dispatch]);

  const handleChangeCode = (event) => {
    setCode(event.target.value);
  };

  const handleLogout = () => {
    const action = userLogout();
    dispatch(action);
    logOut();
  };

  return (
    <header className="header clearfix">
      <button type="button" id="toggleMenu" className="toggle_menu">
        <i className="uil uil-bars" />
      </button>
      <button id="collapse_menu" className="collapse_menu">
        <i className="uil uil-bars collapse_menu--icon " />
        <span className="collapse_menu--label" />
      </button>
      <div className="main_logo" id="logo">
        <Link to="/">
          <img src="/images/logo.png" alt="logo" />
        </Link>
      </div>

      <div className="search120">
        <div className="ui search">
          <div className="ui left icon input swdh10">
            <input
              className="prompt srch10"
              type="text"
              placeholder="Nhập mã code"
              value={code}
              onChange={handleChangeCode}
            />
            <a
              className="live_link"
              style={{ display: "table-cell" }}
              href={`/classrooms/${code}`}
            >
              Tham gia
            </a>
          </div>
        </div>
      </div>
      <div className="header_right">
        <ul>
          <li>
            <button
              type="button"
              className="upload_btn"
              title="Create New Course"
              data-toggle="modal"
              data-target="#createClass"
            >
              Tạo lớp học
            </button>
          </li>

          <li className="dropdown">
            <a
              href="/"
              className="option_links"
              title="Notifications"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="uil uil-bell" />
              <span className="noti_count">
                {notification && notification.count}
              </span>
            </a>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {notification && notification.notifications.length > 0 ? (
                notification.notifications.map((noti) => (
                  <a
                    href="/notifications"
                    className="channel_my item dropdown-item"
                  >
                    <div className="profile_link">
                      <img src="/images/left-imgs/user.png" alt="" />
                      <div className="pd_content">
                        <h6>
                          {noti.created_by.firstName +
                            " " +
                            noti.created_by.lastName}
                        </h6>
                        <p>{noti.message}</p>
                        <span className="nm_time">
                          {findDaysDifferent(noti.created_at)}
                        </span>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <a href="/" className="channel_my item dropdown-item">
                  Không có thông báo mới
                </a>
              )}
              <a className="vbm_btn" href="/notifications">
                Xem tất cả <i className="uil uil-arrow-right" />
              </a>
            </div>
          </li>
          <li className="dropdown">
            <a
              href="/"
              className="option_links opts_account"
              title="Notifications"
              type="button"
              id="dropdownProfile"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              {user && user.imageUrl ? (
                <img src={user.imageUrl} alt="" />
              ) : (
                <img src="/images/left-imgs/user.png" alt="" />
              )}
            </a>
            <div className="dropdown-menu" aria-labelledby="dropdownProfile">
              <a href="/setting" className="channel_my item dropdown-item">
                <div className="profile_link">
                  <img src="/images/left-imgs/user.png" alt="" />
                  <div className="pd_content">
                    <h6>Thông tin cá nhân</h6>
                    <p>{user && user.email}</p>
                  </div>
                </div>
              </a>
              <a
                href="/"
                className="channel_my item dropdown-item"
                onClick={handleLogout}
              >
                <div>
                  <h6>
                    Đăng xuất <i className="uil uil-sign-out-alt" />
                  </h6>

                  <div className="pd_content"></div>
                </div>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
