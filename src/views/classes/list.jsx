import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll, getAllJoinedClasses } from "../../services/api/class";
import ClassItem from "../../components/class-item";
import Footer from "../../components/footer";
import PropTypes from "prop-types";
ClassList.props = {
  isMyClasses: PropTypes.bool,
  isMyJoinedClasses: PropTypes.bool,
};
ClassList.defaultProps = {
  isMyClasses: false,
  isMyJoinedClasses: false,
};

function ClassList(props) {
  const { isMyClasses, isMyJoinedClasses } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    if (isMyClasses) dispatch(getAll());
    else if (isMyJoinedClasses) {
      dispatch(getAllJoinedClasses());
    }
  }, [dispatch, isMyClasses, isMyJoinedClasses]);
  const classList = useSelector((state) =>
    isMyClasses ? state.class.classList : state.class.joinedClasses
  );

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
                        code={obj.code}
                        name={obj.name}
                        topic={obj.topic}
                        isMyClasses={isMyClasses}
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
      <Footer />
    </div>
  );
}

export default ClassList;
