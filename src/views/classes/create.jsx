import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { createClass } from "../../services/api/class";

function CreateClass() {
  const [input, setInput] = useState({
    name: "",
    topic: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: null,
    topic: null,
    description: null,
  });
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  function handleChange(event) {
    switch (event.target.name) {
      case "name":
        setInput({
          ...input,
          name: event.target.value,
        });
        break;
      case "topic":
        setInput({
          ...input,
          topic: event.target.value,
        });
        break;
      default:
        setInput({
          ...input,
          description: event.target.value,
        });
        break;
    }
  }
  function validate() {
    let isValid = true;
    var errs = {};
    if (!input.name) {
      isValid = false;
      errs.name = "Tên lớp học là bắt buộc";
    }

    if (input.name.length > 100) {
      isValid = false;
      errs.name = "Nhập tối đa 100 kí tự";
    }

    if (!input.topic) {
      isValid = false;
      errs.topic = "Chủ đề lớp học là bắt buộc";
    }
    if (input.description.trim().split(/\s+/).length > 220) {
      isValid = false;
      errs.description = "Tối đa 220 từ";
    }
    console.log("err", errs);

    setErrors(errs);
    return isValid;
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (validate()) {
      dispatch(createClass(input));
      let newInput = { name: "", description: "", topic: "" };
      setInput(newInput);
      document.getElementById("close-create-modal").click();
    }
  }

  if (redirect) {
    return <Redirect to="/my-classes" />;
  }
  return (
    <div
      className="course_tabs_1 modal fade"
      id="createClass"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="createClass"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="title">
              <i className="uil uil-info-circle" />
              Tạo lớp học
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
                      <label>Tên lớp học*</label>
                      <div className="ui left icon input swdh19">
                        <input
                          className="prompt srch_explore"
                          type="text"
                          placeholder="Nhập tên lớp học"
                          name="name"
                          data-purpose="edit-course-title"
                          value={input.name}
                          id="name"
                          onChange={handleChange}
                        />
                      </div>
                      {errors.name && (
                        <div className="help-block">({errors.name})</div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="ui search focus mt-30 lbel25">
                      <label>Chủ đề*</label>
                      <div className="ui left icon input swdh19">
                        <input
                          className="prompt srch_explore"
                          type="text"
                          placeholder="Nhập chủ đề lớp học"
                          name="topic"
                          data-purpose="edit-course-title"
                          id="topic"
                          value={input.topic}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {errors.topic && (
                      <div className="help-block">({errors.topic})</div>
                    )}
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="ui search focus lbel25 mt-30">
                      <label>Mô tả ngắn</label>
                      <div className="ui form swdh30">
                        <div className="field">
                          <textarea
                            rows={3}
                            name="description"
                            id="description"
                            placeholder="Nhập mô tả khái quá cho lớp học..."
                            value={input.description}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {errors.description && (
                        <div className="help-block">({errors.description})</div>
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
              type="submit"
              form="form-create"
            >
              Tạo lớp học
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateClass;
