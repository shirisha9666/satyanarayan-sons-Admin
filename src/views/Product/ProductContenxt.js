import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [products, setProducts] = useState([]);
  const [bannertype, setBannerType] = useState("Home Banner");
  const [bannerId, setBannerId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [productViewDetails, setProductViewDetails] = useState([]);
  const [productCount, setProductsCount] = useState([]);

  const [searchBtn, setSearchBtn] = useState("");

  const [searchInput, setSearchInput] = useState("");

  const handlegetAllProducts = async (
    page = 1,
    itemPerPage,
    searchBtn,
    searchInput,
  ) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/product/admin/getAll/", {
        params: {
          page,
          limit: itemPerPage,
          category: searchBtn,
          productName: searchInput,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
   
      setProducts(response?.data);
    } catch (error) {
      const errormssage = error.response && error.response.data.message;
      console.log("errormssage", errormssage);
    } finally {
      setLoading(false);
    }
  };

  const handlegetAllProductsCount = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/product/getAll/products/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProductsCount(response?.data?.data);
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
      let resp = await axios.delete(`/api/product/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let message = resp?.data?.message;
      console.log("message", resp?.data);

      await handlegetAllProducts(page, itemPerPage, searchBtn, searchInput);
      toast.success(message);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setBannerId(null);
    }
  };

  const handlegetOneProduct = async (id) => {
    try {
      setProductId(id);
      let resp = await axios.get(`/api/product/getOne/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProductViewDetails(resp?.data);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setProductId(null);
    }
  };
  useEffect(() => {
    handlegetAllProducts(page, itemPerPage, searchBtn, searchInput);
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
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
        handlegetOneProduct,
        productViewDetails,
        productId,
        handlegetAllProductsCount,
        productCount,
        setSearchBtn,
        setSearchInput,
        searchBtn,
        searchInput,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
