import React from 'react';
import { useDispatch } from 'react-redux';
//import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { userLogout } from '../../actions/auth';
import {logOut} from '../../helper/utils'

// VerticalNav.propTypes = {
    
// };

function VerticalNav(props) {
  const dispatch = useDispatch();
  function handleLogout(){
    const action = userLogout();
    dispatch(action);
    logOut();
  }
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
                  to="/joined-classes"
                  className="menu--link"
                  title="Explore"
                >
                  <i className="uil uil-heart-alt menu--icon" />
                  <span className="menu--label">Lớp học đã tham gia</span>
                </Link>
              </li>
              <li className="menu--item menu--item">
                <Link
                  to="/my-classes"
                  className="menu--link"
                  title="Categories"
                >
                  <i className="uil uil-layers menu--icon" />
                  <span className="menu--label">Lớp học của tôi</span>
                </Link>
              </li>

            </ul>
          </div>

          <div className="left_section pt-2">
            <ul>
              <li className="menu--item">
                <Link to="/setting" className="menu--link" title="Setting">
                  <i className="uil uil-cog menu--icon" />
                  <span className="menu--label">Cài đặt</span>
                </Link>
              </li>
              <li className="menu--item">
                <Link
                  to="/"
                  className="menu--link"
                  title="Help"
                  onClick={handleLogout}
                >
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