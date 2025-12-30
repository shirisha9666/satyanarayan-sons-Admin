import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const AboutContext = createContext();

export const AboutProvider = ({ children }) => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [banner, setBanner] = useState([]);
  const [bannertype, setBannerType] = useState("New_Arrivals");
  const [bannerId, setBannerId] = useState(null);
  const [BannerOneDetails, setBannerOneDetails] = useState([]);
  const [viewBannerId, setViewBannerId] = useState(null);

  const handlegetAllData = async (page = 1, itemPerPage, bannertype) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/about/get/all", {
        params: {
          page,
          limit: itemPerPage,
          selectedType: bannertype,
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
      let resp = await axios.delete(`/api/about/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let message = resp?.data?.message;
      console.log("message", resp?.data);

      await handlegetAllData(page, itemPerPage, bannertype);
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
      let resp = await axios.get(`/api/about/get/${id}`, {
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
    handlegetAllData(page, itemPerPage, bannertype);
  }, []);

  return (
    <AboutContext.Provider
      value={{
        banner,
        handlegetAllData,
        setPage,
        setItemPerPage,
        setBannerType,
        bannertype,
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
    </AboutContext.Provider>
  );
};

export const useAbout = () => useContext(AboutContext);
