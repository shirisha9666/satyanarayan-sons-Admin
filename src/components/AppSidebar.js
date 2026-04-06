import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "src/assets/PSSJ Jewellers.png";

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CCloseButton,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";
import { sygnet } from "src/assets/brand/sygnet";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import navigation from "../_nav";
import { isAutheticated } from "src/auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { toggleChange, toggleUnfold } from "src/redux/reducers/toggler";
import { useBilling } from "src/views/billing/billingContext";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.header.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.header.sidebarShow);

  const [navigationItem, setNavigationItem] = useState([]);
  const [isNavigationLoading, setIsNavigationLoading] = useState(true);
  const { address } = useBilling();
  const appName = address?.[0]?.appName;

  const [userdata, setUserData] = useState(null);
  const token = isAutheticated();
const dummyUser = {
  name: "Raghavendra",
  role: "Admin",
  email: "raghu@example.com",
};
  useEffect(() => {
    const getUser = async () => {
      let existanceData = localStorage.getItem("authToken");
      if (!existanceData) {
        setUserData(false);
        setIsNavigationLoading(false);
      } else {
        try {
          let response = await axios.get(`/api/v1/user/login/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(response.data.user);
        } catch (err) {
          setUserData(false);
          console.log(err);
        } finally {
          setIsNavigationLoading(false);
        }
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!isNavigationLoading) {
      if (userdata && userdata.role) {
        const allowedItems = userdata.accessTo;
        const filteredNavigation = navigation.filter((item) =>
          allowedItems.includes(item.name)
        );
        setNavigationItem(filteredNavigation);
      } else if (userdata && userdata.role && userdata.accessTo) {
        const filteredNavigation = navigation
          .filter((item) => {
            if (item.component === "CNavGroup") {
              return item.items.some((subItem) => userdata.accessTo[subItem.name]);
            }
            return userdata.accessTo[item.name];
          })
          .map((item) => {
            if (item.component === "CNavGroup") {
              return {
                ...item,
                items: item.items.filter((subItem) => userdata.accessTo[subItem.name]),
              };
            }
            return item;
          });
        setNavigationItem(filteredNavigation);
      } else {
        setNavigationItem(navigation);
      }
    }
  }, [userdata, isNavigationLoading]);

  useEffect(() => {
    async function getConfiguration() {
      await axios.get(`/api/config`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    getConfiguration();
  }, []);

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Generate a warm avatar color from name
  const getAvatarColor = (name) => {
    const colors = [
      { bg: "#f0e6d3", text: "#8b5e2e" },
      { bg: "#ddeedd", text: "#2e6b3e" },
      { bg: "#dde4f0", text: "#2e4a8b" },
      { bg: "#f0dde4", text: "#8b2e4a" },
      { bg: "#ede8f0", text: "#5a2e8b" },
    ];
    if (!name) return colors[0];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  const userName =
  userdata?.name ||
  userdata?.username ||
  userdata?.email ||
  dummyUser.name;

const userRole =
  userdata?.role || dummyUser.role;

const userEmail =
  userdata?.email || dummyUser.email;

  return (
    <>
      <style>{`
        /* ── Shell ── */
        .pssj-sidebar.c-sidebar,
        .pssj-sidebar {
          background: #faf8f4 !important;
          border-right: 1px solid #ede8df !important;
          box-shadow: none !important;
          width: 258px !important;
          display: flex !important;
          flex-direction: column !important;
        }

        /* ── Brand ── */
        .pssj-brand {
          background: #faf8f4 !important;
          border-bottom: 1px solid #ede8df !important;
          padding: 0 !important;
          height: auto !important;
          flex-shrink: 0;
        }
        .pssj-brand-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 14px 14px;
        }
        .pssj-brand-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none !important;
        }
        .pssj-brand-img-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #fff;
          border: 1px solid #e8e0d0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .pssj-brand-img-wrap img {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }
        .pssj-brand-name {
          font-size: 0.845rem;
          font-weight: 600;
          color: #1c1612;
          letter-spacing: -0.01em;
          line-height: 1.2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .pssj-brand-sub {
          font-size: 0.67rem;
          color: #9e8f7a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin-top: 1px;
        }

        /* ── Scrollbar ── */
        .pssj-sidebar .simplebar-scrollbar::before {
          background: #d4c9b8 !important;
          border-radius: 3px !important;
        }
        .pssj-sidebar .simplebar-track {
          background: transparent !important;
        }

        /* ── Nav Section Titles ── */
        .pssj-sidebar .nav-title {
          font-size: 0.62rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.07em !important;
          text-transform: uppercase !important;
          color: #b8a898 !important;
          padding: 18px 18px 5px !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
          margin: 0 !important;
        }

        /* ── Nav Items ── */
        .pssj-sidebar .nav-link {
          color: #3d3228 !important;
          padding: 9px 14px !important;
          margin: 2px 8px !important;
          border-radius: 8px !important;
          font-size: 0.835rem !important;
          font-weight: 400 !important;
          letter-spacing: -0.005em !important;
          transition: background 0.15s ease, color 0.15s ease !important;
          border: none !important;
          background: transparent !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
          display: flex !important;
          align-items: center !important;
          gap: 11px !important;
          line-height: 1.3 !important;
        }
        .pssj-sidebar .nav-link {
  transition: background 0.2s ease, transform 0.1s ease;
}

.pssj-sidebar .nav-link:hover {
  transform: translateX(2px);
}
        /* ── Nav Icons ── */
        .pssj-sidebar .nav-icon {
          color: #a0907e !important;
          width: 15px !important;
          height: 15px !important;
          flex-shrink: 0 !important;
          transition: color 0.15s ease !important;
        }
        .pssj-sidebar .nav-link:hover .nav-icon,
        .pssj-sidebar .nav-link.active .nav-icon {
          color: #5c4a32 !important;
        }

        /* ── Nav Group Toggle ── */
        .pssj-sidebar .nav-group-toggle {
          color: #3d3228 !important;
          padding: 9px 14px !important;
          margin: 2px 8px !important;
          border-radius: 8px !important;
          font-size: 0.835rem !important;
          font-weight: 400 !important;
          transition: background 0.15s ease !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
          background: transparent !important;
          border: none !important;
          gap: 11px !important;
        }
        .pssj-sidebar .nav-group-toggle:hover {
          background: #ede8df !important;
          color: #1c1612 !important;
        }
        .pssj-sidebar .nav-group.show > .nav-group-toggle {
          background: #ede8df !important;
          color: #1c1612 !important;
          font-weight: 500 !important;
        }

        /* ── Nav Group Items ── */
        .pssj-sidebar .nav-group-items {
          background: transparent !important;
          padding-left: 10px !important;
          border-left: none !important;
        }
        .pssj-sidebar .nav-group-items .nav-link {
          font-size: 0.8rem !important;
          padding: 8px 14px !important;
          color: #5a4e42 !important;
          margin: 1px 8px !important;
        }
        .pssj-sidebar .nav-group-items .nav-link:hover {
          background: #ede8df !important;
          color: #1c1612 !important;
        }

        //* ── Nav wrapper ── */
.pssj-sidebar .c-sidebar-nav {
  padding: 12px 0 8px !important;
  background: #faf8f4 !important;
}

/* ── Nav Items ── */
.pssj-sidebar .nav-link {
  color: #3d3228 !important;
  padding: 11px 16px !important;   /* 🔥 increased padding */
  margin: 4px 10px !important;     /* 🔥 spacing between items */
  border-radius: 10px !important;
  font-size: 0.87rem !important;
  font-weight: 400 !important;
  transition: all 0.2s ease !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
}

/* Hover like ChatGPT */
.pssj-sidebar .nav-link:hover {
  background: #e9e4db !important;
  color: #1c1612 !important;
}

/* Active */
.pssj-sidebar .nav-link.active {
  background: #e3dccf !important;
  color: #1c1612 !important;
  font-weight: 500 !important;
}

/* ── Icons ── */
.pssj-sidebar .nav-icon {
  color: #a0907e !important;
  width: 16px !important;
  height: 16px !important;
}

/* ── Section Titles ── */
.pssj-sidebar .nav-title {
  font-size: 0.65rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.08em !important;
  color: #b8a898 !important;
  padding: 20px 18px 6px !important; /* 🔥 more spacing */
}

/* ── Group Toggle ── */
.pssj-sidebar .nav-group-toggle {
  padding: 11px 16px !important;
  margin: 4px 10px !important;
  border-radius: 10px !important;
}

/* ── Sub Items ── */
.pssj-sidebar .nav-group-items .nav-link {
  padding: 9px 16px !important;
  margin: 2px 10px !important;
  font-size: 0.82rem !important;
}
      `}</style>

      <CSidebar
        className="pssj-sidebar"
        position="fixed"
        unfoldable={unfoldable}
        visible={sidebarShow}
        onVisibleChange={(visible) => dispatch(toggleChange(visible))}
      >
        {/* ── Brand / Logo ── */}
        <CSidebarBrand className="pssj-brand">
          <div className="pssj-brand-inner">
            <Link to="/dashboard" className="pssj-brand-link">
              <div className="pssj-brand-img-wrap">
                <img src={logo} alt="PSSJ Logo" />
              </div>
              <div>
                <div className="pssj-brand-name">
                  {appName || "P.S.S. Jewellers"}
                </div>
                <div className="pssj-brand-sub">Admin Panel</div>
              </div>
            </Link>
            <CCloseButton
              className="d-lg-none"
              style={{ filter: "invert(30%)" }}
              onClick={() => dispatch(toggleChange(false))}
            />
          </div>
        </CSidebarBrand>

        {/* ── Nav Links ── */}
        <CSidebarNav>
          <SimpleBar style={{ maxHeight: "calc(100vh - 160px)" }}>
            {isNavigationLoading ? (
              <div className="pssj-loading">
                <CSpinner
                  style={{
                    color: "#b0916a",
                    width: "1.2rem",
                    height: "1.2rem",
                    borderWidth: "2px",
                  }}
                />
              </div>
            ) : (
              <AppSidebarNav items={navigationItem} />
            )}
          </SimpleBar>
        </CSidebarNav>

        {/* ── User Footer ── */}
        {userdata && (
          <div className="pssj-user-footer">
            <div className="pssj-user-card">
              {/* Avatar */}
              <div
                className="pssj-user-avatar"
                style={{
                  background: avatarColor.bg,
                  color: avatarColor.text,
                }}
              >
                {initials}
              </div>

              {/* Name + Role */}
              <div className="pssj-user-info">
                <div className="pssj-user-name">{userName}</div>
                <div className="pssj-user-role">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  {userEmail && ` · ${userEmail}`}
                </div>
              </div>

              {/* 3-dot icon */}
              <div className="pssj-user-dots">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle cx="8" cy="2.5" r="1.4" />
                  <circle cx="8" cy="8" r="1.4" />
                  <circle cx="8" cy="13.5" r="1.4" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </CSidebar>
    </>
  );
};

export default React.memo(AppSidebar);