import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../services/api/class";
import ClassItem from "../../components/class-item";
import { Link } from "react-router-dom";
import CreateClass from "./create";

function ClassList() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);
  const classList = useSelector((state) => state.class.classList);


  return (
    <div className="wrapper">
      <div className="sa4d25">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12 col-lg-8">
              <div className="section3125">
                <div className="explore_search">
                  <div className="ui search focus">
                    <div className="ui left icon input swdh11">
                      <input
                        className="prompt srch_explore"
                        type="text"
                        placeholder="Tìm kiếm lớp học..."
                      />
                      <i className="uil uil-search-alt icon icon2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="_14d25">
                <div className="row">
                  {classList.map((obj) => {
                    return (
                      <ClassItem
                        key={obj.id}
                        id={obj.id}
                        name={obj.name}
                        topic={obj.topic}
                      />
                    );
                  })}
                  {classList.length === 0 && (
                    <div className="verification_content">
                      <img src="images/verified-account.svg" alt="" />
                      <h4>Chưa có lớp học nào</h4>
                      <p>
                        Bấm nút <strong>Tạo lớp học</strong> ở góc phải màn
                        hình, để thêm một lớp học mới.
                      </p>
                    </div>
                  )}

                  <div className="col-md-12">
                    <div className="main-loader mt-50">
                      <div className="spinner">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateClass />
      <footer className="footer mt-30">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-3 col-sm-6">
              <div className="item_f1">
                <Link to="/">About</Link>
                <Link to="/">Blog</Link>
                <Link to="/">Careers</Link>
                <Link to="/">Press</Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-3 col-sm-6">
              <div className="item_f1">
                <Link to="/">Help</Link>
                <Link to="/">Advertise</Link>
                <Link to="/">Developers</Link>
                <Link to="/">Contact Us</Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-3 col-sm-6">
              <div className="item_f1">
                <Link to="/">Copyright Policy</Link>
                <Link to="/">Terms</Link>
                <Link to="/">Privacy Policy</Link>
                <Link to="/">Sitemap</Link>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="footer_bottm">
                <div className="row">
                  <div className="col-md-6">
                    <ul className="fotb_left">
                      <li>
                        <Link to="/">
                          <div className="footer_logo">
                            <img src="images/logo.png" alt="" />
                          </div>
                        </Link>
                      </li>
                      <li>
                        <p>
                          © 2021 <strong>Classroom</strong>. All Rights
                          Reserved.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <div className="edu_social_links">
                      <Link to="/">
                        <i className="fab fa-facebook-f" />
                      </Link>
                      <Link to="/">
                        <i className="fab fa-twitter" />
                      </Link>
                      <Link to="/">
                        <i className="fab fa-google-plus-g" />
                      </Link>
                      <Link to="/">
                        <i className="fab fa-linkedin-in" />
                      </Link>
                      <Link to="/">
                        <i className="fab fa-instagram" />
                      </Link>
                      <Link to="/">
                        <i className="fab fa-youtube" />
                      </Link>
                      <Link to="/">
                        <i className="fab fa-pinterest-p" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ClassList;
