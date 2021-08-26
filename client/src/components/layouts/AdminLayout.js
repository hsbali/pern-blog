import React, { useState } from "react";

import AdminNavbar from "../admin/AdminNavbar";
import Sidebar from "../admin/Sidebar";
import Alert from "../Alert";

import styles from "./../../styles/css/admin.module.css";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div>
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <div id={styles["admin-content"]} className="d-flex align-items-center">
          {isSidebarOpen ? (
            <>
              <div className={styles["admin-layout-sidebar"]}>
                <Sidebar />
              </div>
            </>
          ) : (
            <>
              <div className={styles["admin-layout-sidebar-hidden"]}>
                <Sidebar />
              </div>
            </>
          )}
          <div className="container-fluid p-0">
            <div id={styles["admin-main"]} className="py-3">
              <div className="row  mx-5">
                <div className="col p-0">
                  <Alert />
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
