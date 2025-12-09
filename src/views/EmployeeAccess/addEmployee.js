import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import _nav from "src/_nav";
import toast from "react-hot-toast";
import axios from "axios";
import { isAutheticated } from "src/auth";

const AddEmployee = () => {
  const [employeData, setEmployData] = useState({
    name: "",
    email: "",
    phone: "",
    // role: "Employee",
    accessTo: {},
    password: "",
  });
  const token = isAutheticated();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const filteredNav = _nav.filter((item) => item.name !== "Employee");
  const [checkedItems, setCheckedItems] = useState(
    filteredNav.reduce((acc, item) => {
      acc[item.name] = false;
      return acc;
    }, {})
  );

  const handleCheckboxChange = (name) => (event) => {
    const { checked } = event.target;
    setEmployData((prev) => ({
      ...prev,
      accessTo: {
        ...prev.accessTo,
        [name]: checked,
      },
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/v1/add/employe", employeData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      toast.success("Employee Added Successful");

      navigate("/employee");
    } catch (error) {
      console.log(error?.response);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <Box style={{ background: "#FFFFFF", color: "black", padding: "1rem" }}>
        <Typography
          style={{ margin: "0.5rem 0rem", fontWeight: "bold" }}
          variant="h6"
        >
          {" "}
          Add Employee:{" "}
        </Typography>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Employe Name*
          </label>

          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Eg: pawan kr"
            name="name"
            value={employeData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Phone Number
          </label>

          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Eg: 8516913819"
            name="phone"
            value={employeData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="welcomeMsgforDes" className="form-label">
            Email*
          </label>

          <input
            type="email"
            className="form-control"
            id="welcomeMsgforDes"
            placeholder="Eg: example@gmail.com "
            name="email"
            value={employeData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="welcomeMsgforDes" className="form-label">
            password*
          </label>

          <input
            type="text"
            className="form-control"
            id="welcomeMsgforDes"
            placeholder="Enter Password "
            name="password"
            value={employeData.password}
            onChange={handleChange}
          />
        </div>
        <Box>
          <label htmlFor="welcomeMsgforDes" className="form-label">
            Access to*
          </label>
          <div>
            {filteredNav.map((item, index) => (
              <div key={index}>
                <Checkbox
                  checked={employeData.accessTo[item.name] || false}
                  onChange={handleCheckboxChange(item.name)}
                  inputProps={{ "aria-label": "controlled" }}
                />
                {item.name}
              </div>
            ))}
          </div>
        </Box>
        <div style={{ display: "flex" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
            style={{
              fontWeight: "bold",
              marginBottom: "1rem",
              textTransform: "capitalize",
              marginRight: "5px",
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/employee")}
            style={{
              fontWeight: "bold",
              marginBottom: "1rem",
              textTransform: "capitalize",
              marginRight: "5px",
            }}
          >
            Cancel
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default AddEmployee;
