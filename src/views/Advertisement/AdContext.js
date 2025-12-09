import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const AdsContext = createContext();

export const AdsProvider = ({ children }) => {
  const token = isAutheticated();


  const [allads, setAllPlans] = useState([]);
  const [allAdsLoading, setAllAdsLoading] = useState(false);

  const [getAd, setGetAdd] = useState([]);

  const [planId, setPlanId] = useState(null);
  const [addIdloading, setAddIdLoading] = useState(null);

  // delete plan
  const [PlanDeleteMsg, setPlanDeleteMsg] = useState("");
  const [planDeleteLoading, setPlanDeletLoading] = useState(null);

  // updating
  const [planUpdateLoading, setPlanUpdateLoading] = useState(null)

  // store local plan id

  const [localAddId, setLocalAdId] = useState(() => {
    let id = localStorage.getItem("localAddId");
    return id ? id : "";
  });


  // get all plans  handeAllAds
  const handeAllAds = async (page = 1) => {
    try {
      setAllAdsLoading(true);
      const res = await axios.get(`/api/Ads/get/all?page=${page}`, {
     
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = res.data;
      setAllPlans(result);
    } catch (error) {
      const msg = error.response.data.message;
      toast.error(msg || "Internal server error");
    } finally {
      setAllAdsLoading(false);
    }
  };
  //   getByIdPlan
  const handlegetByIdAd = async (id) => {
    try {
      setAddIdLoading(id);
      const res = await axios.get(`/api/Ads/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = res.data;
      setGetAdd(result);
    } catch (error) {
      const msg = error.response.data.message;
      toast.error(msg || "Internal server error");
    } finally {
      setAddIdLoading(null);
    }
  };

  // delete plan
  const handleDeleteByIdAd = async (id) => {
    try {
      setPlanDeletLoading(id);
      const res = await axios.delete(`/api/Ads/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = res.data.message;
      await handeAllAds(1);
      toast.success(result);
    } catch (error) {
      const msg = error.response.data.message;
      toast.error(msg || "Internal server error");
    } finally {
      setPlanDeletLoading(null);
    }
  };

  useEffect(() => {
    handeAllAds(1)
  }, [])

  useEffect(() => {
    if (localAddId) {
      handlegetByIdAd(localAddId);
    }
  }, [localAddId]);

  return (
    <AdsContext.Provider
      value={{
        handeAllAds,

        setPlanId,
        getAd,
        allads,
        handleDeleteByIdAd,
        allAdsLoading,
        planDeleteLoading,
        addIdloading,
        handeAllAds,
        handlegetByIdAd,
        localAddId,
        setPlanUpdateLoading
      }}
    >
      {children}
    </AdsContext.Provider>
  );
};

export const useAds = () => useContext(AdsContext);
