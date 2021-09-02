import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { removeToast } from "../../actions/toast";

const Toast = ({ toasts, removeToast }) => {
  return (
    <>
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ width: "300px", zIndex: "11" }}
      >
        {toasts.length !== 0 ? (
          <>
            {toasts.map((toast, i) => {
              return (
                <Fragment key={i}>
                  <div
                    className="mt-3 w-100"
                    style={{
                      boxShadow: "0px 0px 4px #606060",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      className="toast-header"
                      style={{ borderBottom: "1px solid #d4d4d4" }}
                    >
                      <strong className="me-auto">{toast.title}</strong>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => removeToast(toast.id)}
                      ></button>
                    </div>
                    <div className="toast-body" style={{ background: "white" }}>
                      <p className="m-0">{toast.subTitle}</p>
                      <p className="m-0">{toast.body}</p>
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

Toast.propTypes = {
  toasts: PropTypes.array.isRequired,
  removeToast: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  toasts: state.toast,
});

export default connect(mapStateToProps, { removeToast })(Toast);
