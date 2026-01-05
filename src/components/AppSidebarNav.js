import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { CBadge } from "@coreui/react";
import axios from "axios";
import { isAutheticated } from "src/auth";

export const AppSidebarNav = ({ items }) => {
  const location = useLocation();
  let token=isAutheticated()
  const [loading,setLoading]=useState(false)
  const [accessData,setAccessData]=useState([])


  
  const handlegetAllData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/user/login/", {
    
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response?.data", response?.data?.data);
      setAccessData(response?.data);
    } catch (error) {
      const errormssage = error.response && error.response.data.message;
      console.log("errormssage", errormssage);
    } finally {
      setLoading(false);
    }
  };
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
useEffect(()=>{
  handlegetAllData()
},[])

console.log("accessData",accessData)
  return (
    <React.Fragment>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
    </React.Fragment>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};
