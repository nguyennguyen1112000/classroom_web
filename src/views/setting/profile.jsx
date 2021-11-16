import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import axios from "axios";
import Footer from "../../components/footer";

Setting.propTypes = {};

function Setting(props) {
  const API_URL = process.env.REACT_APP_API_URL;
  const user = useSelector((state) => state.auth.currentUser);
  console.log("user", user);

  const [input, setInput] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
  });

  function handleChange(event) {    
    switch (event.target.name) {
      case "firstName":
        setInput({
          ...input,
          firstName: event.target.value,
        });
        break;
      case "lastName":
        setInput({
          ...input,
          lastName: event.target.value,
        });
        break;
      default:
        setInput({
          ...input,
          role: event.target.value,
        });
        break;
    }
  }
  function validate() {
    let isValid = true;
    var errs = {};
    if (!input.firstName) {
      isValid = false;
      errs.firstName = "Họ và tên lót không được để trống";
    }

    if (input.firstName.length > 64) {
      isValid = false;
      errs.firstName = "Nhập tối đa 64 kí tự";
    }

    if (!input.lastName) {
      isValid = false;
      errs.lastName = "Tên không được để trống";
    }

    if (input.firstName.length > 64) {
      isValid = false;
      errs.lastName = "Nhập tối đa 64 kí tự";
    }



    setErrors(errs);

    return isValid;
  }
  function handleSubmit(event) {
    event.preventDefault();

    if (validate()) {
      console.log('input', input.role=="student");
      
      // axios
      //   .patch(`${API_URL}/users`, input)
      //   .then((res) => {
      //     console.log("Update profile successfully", res);
          
      //     // let newInput = {};
      //     // newInput.firstName = "";
      //     // newInput.lastName = "";
      //     // setInput(newInput);
      //   })
      //   .catch((err) => {
      //     console.log('Update profile failed',err.message);
          
      //   });
    }
  }
  return (
    <div className="wrapper">
      <div className="sa4d25">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="st_title">
                <i className="uil uil-cog" /> Cài đặt
              </h2>
              <div className="setting_tabs">
                <ul
                  className="nav nav-pills mb-4"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      id="pills-account-tab"
                      data-toggle="pill"
                      href="#pills-account"
                      role="tab"
                      aria-selected="true"
                    >
                      Tài khoản
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      id="pills-notification-tab"
                      data-toggle="pill"
                      href="#pills-notification"
                      role="tab"
                      aria-selected="false"
                    >
                      Đổi mật khẩu
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      id="pills-closeaccount-tab"
                      data-toggle="pill"
                      href="#pills-closeaccount"
                      role="tab"
                      aria-selected="false"
                    >
                      Xóa tài khoản
                    </a>
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-account"
                  role="tabpanel"
                  aria-labelledby="pills-account-tab"
                >
                  <div className="account_setting">
                    <h4>
                      Xin chào {user.firstName} {user.lastName}
                    </h4>
                    <div className="basic_profile">
                      <div className="basic_ptitle">
                        <h4>Thông tin cơ bản</h4>
                        <p>Thêm thông tin cá nhân của bạn</p>
                      </div>
                      <div className="basic_form">
                        <div className="row">
                          <div className="col-lg-8">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="ui search focus mt-30">
                                  <div className="ui left icon input swdh11 swdh19">
                                    <input
                                      className="prompt srch_explore"
                                      type="text"
                                      name="firstName"
                                      defaultValue={user.firstName}
                                      id="id[name]"
                                      placeholder="Họ và tên lót"
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="ui search focus mt-30">
                                  <div className="ui left icon input swdh11 swdh19">
                                    <input
                                      className="prompt srch_explore"
                                      type="text"
                                      name="surname"
                                      defaultValue={user.lastName}
                                      id="id[surname]"
                                      placeholder="Tên"
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-10">
                          <div className="col-lg-8">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="basic_ptitle">
                                  <h4>Email của bạn</h4>
                                </div>
                                <div className="ui search focus mt-30">
                                  <div className="ui left icon labeled input swdh11 swdh31">
                                    <div className="ui label lb12">@</div>
                                    <input
                                      className="prompt srch_explore"
                                      type="text"
                                      name="email"
                                      id="id_email"
                                      required
                                      defaultValue={user.email}
                                      placeholder="Email"
                                      disabled
                                    />
                                  </div>
                                  <div className="help-block">
                                    Tài khoản email của bạn
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button className="save_btn" onClick={handleSubmit}>
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-notification"
                  role="tabpanel"
                  aria-labelledby="pills-notification-tab"
                >
                  <div className="account_setting">
                    <h4>Notifications - Choose when and how to be notified</h4>
                    <p>
                      Select push and email notifications you'd like to receive
                    </p>
                    <div className="basic_profile">
                      <div className="basic_form">
                        <div className="nstting_content">
                          <div className="basic_ptitle">
                            <h4>Choose when and how to be notified</h4>
                          </div>
                          <div className="ui toggle checkbox _1457s2">
                            <input
                              type="checkbox"
                              name="stream_ss1"
                              defaultChecked
                            />
                            <label>Subscriptions</label>
                            <p className="ml5">
                              Notify me about activity from the profiles I'm
                              subscribed to
                            </p>
                          </div>
                          <div className="ui toggle checkbox _1457s2">
                            <input type="checkbox" name="stream_ss2" />
                            <label>Recommended Courses</label>
                            <p className="ml5">
                              Notify me of courses I might like based on what I
                              watch
                            </p>
                          </div>
                          <div className="ui toggle checkbox _1457s2">
                            <input type="checkbox" name="stream_ss3" />
                            <label>Activity on my comments</label>
                            <p className="ml5">
                              Notify me about activity on my comments on others’
                              courses
                            </p>
                          </div>
                          <div className="ui toggle checkbox _1457s2">
                            <input
                              type="checkbox"
                              name="stream_ss4"
                              defaultChecked
                            />
                            <label>Replies to my comments</label>
                            <p className="ml5">
                              Notify me about replies to my comments
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="divider-1 mb-50" />
                    <div className="basic_profile">
                      <div className="basic_form">
                        <div className="nstting_content">
                          <div className="basic_ptitle">
                            <h4>Email notifications</h4>
                            <p>
                              Your emails are sent to{" "}
                              <a
                                href="https://gambolthemes.net/cdn-cgi/l/email-protection"
                                className="__cf_email__"
                                data-cfemail="f691979b94999acfc2c5b6919b979f9ad895999bd8"
                              >
                                [email&nbsp;protected]
                              </a>{" "}
                              To unsubscribe from an email, click the
                              "Unsubscribe" link at the bottom of it.{" "}
                              <a href="/">Learn more</a> about emails from
                              Edututs+.
                            </p>
                          </div>
                          <div className="ui toggle checkbox _1457s2">
                            <input
                              type="checkbox"
                              name="stream_ss5"
                              defaultChecked
                            />
                            <label>
                              Send me emails about my Cursus activity and
                              updates I requested
                            </label>
                            <p className="ml5">
                              If this setting is turned off, Cursus may still
                              send you messages regarding your account, required
                              service announcements, legal notifications, and
                              privacy matters
                            </p>
                          </div>
                          <div className="ui toggle checkbox _1457s2">
                            <input type="checkbox" name="stream_ss6" />
                            <label>
                              Promotions, course recommendations, and helpful
                              resources from Cursus.
                            </label>
                          </div>
                          <div className="ui toggle checkbox _1457s2">
                            <input type="checkbox" name="stream_ss7" />
                            <label>
                              Announcements from instructors whose course(s) I’m
                              enrolled in.
                            </label>
                            <p className="ml5">
                              To adjust this preference by course, leave this
                              box checked and go to the course dashboard and
                              click on "Options" to opt in or out of specific
                              announcements.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="save_btn" type="submit">
                      Save Changes
                    </button>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-closeaccount"
                  role="tabpanel"
                  aria-labelledby="pills-closeaccount-tab"
                >
                  <div className="account_setting">
                    <h4>Close account</h4>
                    <p>
                      <strong>Warning:</strong> If you close your account, you
                      will be unsubscribed from all your 5 courses, and will
                      lose access forever.
                    </p>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="ui search focus mt-30">
                        <div className="ui left icon input swdh11 swdh19">
                          <input
                            className="prompt srch_explore"
                            type="password"
                            name="yourassword"
                            id="id_yourpassword"
                            required
                            maxLength={64}
                            placeholder="Enter Your Password"
                          />
                        </div>
                        <div className="help-block">
                          Are you sure you want to close your account?
                        </div>
                      </div>
                      <button className="save_payout_btn mbs20" type="submit">
                        Close Account
                      </button>
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

export default Setting;
