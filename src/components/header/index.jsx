import React from "react";
import { Link } from "react-router-dom";

function Header(props) {
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
          <img src="images/logo.png" alt="logo" />
        </Link>
      </div>

      <div className="search120">
        <div className="ui search">
          <div className="ui left icon input swdh10">
            <input
              className="prompt srch10"
              type="text"
              placeholder="Tìm kiếm lớp học, ..."
            />
            <i className="uil uil-search-alt icon icon1" />
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
          <li className="ui dropdown">
            <Link to="/" className="option_links" title="Messages">
              <i className="uil uil-envelope-alt" />
              <span className="noti_count">3</span>
            </Link>
          </li>
          <li className="ui dropdown">
            <Link to="/" className="option_links" title="Notifications">
              <i className="uil uil-bell" />
              <span className="noti_count">3</span>
            </Link>
          </li>
          <li className="ui dropdown">
            <Link to="/setting" className="opts_account" title="Account">
              <img
                src={`${process.env.REACT_APP_PUBLIC_URL}/images/hd_dp.jpg`}
                alt="avatar"
              />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
