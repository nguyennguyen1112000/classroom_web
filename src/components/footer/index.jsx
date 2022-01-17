import React from "react";
import { Link } from "react-router-dom";
import CreateClass from "../../views/classes/create";

function Footer() {
  return (
    <footer className="footer mt-40">
      <CreateClass />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="footer_bottm">
              <div className="row">
                <div className="col-md-6">
                  <ul className="fotb_left">
                    <li>
                      <a href="/">
                        <div className="footer_logo">
                          <img src="/images/logo.png" alt="logo" />
                        </div>
                      </a>
                    </li>
                    <li>
                      <p>
                        ©2022 <strong>Online classroom</strong>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
