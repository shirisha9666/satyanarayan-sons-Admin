

import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

// routes config
import routes from "../routes";
import { isAutheticated } from "src/auth";
import axios from "axios";
import toast from "react-hot-toast";

const AppContent = () => {
  const [userper, setuserper] = useState(null);
  const token = isAutheticated();

  useEffect(() => {
    const getUser = async () => {
      let existanceData = localStorage.getItem("authToken");
      if (!existanceData) {
        setuserper(null);
      } else {
        try {
          let response = await axios.get(`/api/v1/user/details`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response?.data;
          setuserper(data?.user);
          // if (
          //   data?.success &&
          //   (data?.user?.role === "admin" || data?.user?.role === "Employee")
          // ) {
          //   setuserper(data?.user);
          // } else {
          //   setuserper(null);
          // }
        } catch (err) {
          setuserper(null);
          console.log(err);
        }
      }
    };
    getUser();
  }, []);

  const [appRoutes, setAppRoutes] = useState(routes);

  // Define allowed routes for Employee users under Product Management
  const allowedEmployeeRoutes = [
    "Product Management",
    "Settings",
    "Customer Service",
    "Customers",
    "Orders",
  ];
  console.log("appRoutes",appRoutes)

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {/* {appRoutes.map((route, idx) => {
    
            if (
              userper?.role === "admin" || // Admin has access to all routes
              (userper?.role === "Employee" &&
                allowedEmployeeRoutes.includes(route?.navName)) ||
              route.navName?.trim() === ""
            ) {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<route.element />}
                  />
                )
              );
            }
            return null;
          })} */}

          {appRoutes.map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={<route.element />}
              />
            );
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
