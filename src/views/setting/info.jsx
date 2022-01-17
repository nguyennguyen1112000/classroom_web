import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {  useParams } from "react-router";
import { userLogout } from "../../actions/auth";
import Footer from "../../components/footer";
import { authHeader, logOut } from "../../helper/utils";

function Info() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${API_URL}/users/${id}`, authHeader());
        if (result.data) {
          setUser(result.data);
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
  }, []);
  console.log("user", user);

  function formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  if (user)
    return (
      <div className="wrapper _bg4586">
        <div className="_216b01">
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-md-10">
                <div className="section3125 rpt145">
                  <div className="row">
                    <div className="col-lg-7">
                      <div className="dp_dt150">
                        <div className="img148">
                          <img
                            src={
                              user.imageUrl
                                ? user.imageUrl
                                : "/images/left-imgs/user.png"
                            }
                            alt="avatar"
                          />
                        </div>
                        <div className="prfledt1">
                          <h2>{user.firstName + " " + user.lastName}</h2>
                          <span>{user.studentId}</span>
                        </div>
                      </div>
                      <ul className="_ttl120">
                        <li>
                          <div className="_ttl121">
                            <div className="_ttl122">Ngày sinh</div>
                            <div className="_ttl123">
                              {formatDate(new Date(user.birthday))}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="_ttl121">
                            <div className="_ttl122">Giới tính</div>
                            <div className="_ttl123">
                              {user.sex ? "Nam" : "Nữ"}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="_ttl121">
                            <div className="_ttl122">Email</div>
                            <div className="_ttl123">{user.email}</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
    else return (<div></div>)
}

export default Info;
