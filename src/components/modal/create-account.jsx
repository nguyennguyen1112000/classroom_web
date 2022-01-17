import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { authHeader } from "../../helper/utils";

function CreateAccount({ reload }) {
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
      case "lastName":
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
    if (!input.firstName) {
      isValid = false;
      errs.firstName = "Họ và tên lót không được để trống";
    }
    if (!input.lastName) {
      isValid = false;
      errs.lastName = "Tên không được để trống";
    }
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

    setErrors(errs);
    console.log(errors);

    return isValid;
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (validate()) {
      const API_URL = process.env.REACT_APP_API_URL;
      axios
        .post(`${API_URL}/users/admin`, input, authHeader())
        .then((res) => {
          let newInput = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
          };
          setInput(newInput);
          document.getElementById("close-create-modal").click();
          reload();
        })
        .catch((err) => {
          toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  }

  return (
    <div
      className="course_tabs_1 modal fade"
      id="createAccount"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="createAccount"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="title">
              <i className="uil uil-info-circle" />
              Tạo tài khoản admin
            </h3>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              id="close-create-modal"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form
              className="course__form"
              id="form-create"
              onSubmit={handleSubmit}
            >
              <div className="general_info10">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="ui search focus mt-30 lbel25">
                      <label>Email*</label>
                      <div className="ui left icon input swdh19">
                        <input
                          className="prompt srch_explore"
                          type="text"
                          placeholder="Nhập email"
                          name="email"
                          data-purpose="edit-course-title"
                          value={input.email}
                          id="name"
                          onChange={handleChange}
                        />
                      </div>
                      {errors.email && (
                        <div className="help-block">({errors.email})</div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="ui search focus mt-30 lbel25">
                      <label>Password*</label>
                      <div className="ui left icon input swdh19">
                        <input
                          className="prompt srch_explore"
                          type="password"
                          placeholder="Nhập mật khẩu"
                          name="password"
                          data-purpose="edit-course-title"
                          id="topic"
                          value={input.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {errors.password && (
                      <div className="help-block">({errors.password})</div>
                    )}
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="ui search focus mt-30 lbel25">
                      <label>Họ và tên lót *</label>
                      <div className="ui left icon input swdh19">
                        <input
                          className="prompt srch_explore"
                          type="text"
                          placeholder="Nhập họ và tê lót"
                          name="firstName"
                          data-purpose="edit-course-title"
                          value={input.firstName}
                          id="firstName"
                          onChange={handleChange}
                        />
                      </div>
                      {errors.firstName && (
                        <div className="help-block">({errors.firstName})</div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="ui search focus mt-30 lbel25">
                      <label>Tên*</label>
                      <div className="ui left icon input swdh19">
                        <input
                          className="prompt srch_explore"
                          type="text"
                          placeholder="Nhập tên"
                          name="lastName"
                          data-purpose="edit-course-title"
                          value={input.lastName}
                          id="lastName"
                          onChange={handleChange}
                        />
                      </div>
                      {errors.lastName && (
                        <div className="help-block">({errors.lastName})</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-default steps_btn"
              onClick={handleSubmit}
            >
              Tạo tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
