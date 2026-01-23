import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [employeesData, setEmployees] = useState([]);
  const [employeType, setEmployeType] = useState("");
  const [delId, setEmployeesId] = useState(null);
  const [usergoldScheme, setUserGoldSchemes] = useState([]);
  const [viewBannerId, setViewBannerId] = useState(null);
  const [searchByRole, setSearchByRole] = useState("");
  const [accessData, setAccessData] = useState([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [userInvoices, setUserInvoices] = useState([]);
  const [invoiceTableLoading,setInvoiceTableLoading]=useState(false)
  const[InvoiceDetail,setInvoiceDetail]=useState([])
  const [InvoiceDetailLoading,setInvoiceDetailLoading]=useState(null)
  const [searchName,setSearchName]=useState("")

  const getBackendMessage = (error) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong"
    );
  };

  const handlegetAllData = async (page = 1, itemPerPage, searchByRole,searchName) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/customer/get/all", {
        params: {
          page,
          limit: itemPerPage,
          searchType: searchByRole,
          searchName:searchName
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response?.data in the employess", response?.data);

      setEmployees(response?.data);
    } catch (error) {
      const errormssage = error.response && error.response.data.message;
      toast.error(errormssage);
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

      await handlegetAllData(page, itemPerPage, employeType,searchName);
      toast.success(message);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setEmployeesId(null);
    }
  };

  const handleUserSchemas = async (id) => {
    try {
      setViewBannerId(id);
      let resp = await axios.get(`/api/customer/get/all/users/schemes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserGoldSchemes(resp?.data);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setViewBannerId(null);
    }
  };

  const handleAllUserInvoice = async (id) => {
    try {
      setInvoiceTableLoading(id);
      let resp = await axios.get(`/api/customer/get/user/all/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserInvoices(resp?.data);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setInvoiceTableLoading(null);
    }
  };

  const handlegetEmployeAccessData = async () => {
    try {
      setAccessLoading(true);
      const response = await axios.get("/api/v1/user/login/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAccessData(response?.data?.data);
    } catch (error) {
      const errormssage = error.response && error.response.data.message;
      console.log("errormssage", errormssage);
    } finally {
      setAccessLoading(false);
    }
  };

    const handleByIdInvoice = async (id) => {
    try {
      setInvoiceDetailLoading(id);
      let resp = await axios.get(`/api/customer/get/user/invoice/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      setInvoiceDetail(resp?.data);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setInvoiceDetailLoading(null);
    }
  };
  useEffect(() => {
    handlegetAllData(page, itemPerPage, employeType,searchName);
    handlegetEmployeAccessData();
  }, []);

  return (
    <TransactionsContext.Provider
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
        handleUserSchemas,
        delId,
        viewBannerId,
        usergoldScheme,
        searchByRole,
        setSearchByRole,
        handlegetEmployeAccessData,
        accessData,
        accessLoading,
        getBackendMessage,
        handleAllUserInvoice,
        invoiceTableLoading,
        userInvoices,
        InvoiceDetailLoading,
        handleByIdInvoice,
        InvoiceDetail,
        setSearchName,
        searchName
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
