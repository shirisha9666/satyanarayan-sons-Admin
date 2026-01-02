import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const EmployeesContext = createContext();

export const EmployeesProvider = ({ children }) => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [employeesData, setEmployees] = useState([]);
  const [employeType, setEmployeType] = useState("");
  const [delId, setEmployeesId] = useState(null);
  const [employeDetails, setEmployeesOneDetails] = useState([]);
  const [viewBannerId, setViewBannerId] = useState(null);
  const [searchByRole,setSearchByRole]=useState("branch_manager")

  const handlegetAllData = async (page = 1, itemPerPage, employeType,searchByRole) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/employe/getAll", {
        params: {
          page,
          limit: itemPerPage,
          searchName: employeType,
          serachRole:searchByRole
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response?.data in the employess",response?.data)

      setEmployees(response?.data);
    } catch (error) {
      const errormssage = error.response && error.response.data.message;
      toast.error(errormssage)
      console.log("errormssage", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setEmployeesId(id);
      let resp = await axios.delete(`/api/employe/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let message = resp?.data?.message;
      console.log("message", resp?.data);

      await handlegetAllData(page, itemPerPage, employeType,searchByRole);
      toast.success(message);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setEmployeesId(null);
    }
  };

  const handleOneEmploye = async (id) => {
    try {
      setViewBannerId(id);
      let resp = await axios.get(`/api/employe/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployeesOneDetails(resp?.data);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setViewBannerId(null);
    }
  };
  useEffect(() => {
    handlegetAllData(page, itemPerPage, employeType,searchByRole);
  }, []);




  return (
    <EmployeesContext.Provider
      value={{
        employeesData,
        handlegetAllData,
        setPage,
        setItemPerPage,
        setEmployeType,
        employeType,
        itemPerPage,
        loading,
        page,
        handleDelete,
        handleOneEmploye,
        delId,
        viewBannerId,
        employeDetails,
        searchByRole,setSearchByRole
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => useContext(EmployeesContext);
