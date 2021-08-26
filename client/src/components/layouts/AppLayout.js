import React from "react";

import Navbar from "../Navbar";
import Alert from "../Alert";

const AppLayout = ({ navTitle, children }) => {
  return (
    <>
      <Navbar title={navTitle} />
      <Alert />
      {children}
    </>
  );
};

export default AppLayout;
