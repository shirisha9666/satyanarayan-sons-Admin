import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const GoldRateContext = createContext();

export const GoldRateProvider = ({ children }) => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [goldRate, setGoldRate] = useState([]);
  const [bannertype, setBannerType] = useState("Home Banner");
  const [goldRateId, setGoldRateId] = useState(null);
    const [goldRateeditId, setGoldRateEditId] = useState(null);
  const [goldData, setGoldData] = useState([]);

  const handlegetAllProducts = async (page = 1, itemPerPage) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/gold/rate/getAll", {
        params: {
          page,
          limit: itemPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response?.data.goldrate", response?.data);
      setGoldRate(response?.data);
    } catch (error) {
      const errormssage = error.response && error.response.data.message;
      console.log("errormssage", errormssage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setGoldRateId(id);
      let resp = await axios.delete(`/api/gold/rate/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let message = resp?.data?.message;
      console.log("message", resp?.data);

      await handlegetAllProducts(page, itemPerPage);
      toast.success(message);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setGoldRateId(null);
    }
  };

  const handlegeOnegoldRate = async (id) => {
    try {
      setGoldRateEditId(id);
      let resp = await axios.get(`/api/gold/rate/getOne/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGoldData(resp?.data);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setGoldRateEditId(null);
    }
  };
  useEffect(() => {
    handlegetAllProducts(page, itemPerPage);
  }, []);

  return (
    <GoldRateContext.Provider
      value={{
        goldRate,
        handlegetAllProducts,
        setPage,
        setItemPerPage,
        setBannerType,
        bannertype,
        itemPerPage,
        loading,
        page,
        handleDelete,
        goldRateeditId,
        goldRateId,
        goldData,
        handlegeOnegoldRate,
      }}
    >
      {children}
    </GoldRateContext.Provider>
  );
};

export const useGoldRate = () => useContext(GoldRateContext);
