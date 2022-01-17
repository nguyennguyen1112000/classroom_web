import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";
function Register() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [input, setInput] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({
    email: null,
    password: null,
    firstName: null,
    lastName: null,
  });
  const search = useLocation().search;
  const redirectTo = new URLSearchParams(search).get("redirectTo");
  let history = useHistory();
  function handleChange(event) {
    switch (event.target.name) {
      case "email":
        setInput({
          ...input,
          email: event.target.value,
        });
        break;
      case "password":
        setInput({
          ...input,
          password: event.target.value,
        });
        break;
      case "firstName":
        setInput({
          ...input,
          firstName: event.target.value,
        });
        break;
      default:
        setInput({
          ...input,
          lastName: event.target.value,
        });
        break;
    }
  }
  function validate() {
    let isValid = true;
    var errs = {};
    if (!input.email) {
      isValid = false;
      errs.email = "Email không được để trống";
    }

    if (input.email) {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(input["email"])) {
        isValid = false;
        errs.email = "Địa chỉ email không hợp lệ";
      }
    }

    if (!input.password) {
      isValid = false;
      errs.password = "Password không được để trống";
    }

    if (input.password) {
      if (input.password.length < 6) {
        isValid = false;
        errs.password = "Phải chứa ít nhất 6 kí tự";
      }
    }

    if (!input.firstName) {
      isValid = false;
      errs.firstName = "Họ và tên lót không được để trống";
    }

    if (!input.lastName) {
      isValid = false;
      errs.lastName = "Tên không được để trống";
    }

    setErrors(errs);

    return isValid;
  }
  function handleSubmit(event) {
    event.preventDefault();

    if (validate()) {
      axios
        .post(`${API_URL}/users`, input)
        .then((res) => {
          console.log("Register successfully", res);
          history.push("/verify");
          //login(input.email, input.password);
          let newInput = {};
          newInput.email = "";
          newInput.password = "";
          newInput.firstName = "";
          newInput.lastName = "";
          setInput(newInput);
        })
        .catch((err) => {
          if (err.response.data.message)
            setErrors({ email: err.response.data.message });
        });
    }
  }

  return (
    <div className="sign_in_up_bg">
      <div className="container">
        <div className="row justify-content-lg-center justify-content-md-center">
          <div className="col-lg-12">
            <div className="main_logo25" id="logo">
              <a href="index.html">
                <img src="/images/logo.png" alt="" />
              </a>
              <a href="index.html">
                <img className="logo-inverse" src="images/ct_logo.svg" alt="" />
              </a>
            </div>
          </div>
          <div className="col-lg-6 col-md-8">
            <div className="sign_form">
              <h2>Chào mừng bạn đến với Classroom</h2>
              <p>Đăng ký và bắt đầu học nào!!</p>
              <form onSubmit={handleSubmit}>
                {errors.email && (
                  <div
                    className="alert bg-danger text-white px-4 py-2 mt-10"
                    role="alert"
                  >
                    {errors.email}
                  </div>
                )}

                <div className="ui search focus mt-15">
                  <div className="ui left icon input swdh95">
                    <input
                      className="prompt srch_explore"
                      name="email"
                      id="id_email"
                      value={input.email}
                      placeholder="Địa chỉ email"
                      onChange={handleChange}
                    />
                    <i className="uil uil-envelope icon icon2" />
                  </div>
                </div>
                {errors.password && (
                  <div
                    className="alert bg-danger text-white px-4 py-2 mt-10"
                    role="alert"
                  >
                    {errors.password}
                  </div>
                )}
                <div className="ui search focus mt-15">
                  <div className="ui left icon input swdh95">
                    <input
                      className="prompt srch_explore"
                      type="password"
                      name="password"
                      value={input.password}
                      id="id_password"
                      placeholder="Mật khẩu"
                      onChange={handleChange}
                    />
                    <i className="uil uil-key-skeleton-alt icon icon2" />
                  </div>
                </div>

                {errors.firstName && (
                  <div
                    className="alert bg-danger text-white px-4 py-2 mt-10"
                    role="alert"
                  >
                    {errors.firstName}
                  </div>
                )}
                <div className="ui search focus mt-15">
                  <div className="ui left icon input swdh95">
                    <input
                      className="prompt srch_explore"
                      type="text"
                      name="firstName"
                      value={input.firstName}
                      id="id_firstName"
                      placeholder="Họ và tên lót"
                      onChange={handleChange}
                    />
                    <i className="uil uil-user icon icon2" />
                  </div>
                </div>

                {errors.lastName && (
                  <div
                    className="alert bg-danger text-white px-4 py-2 mt-10"
                    role="alert"
                  >
                    {errors.lastName}
                  </div>
                )}
                <div className="ui search focus mt-15">
                  <div className="ui left icon input swdh95">
                    <input
                      className="prompt srch_explore"
                      type="text"
                      name="lastName"
                      value={input.lastName}
                      id="id_lastname"
                      placeholder="Tên"
                      onChange={handleChange}
                    />
                    <i className="uil uil-user icon icon2" />
                  </div>
                </div>

                <button className="login-btn" type="submit">
                  Đăng ký
                </button>
              </form>
              {!redirectTo && (
                <p className="mb-0 mt-30">
                  Bạn đã có tài khoản? <Link to="/signin">Đăng nhập</Link>
                </p>
              )}
              {redirectTo && (
                <p className="mb-0 mt-30">
                  Bạn đã có tài khoản?{" "}
                  <Link to={`/signin?redirectTo=${redirectTo}`}>Đăng nhập</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
