import axios from "axios";
import toast from "react-hot-toast";

import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const BillingContext = createContext();

export const BillingProvider = ({ children }) => {
  const [billingInvoice, setBillingInvoice] = useState([]);
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState("Hello this buillding workingg");
  const [loadingad, setLoadingAd] = useState(false);
  const [address, setAddress] = useState([]);

  const token = isAutheticated();

  const getBilingInvoice = async (id) => {
    try {
      setLoading(id);
      const res = await axios.get(`/api/billing/get/invoice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("res", res);
      setBillingInvoice(res?.data);
    } catch (error) {
      const msg = error.response?.data?.message || "Internal Server Error";
      toast.error(msg);
      // setErrorMessage(msg);
    } finally {
      setLoading(null);
    }
  };

  const handleAddress = async () => {
    try {
      setLoadingAd(true);
      const res = await axios.get("/api/config/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("res", res);
      setAddress(res?.data?.result);
    } catch (error) {
      let msg = error?.response?.data?.error;
      console.log("handleAddress", error);
    } finally {
      setLoadingAd(false);
    }
  };
  useEffect(()=>{
    handleAddress()
  },[])

  return (
    <BillingContext.Provider value={{ billingInvoice, getBilingInvoice, data,
    handleAddress,address }}>
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => useContext(BillingContext);
