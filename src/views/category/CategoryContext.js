import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [category, setCategory] = useState([]);
  const [bannertype, setBannerType] = useState("Home Banner");
  const [subcategorys, setSubcategorys] = useState([]);
  const [bannerId, setBannerId] = useState(null);
  const [categoryViewDetails, setCategoryViewDetails] = useState([]);
  const [viewCategoryId, setViewCategoryId] = useState(null);

  const handleAllCategorys = async (page = 1, itemPerPage, bannertype) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/product/category/getAll/", {
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
      setCategory(response?.data);
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
      let resp = await axios.delete(`/api/product/category/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let message = resp?.data?.message;
      console.log("message", resp?.data);

      await handleAllCategorys(page, itemPerPage, bannertype);
      toast.success(message);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setBannerId(null);
    }
  };

  const handleCategorySubcategoryFilter = async (id) => {
    try {
      setSubcategorys([]);
      let resp = await axios.get(
        `/api/product/category/all/subcategory/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = resp?.data?.result || [];
      setSubcategorys(result);
      return result;
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
      setSubcategorys([]);
      return [];
    }
  };

  const handlegetOneCategory = async (id) => {
    try {
      setViewCategoryId(id);
      let resp = await axios.get(`/api/product/category/getOne/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategoryViewDetails(resp?.data);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setViewCategoryId(null);
    }
  };
  useEffect(() => {
    handleAllCategorys(page, itemPerPage, bannertype);
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        category,
        handleAllCategorys,
        setPage,
        setItemPerPage,
        setBannerType,
        bannertype,
        itemPerPage,
        handleCategorySubcategoryFilter,
        loading,
        page,
        handleDelete,
        subcategorys,
        handlegetOneCategory,
        categoryViewDetails,
        viewCategoryId,

        bannerId,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
