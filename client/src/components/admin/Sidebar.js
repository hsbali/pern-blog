import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { adminLogout } from "../../actions/adminAuth";

import styles from "./../../styles/css/admin.module.css";

const Sidebar = ({ adminLogout }) => {
  const [isPostList, setIsPostList] = useState(false);
  const [isCommentList, setIsCommentList] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setIsPostList(window.location.pathname.includes("/post"));
    setIsCommentList(window.location.pathname.includes("/comment"));
    setSelected(window.location.pathname);
  }, []);

  return (
    <>
      <div id={styles["admin-sidebar"]} className="p-3">
        <ul className={styles["sidebar-nav"]}>
          <li onClick={() => setIsPostList(!isPostList)}>
            <div
              className={
                isPostList
                  ? `${styles["nav-item"]} ${styles["active"]} rounded`
                  : `${styles["nav-item"]} rounded`
              }
            >
              {isPostList ? (
                <>
                  <span className="pe-2">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </>
              ) : (
                <>
                  <span className="pe-2">
                    <i className="bi bi-caret-right-fill"></i>
                  </span>
                </>
              )}
              Posts
            </div>
            {isPostList ? (
              <>
                <ul
                  className={`${styles["sidebar-drop-nav"]}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <li>
                    <Link to="/admin/post/add">
                      <div
                        className={
                          selected.includes("/post/add")
                            ? `${styles["nav-item"]} ${styles["active"]} rounded`
                            : `${styles["nav-item"]} rounded`
                        }
                      >
                        Add Post
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/post/list">
                      <div
                        className={
                          selected.includes("/post/list")
                            ? `${styles["nav-item"]} ${styles["active"]} rounded`
                            : `${styles["nav-item"]} rounded`
                        }
                      >
                        All Post
                      </div>
                    </Link>
                  </li>
                </ul>
              </>
            ) : (
              ""
            )}
          </li>
          <li onClick={() => setIsCommentList(!isCommentList)}>
            <div
              className={
                isCommentList
                  ? `${styles["nav-item"]} ${styles["active"]} rounded`
                  : `${styles["nav-item"]} rounded`
              }
            >
              {isCommentList ? (
                <>
                  <span className="pe-2">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </>
              ) : (
                <>
                  <span className="pe-2">
                    <i className="bi bi-caret-right-fill"></i>
                  </span>
                </>
              )}
              Comments
            </div>
            {isCommentList ? (
              <>
                <ul
                  className={`${styles["sidebar-drop-nav"]}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <li>
                    <Link to="/admin/comment/list">
                      <div
                        className={
                          selected.includes("/comment/list")
                            ? `${styles["nav-item"]} ${styles["active"]} rounded`
                            : `${styles["nav-item"]} rounded`
                        }
                      >
                        All Comments
                      </div>
                    </Link>
                  </li>
                </ul>
              </>
            ) : (
              ""
            )}
          </li>
          <li>
            <hr />
          </li>
          <li onClick={() => adminLogout()}>
            <div className={`${styles["nav-item"]} rounded`}>Log out</div>
          </li>
        </ul>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  adminLogout: PropTypes.func.isRequired,
};

// const mapStateToProps = (state) => {
//   : state
// }

export default connect(null, { adminLogout })(Sidebar);
