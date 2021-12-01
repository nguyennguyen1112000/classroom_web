import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userLoginSuccess } from "../../actions/auth";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
function Login() {
  const API_URL = process.env.REACT_APP_API_URL;
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();
  let location = useLocation();
  let history = useHistory();
  const search = location.search;
  const redirectTo = new URLSearchParams(search).get("redirectTo");

  const responseGoogle = (response) => {
    if (response.profileObj) {
      const { email, googleId, familyName, givenName } = response.profileObj;
      const input = {
        email,
        googleId,
        firstName: familyName,
        lastName: givenName,
      };
      axios
        .post(`${API_URL}/google`, input)
        .then((res) => {
          const { access_token, user } = res.data;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", JSON.stringify(access_token));
          const action = userLoginSuccess(user);
          dispatch(action);
          setRedirect(true);
        })
        .catch((err) => {
          console.log("Error", err);
          setError("Đã có lỗi xảy ra trong lúc đăng nhập, vui lòng thử lại");
        });
    }
  };

  function handleChange(event) {
    if (event.target.name === "email") {
      setInput({
        ...input,
        email: event.target.value,
      });
    } else {
      setInput({
        ...input,
        password: event.target.value,
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (input.email === "" && input.password === "") {
      setError("Please enter your email and password");
      return;
    }
    axios
      .post(`${API_URL}/auth/login`, input)
      .then((res) => {
        const { access_token, user } = res.data;        
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", JSON.stringify(access_token));
        const action = userLoginSuccess(user);
        dispatch(action);
        let newInput = {};
        newInput.email = "";
        newInput.password = "";
        setInput(newInput);
        setRedirect(true);
      })
      .catch((err) => {
        setError("Email hoặc mật khẩu không chính xác");
      });
  }

  if (redirect) {
    history.push(redirectTo == null ? "/" : redirectTo);
  }
  return (
    <div className="sign_in_up_bg">
      <div className="container">
        <div className="row justify-content-lg-center justify-content-md-center">
          <div className="col-lg-12">
            <div className="main_logo25" id="logo">
              <a href="index.html">
                <img src="images/logo.png" alt="" />
              </a>
              <a href="index.html">
                <img className="logo-inverse" src="images/ct_logo.svg" alt="" />
              </a>
            </div>
          </div>
          <div className="col-lg-6 col-md-8">
            <div className="sign_form">
              <h2>Chào mừng bạn quay lại</h2>
              <p>Đăng nhập vào tài khoản Classroom!</p>
              <GoogleLogin
                clientId={CLIENT_ID}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="social_lnk_btn mt-15 color_btn_go"
                  >
                    <i className="uil uil-google" />
                    Continue with Google
                  </button>
                )}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />

              <form onSubmit={handleSubmit}>
                {error && (
                  <div
                    className="alert bg-danger text-white px-4 py-2 mt-10"
                    role="alert"
                  >
                    {error}
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

                <button className="login-btn" type="submit">
                  Đăng nhập
                </button>
              </form>
              <p className="sgntrm145">
                Hoặc <a href="/">Quên mật khẩu</a>.
              </p>
              {redirectTo && (
                <p className="mb-0 mt-30 hvsng145">
                  Bạn chưa có tài khoản?{" "}
                  <Link to={`/signup?redirectTo=${redirectTo}`}>Đăng ký</Link>
                </p>
              )}
              {!redirectTo && (
                <p className="mb-0 mt-30 hvsng145">
                  Bạn chưa có tài khoản?{" "}
                  <Link to="/signup">Đăng ký</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
