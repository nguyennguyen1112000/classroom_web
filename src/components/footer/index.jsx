import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
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
    );
}

export default Footer;