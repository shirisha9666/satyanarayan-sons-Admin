
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "src/assets/PSSJ Jewellers.png"

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CCloseButton,
  CSpinner
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";


import { sygnet } from "src/assets/brand/sygnet";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

// sidebar nav config
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
      const logos = address?.[0]?.logo ||[];
     const appName = address?.[0]?.appName ;
 
  


  const [userdata, setUserData] = useState(null);
  const token = isAutheticated();

  useEffect(() => {
    const getUser = async () => {
      let existanceData = localStorage.getItem("authToken");
      if (!existanceData) {
        setUserData(false);
        setIsNavigationLoading(false);
      } else {
        try {
          let response = await axios.get(`/api/v1/user/details`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;
          if (
            (data.success && data.user.role === "admin") ||
            data.user.role === "Employee"
          ) {
            setUserData(data.user);
          } else {
            setUserData(false);
          }
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
      if (userdata && userdata.role === "Employee") {
        // For employees, include Dashboard and Product Management with all its sub-items
        const allowedItems = ["Dashboard", "Product Management","Settings","Customer Service","Customers","Orders","Billing"];
        const filteredNavigation = navigation.filter((item) =>
          allowedItems.includes(item.name)
        );
        setNavigationItem(filteredNavigation);
      } else if (userdata && userdata.role === "admin" && userdata.accessTo) {
        // For admins, filter based on accessTo permissions
        const filteredNavigation = navigation
          .filter((item) => {
            if (item.component === "CNavGroup") {
              // For groups like Product Management, check if any sub-item is accessible
              return item.items.some((subItem) => userdata.accessTo[subItem.name]);
            }
            return userdata.accessTo[item.name];
          })
          .map((item) => {
            if (item.component === "CNavGroup") {
              // Filter sub-items in groups
              return {
                ...item,
                items: item.items.filter((subItem) => userdata.accessTo[subItem.name])
              };
            }
            return item;
          });
        setNavigationItem(filteredNavigation);
      } else {
        // Default case: show all navigation items if no specific restrictions
        setNavigationItem(navigation);
      }
    }
  }, [userdata, isNavigationLoading]);

  const [loading, setLoading] = useState(false);

  // urlcreated images


  useEffect(() => {
    async function getConfiguration() {
      const configDetails = await axios.get(`/api/config`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
   
    }
    getConfiguration();
  }, []);

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(toggleChange(visible))
      }}
    >
      <CSidebarBrand
        to="/"
      >

      {/* {logos.map((val, index) => (
  <div 
    key={index} 
    className=" d-flex align-items-center justify-content-between px-3 py-2"
    style={{
 
      borderBottom: "1px solid #3949AB",
    }}
  >
    <Link 
      to="/dashboard" 
      className="d-flex align-items-center text-decoration-none"
      style={{ gap: "12px" }}
    >
      <img 
        src={logo || val?.Headerlogo?.fileUrl } 
        alt="logo" 
        style={{ width: "3.5rem", height: "3.5rem", objectFit: "contain" }} 
      />


      <h5 
        className="m-0 text-white"
        style={{ fontSize: "1.4rem", fontWeight: "600" }}
      >
        {appName}
      </h5>
    </Link>

 
    <CCloseButton 
      className="d-lg-none" 
      white 
      onClick={() => dispatch(toggleChange(false))} 
    />
  </div>
))} */}

  <div 

    className=" d-flex align-items-center justify-content-between px-3 py-2"
    style={{
 
      borderBottom: "1px solid #3949AB",
    }}
  >
    <Link 
      to="/dashboard" 
      className="d-flex align-items-center text-decoration-none"
      style={{ gap: "12px" }}
    >
      <img 
        src={logo || val?.Headerlogo?.fileUrl } 
        alt="logo" 
        style={{ width: "100%", height: "5rem", objectFit: "contain" }} 
      />


      <h5 
        className="m-0 text-white"
        style={{ fontSize: "1.4rem", fontWeight: "600" }}
      >
        {appName}
      </h5>
    </Link>

 
    <CCloseButton 
      className="d-lg-none" 
      white 
      onClick={() => dispatch(toggleChange(false))} 
    />
  </div>

        {/* {AdminlogoUrl ? (
          <>
            <Link to="/dashboard" className="bg-warning">
              <img src={AdminlogoUrl} alt="" width="100%" />
            </Link>
            <CCloseButton className="d-lg-none mx-2" white onClick={() => dispatch(toggleChange(false))} />
          </>
        ) : { AppName } ? (
         <div className="bg-primary " style={{padding:"14px"}}>
             <h5 className="" style={{fontSize:"1.5rem"}}>Audio Stream Admin </h5>
          </div>
         
        ) : (
          ""
        )} */}
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>

      <CSidebarNav>
        <SimpleBar>
          {isNavigationLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <CSpinner color="primary" />
            </div>
          ) : (
            <AppSidebarNav items={navigationItem} />
          )}
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);