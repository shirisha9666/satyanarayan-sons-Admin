import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const GoldSchemaContext = createContext();

export const GoldSchemaProvider = ({ children }) => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [banner, setBanner] = useState([]);
  const [bannertype, setBannerType] = useState("Home Banner");
  const [bannerId, setBannerId] = useState(null);
  const [goldSchemaeditId, setGoldSchemaEditId] = useState(null);
  const [goldSchema, setGoldSchema] = useState([]);
    const [viewDetails,setViewDetails]=useState([])

  const handlegetAllProducts = async (page = 1, itemPerPage, bannertype) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/gold/schema/get/all", {
        params: {
          page,
          limit: itemPerPage,
          bannerType: bannertype,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response?.data", response?.data);
      setBanner(response?.data);
    } catch (error) {
      const errormssage = error.response && error.response.data.message;
      console.log("errormssage", errormssage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setBannerId(id);
      let resp = await axios.delete(`/api/gold/schema/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let message = resp?.data?.message;
      console.log("message", resp?.data);

      await handlegetAllProducts(page, itemPerPage, bannertype);
      toast.success(message);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setBannerId(null);
    }
  };

  const handlegeOnegoldRate = async (id) => {
    try {
      setGoldSchemaEditId(id);
      let resp = await axios.get(`/api/gold/schema/getOne/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setViewDetails(resp?.data?.findgoldRate);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setGoldSchemaEditId(null);
    }
  };
  useEffect(() => {
    handlegetAllProducts(page, itemPerPage, bannertype);
  }, []);

 
  return (
    <GoldSchemaContext.Provider
      value={{
        banner,
        handlegetAllProducts,
        setPage,
        setItemPerPage,
        setBannerType,
        bannertype,
        itemPerPage,
        loading,
        page,
        handleDelete,
        bannerId,
        handlegeOnegoldRate,
        goldSchemaeditId,
        goldSchema,
        viewDetails,
      }}
    >
      {children}
    </GoldSchemaContext.Provider>
  );
};

export const useGoldSchema = () => useContext(GoldSchemaContext);
