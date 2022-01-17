import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../actions/auth";
import Footer from "../../components/footer";
import { authHeader, logOut, findDaysDifferent } from "../../helper/utils";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.currentUser);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const result = await axios.get(
          `${API_URL}/notifications`,
          authHeader()
        );
        if (result.data) {
          setNotifications(result.data);
          if (user)
            await axios.post(
              `${API_URL}/notifications/viewed`,
              {
                userId: user.id,
                notificationIds: result.data.map((x) => {
                  return x.id;
                }),
              },
              authHeader()
            );
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
  }, [user]);
  console.log("notification", notifications);

  return (
    <div className="wrapper">
      <div className="sa4d25">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="st_title">
                <i className="uil uil-bell" /> Thông báo
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="all_msg_bg">
                {/* <div className="channel_my item all__noti5">
                  <div className="profile_link">
                    <img src="/images/left-imgs/user.png" alt="av" />
                    <div className="pd_content">
                      <h6>Nguyễn Bình Nguyên</h6>
                      <p className="noti__text5">
                        Đã công khai điểm <strong>Bài tập cá nhân</strong>.
                      </p>
                      <span className="nm_time">2 giờ trước</span>
                    </div>
                  </div>
                </div>
                <div className="channel_my item all__noti5">
                  <div className="profile_link">
                    <img src="/images/left-imgs/user.png" alt="av" />
                    <div className="pd_content">
                      <h6>Nguyễn Bình Nguyên</h6>
                      <p className="noti__text5">
                        Đã phản hồi phúc khảo <strong>Bài tập cá nhân</strong>.
                      </p>
                      <span className="nm_time">2 giờ trước</span>
                    </div>
                  </div>
                </div>
                <div className="channel_my item all__noti5">
                  <div className="profile_link">
                    <img src="/images/left-imgs/user.png" alt="av" />
                    <div className="pd_content">
                      <h6>Nguyễn Bình Nguyên</h6>
                      <p className="noti__text5">
                        Đã đóng phúc khảo<strong>Bài tập cá nhân</strong>.
                      </p>
                      <span className="nm_time">2 giờ trước</span>
                    </div>
                  </div>
                </div> */}
                {notifications &&
                  notifications.map((noti) => (
                    <div className="channel_my item all__noti5">
                      <div className="profile_link">
                        <img src="/images/left-imgs/user.png" alt="av" />
                        <div className="pd_content">
                          <h6>
                            {noti.created_by.firstName +
                              " " +
                              noti.created_by.lastName}
                          </h6>
                          <p className="noti__text5">{noti.message}</p>
                          <span className="nm_time">
                            {findDaysDifferent(noti.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                {notifications.length === 0 && "Không có thông báo mới nào"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Notifications;
