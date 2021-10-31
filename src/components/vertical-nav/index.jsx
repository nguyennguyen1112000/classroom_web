import React from 'react';
//import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// VerticalNav.propTypes = {
    
// };

function VerticalNav(props) {
    return (
      <nav className="vertical_nav">
        <div className="left_section menu_left" id="js-menu">
          <div className="left_section">
            <ul>
              <li className="menu--item">
                <Link to="/" className="menu--link" title="Home">
                  <i className="uil uil-home-alt menu--icon" />
                  <span className="menu--label">Trang chủ</span>
                </Link>
              </li>
              <li className="menu--item">
                <Link
                  to="/"
                  className="menu--link"
                  title="Live Streams"
                >
                  <i className="uil uil-kayak menu--icon" />
                  <span className="menu--label">Danh sách sinh viên</span>
                </Link>
              </li>
              <li className="menu--item">
                <Link to="/" className="menu--link" title="Explore">
                  <i className="uil uil-search menu--icon" />
                  <span className="menu--label">Tham gia lớp học</span>
                </Link>
              </li>
              <li className="menu--item menu--item">
                <label className="menu--link" title="Categories">
                  <i className="uil uil-layers menu--icon" />
                  <span className="menu--label">Danh sách lớp học</span>
                </label>
              </li>
              <li className="menu--item">
                <label className="menu--link" title="Tests">
                  <i className="uil uil-clipboard-alt menu--icon" />
                  <span className="menu--label">Tạo bài tập</span>
                </label>
              </li>
              <li className="menu--item">
                <Link
                  to="/"
                  className="menu--link"
                  title="Saved Courses"
                >
                  <i className="uil uil-heart-alt menu--icon" />
                  <span className="menu--label">Chia sẻ lớp học</span>
                </Link>
              </li>
              <li className="menu--item  menu--item__has_sub_menu">
                <label className="menu--link" title="Pages">
                  <i className="uil uil-file menu--icon" />
                  <span className="menu--label">Điểm số</span>
                </label>
                <ul className="sub_menu">
                  <li className="sub_menu--item">
                    <Link to="/" className="sub_menu--link">
                      Phân chia điểm bài tập
                    </Link>
                  </li>
                  <li className="sub_menu--item">
                    <Link to="/" className="sub_menu--link">
                      Nhập điểm
                    </Link>
                  </li>
                  <li className="sub_menu--item">
                    <Link to="/" className="sub_menu--link">
                      Xem báo cáo điểm
                    </Link>
                  </li>
                 
                </ul>
              </li>
            </ul>
          </div>
          <div className="left_section">
            <h6 className="left_title">Lớp học đã tham gia</h6>
            <ul>
              <li className="menu--item">
                <Link
                  to="/"
                  className="menu--link user_img"
                >
                  <img src="images/courses/img-1.jpg" alt="" />
                  Lập trình Python
                  <div className="alrt_dot" />
                </Link>
              </li>
              <li className="menu--item">
                <Link
                  to="/"
                  className="menu--link user_img"
                >
                  <img src="images/courses/img-2.jpg" alt="" />
                  Toán tổ hợp
                </Link>
                <div className="alrt_dot" />
              </li>
            </ul>
          </div>
          <div className="left_section pt-2">
            <ul>
              <li className="menu--item">
                <Link to="/" className="menu--link" title="Setting">
                  <i className="uil uil-cog menu--icon" />
                  <span className="menu--label">Cài đặt</span>
                </Link>
              </li>
              <li className="menu--item">
                <Link to="/" className="menu--link" title="Help">
                  <i className="uil uil-question-circle menu--icon" />
                  <span className="menu--label">Đăng xuất</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </nav>
    );
}

export default VerticalNav;