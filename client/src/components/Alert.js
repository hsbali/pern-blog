import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { removeAlert } from "../actions/alert";

const Alert = ({ alerts, removeAlert }) => {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <>
      {alerts.map((alert) => {
        return (
          <Fragment key={alert.id}>
            <div
              className={`alert alert-${alert.type} alert-dismissible my-2 mx-5`}
              role="alert"
            >
              <p className="m-0">{alert.msg}</p>
              <button
                type="button"
                className="btn-close"
                onClick={(e) => removeAlert(alert.id)}
              ></button>
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
  removeAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps, { removeAlert })(Alert);
