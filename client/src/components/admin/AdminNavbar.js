import React from "react";
import { Link } from "react-router-dom";

import styles from "./../../styles/css/admin.module.css";

const AdminNavbar = ({ toggleSidebar }) => {
  return (
    <>
      <header id={styles["admin-navbar"]} className="d-flex align-items-center">
        <nav>
          <div className="container-fluid">
            <div className="d-flex align-items-center">
              <div
                className="d-flex align-items-center"
                onClick={() => toggleSidebar()}
                style={{ cursor: "pointer" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="white"
                  className="bi bi-list"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </div>

              <div>
                <Link className={`${styles["navbar-brand"]} mx-3`} to="/admin">
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default AdminNavbar;
