import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Alert = ({ alerts }) => {
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
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps, {})(Alert);
