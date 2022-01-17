import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { userLoginSuccess } from "../../actions/auth";

function VerifyAccount() {
  const search = useLocation().search;
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    let token = new URLSearchParams(search).get("token");

    const fetchData = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        console.log({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        axios
          .post(
            `${API_URL}/auth/verify`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
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
          });
      } catch (error) {
        console.log("err", error);
      }
    };
    fetchData();
  }, []);

  if (redirect) {
    history.push("/");
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
              <h2>
                Chúng tôi đã gửi 1 email xác nhận đến email mà bạn đã cung cấp
              </h2>
              <p>Xác thực Email để tham gia ngay</p>
              <Link to={"/signIn"}>Quay lại trang Đăng nhập</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default VerifyAccount;
