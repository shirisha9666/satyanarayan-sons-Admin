import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { CBadge, CSpinner } from "@coreui/react";
import { useEmployees } from "src/views/employes/EmployeesContext";

const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const getAccessList = (accessData) => {
  const access =
    accessData?.access ?? accessData?.accessTo ?? accessData?.permissions;

  if (Array.isArray(access)) return access;

  if (access && typeof access === "object") {
    return Object.keys(access).filter((key) => access[key]);
  }

  return [];
};

export const AppSidebarNav = ({ items }) => {
  const location = useLocation();
  const { handlegetEmployeAccessData, accessData, accessLoading } =
    useEmployees();

  const navLink = (name, icon, badge) => {
    return (
      <div className="d-flex" style={{ margin: "-7px 0px" }}>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </div>
    );
  };

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <>
        <Component
          {...(rest.to &&
            !rest.items && {
              component: NavLink,
              end: false,
              className: ({ isActive }) => {
                const highlightList = rest.highlightPaths || [];
                const shouldHighlight = highlightList.some((path) =>
                  location.pathname.includes(path)
                );

                return isActive || shouldHighlight ? "active" : "";
              },
            })}
          key={index}
          {...rest}
        >
          {navLink(name, icon, badge)}
        </Component>
      </>
    );
  };
  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item;
    const Component = component;
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
      </Component>
    );
  };
  useEffect(() => {
    handlegetEmployeAccessData();
  }, []);

  
//   const filterNavByAccess = (items = [], access = [], role = "") => {
//   // ✅ ADMIN & BRANCH_MANAGER → full access
//   if (role === "admin" || role === "branch_manager") {
//     return items;
//   }

//   return items
//     .map((item) => {
//       // 🔹 If item has children (Settings)
//       if (item.items && item.items.length > 0) {
//         const filteredChildren = filterNavByAccess(
//           item.items,
//           access,
//           role
//         );

//         // Show parent ONLY if it has visible children
//         if (filteredChildren.length > 0) {
//           return {
//             ...item,
//             items: filteredChildren,
//           };
//         }

//         return null;
//       }

//       // 🔹 Normal menu item
//       return access.includes(item.name) ? item : null;
//     })
//     .filter(Boolean);
// };

  
const filterNavByAccess = (items = [], access = [], role = "") => {
  // 🔓 Admin & Branch Manager → full access
  if (role === "admin") {
    return items;
  }
  
  return items
    .map((item) => {
      // 🔹 Parent menu (like Settings)
      if (item.items && item.items.length > 0) {
        // ✅ If parent itself is allowed → show ALL children
        if (access.includes(item.name)) {
          return item;
        }

        // ❌ Otherwise filter children normally
        const filteredChildren = filterNavByAccess(
          item.items,
          access,
          role
        );

        if (filteredChildren.length > 0) {
          return {
            ...item,
            items: filteredChildren,
          };
        }

        return null;
      }

      // 🔹 Normal menu item
      return access.includes(item.name) ? item : null;
    })
    .filter(Boolean);
};

const filterNavByRoleScope = (items = [], role = "") => {
  const disallowedPathsByRole = {
    admin: ["/offlineusers", "/payInstallments"],
    branch_manager: ["/gold-schemes"],
    employee: ["/gold-schemes"],
  };

  const disallowed = disallowedPathsByRole[role] || [];

  return items
    .map((item) => {
      if (item.items && item.items.length > 0) {
        const filteredChildren = filterNavByRoleScope(item.items, role);
        if (filteredChildren.length === 0) return null;
        return { ...item, items: filteredChildren };
      }

      if (item.to && disallowed.includes(item.to)) return null;
      return item;
    })
    .filter(Boolean);
};


  
  const userRole = normalizeRole(accessData?.role);
  const userAccess = getAccessList(accessData);

  const filteredItems = filterNavByRoleScope(
    filterNavByAccess(items, userAccess, userRole),
    userRole
  );

  return (
    // <React.Fragment>
    //   {items &&
    //     items.map((item, index) =>
    //       item.items ? navGroup(item, index) : navItem(item, index)
    //     )}
    // </React.Fragment>
    <React.Fragment>
      {accessLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <CSpinner color="primary" />
        </div>
      ) : (
        filteredItems &&
        filteredItems.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )
      )}
      {/* {filteredItems &&
        filteredItems.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )} */}
    </React.Fragment>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};
