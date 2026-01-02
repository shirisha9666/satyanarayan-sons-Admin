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
  const [banner, setBanner] = useState([]);
  const [employeType, setEmployeType] = useState("");
  const [bannerId, setBannerId] = useState(null);
  const [BannerOneDetails, setBannerOneDetails] = useState([]);
  const [viewBannerId, setViewBannerId] = useState(null);

  const handlegetAllData = async (page = 1, itemPerPage, employeType) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/employe/getAll", {
        params: {
          page,
          limit: itemPerPage,
          searchName: employeType,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response?.data in the employess",response?.data)

      setBanner(response?.data);
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
      setBannerId(id);
      let resp = await axios.delete(`/api/employe/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let message = resp?.data?.message;
      console.log("message", resp?.data);

      await handlegetAllData(page, itemPerPage, employeType);
      toast.success(message);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setBannerId(null);
    }
  };

  const handleOneBanner = async (id) => {
    try {
      setViewBannerId(id);
      let resp = await axios.get(`/api/employe/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBannerOneDetails(resp?.data);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setViewBannerId(null);
    }
  };
  useEffect(() => {
    handlegetAllData(page, itemPerPage, employeType);
  }, []);

    console.log("banner.employees.usecontext",banner)


  return (
    <EmployeesContext.Provider
      value={{
        banner,
        handlegetAllData,
        setPage,
        setItemPerPage,
        setEmployeType,
        employeType,
        itemPerPage,
        loading,
        page,
        handleDelete,
        handleOneBanner,
        bannerId,
        viewBannerId,
        BannerOneDetails,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => useContext(EmployeesContext);
