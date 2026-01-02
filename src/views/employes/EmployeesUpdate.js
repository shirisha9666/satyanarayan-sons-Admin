import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Checkbox, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import _nav from "src/_nav";
import { isAutheticated } from "src/auth";
import { useBranche } from "../Branches/BranchesContext";
import { useEmployees } from "./EmployeesContext";

const EmployeUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = isAutheticated();
  const [loading,setLoading]=useState(false)
  const { banner } = useBranche();
  const {
    handlegetAllData,
    employeType,
    page,
    itemPerPage,
    employeDetails,
    handleOneEmploye,
  } = useEmployees();

  const branchess = banner?.result || [];

  // ✅ MAIN STATE
  const [employeData, setEmployData] = useState({
    name: "",
    email: "",
    phone: "",
    branchId: "",
    Role: "Employee",
    access: {}, // ✅ OBJECT for checkbox handling
    password: "",
  });

  // ✅ FILTER ACCESS MENU
  const filteredNav = _nav.filter((item) => item.name !== "Employee");

  // ✅ INPUT HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ CHECKBOX HANDLER
  const handleCheckboxChange = (name) => (event) => {
    setEmployData((prev) => ({
      ...prev,
      access: {
        ...prev.access,
        [name]: event.target.checked,
      },
    }));
  };

  // ✅ PREPARE ACCESS ARRAY FOR BACKEND
  const prepareAccessForBackend = () => {
    return Object.keys(employeData.access).filter(
      (key) => employeData.access[key] === true
    );
  };

  // ✅ SUBMIT FORM
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...employeData,
      access: prepareAccessForBackend(),
    };

    try {
      setLoading(true)
      await axios.patch(`/api/employe/update/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Employee Updated Successfully");
      await handlegetAllData(page, itemPerPage, employeType);
      navigate("/employee");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }finally{
      setLoading(false)
    }
  };

  // ✅ ROLES
  const roles = [
    { role: "Admin", sendValue: "admin" },
    { role: "Branch Manager", sendValue: "branch_manager" },
    { role: "Account Manager", sendValue: "account_manager" },
    { role: "Content Manager", sendValue: "content_manager" },
    { role: "Employee", sendValue: "Employee" },
  ];

  const mapAccessArrayToObject = (accessArray = []) => {
    const accessObj = {};
    accessArray.forEach((item) => {
      accessObj[item] = true;
    });
    return accessObj;
  };

  useEffect(() => {
    handleOneEmploye(id);
  }, [id]);
  useEffect(() => {
    if (employeDetails) {
      setEmployData({
        name: employeDetails?.name,
        email: employeDetails?.email,
        phone: employeDetails?.phone,
        branchId: employeDetails?.branchId,
        Role: employeDetails?.Role,
        access: mapAccessArrayToObject(employeDetails?.access),
        password: employeDetails?.password,
      });
    }
  }, [employeDetails]);
  console.log("employeDetails", employeDetails);

  return (
    <Box style={{ background: "#fff", padding: "1rem" }}>
      <Typography variant="h6" style={{ fontWeight: "bold" }}>
        Add Employee
      </Typography>

      <div className="row">
        {/* Name */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Employee Name *</label>
          <input
            className="form-control"
            name="name"
            value={employeData.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Employee Email *</label>
          <input
            className="form-control"
            name="email"
            value={employeData.email}
            onChange={handleChange}
          />
        </div>

        {/* Role */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Role *</label>
          <select
            className="form-select"
            name="Role"
            value={employeData.Role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            {roles.map((r, i) => (
              <option key={i} value={r.sendValue}>
                {r.role}
              </option>
            ))}
          </select>
        </div>

        {/* Branch */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Branch Name *</label>
          <select
            className="form-select"
            name="branchId"
            value={employeData.branchId}
            onChange={handleChange}
          >
            <option value="">Select Branch</option>
            {branchess.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>

        {/* Phone */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            name="phone"
            value={employeData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Password *</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={employeData.password}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ACCESS */}
      <Box className="mb-3">
        <label className="form-label">Access To *</label>
        <div className="row">
          {filteredNav.map((item, index) => (
            <div key={index} className="col-md-4">
              <Checkbox
                checked={employeData.access[item.name] || false}
                onChange={handleCheckboxChange(item.name)}
              />
              {item.name}
            </div>
          ))}
        </div>
      </Box>

      {/* BUTTONS */}
      <div className="d-flex gap-2">
        <Button variant="contained" onClick={handleFormSubmit}>
          {loading?<CircularProgress size={25}/>:"Save"}
          
        </Button>
        <Button variant="outlined" onClick={() => navigate("/employee")}>
          Cancel
        </Button>
      </div>
    </Box>
  );
};

export default EmployeUpdate;
