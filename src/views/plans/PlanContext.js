import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const token = isAutheticated();

  const [getgst, setGetGst] = useState([]);
  const [AllPlans, setAllPlans] = useState([]);
  const [allPlansLoading, setAllPlansLoading] = useState(false);

  const [getPlan, setGetPlan] = useState([]);

  const [planId, setPlanId] = useState(null);
  const [planIdloading, setPlanIdLoading] = useState(null);

  // delete plan
  const [PlanDeleteMsg, setPlanDeleteMsg] = useState("");
  const [planDeleteLoading, setPlanDeletLoading] = useState(null);

  // updating
  const [planUpdateLoading,setPlanUpdateLoading]=useState(null)

  // store local plan id

  const [localPlanId, setLocalPlanId] = useState(() => {
    let id = localStorage.getItem("localPlanId");
    return id ? id : "";
  });

  function getTaxes() {
    axios
      .get(`/api/tax/view_tax`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGetGst(res.data);
      })
      .catch((err) => console.log("error gst", err));
  }

  // get all plans
  const handeAllPlans = async (page = 1, packagename, packageprice) => {
    try {
      setAllPlansLoading(true);
      const res = await axios.get("/api/package/get/all", {
        params: { page, packagename: packagename, packageprice: packageprice },
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = res.data;
      setAllPlans(result);
    } catch (error) {
      const msg = error.response.data.message;
      toast.error(msg || "Internal server error");
    } finally {
      setAllPlansLoading(false);
    }
  };
  //   getByIdPlan
  const handlegetByIdplan = async (id) => {
    try {
      setPlanIdLoading(id);
      const res = await axios.get(`/api/package/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = res.data;
      setGetPlan(result);
    } catch (error) {
      const msg = error.response.data.message;
      toast.error(msg || "Internal server error");
    } finally {
      setPlanIdLoading(null);
    }
  };

  // delete plan
  const handleDeleteByIdplan = async (id) => {
    try {
      setPlanDeletLoading(id);
      const res = await axios.delete(`/api/package/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = res.data.message;
      await handeAllPlans(1, undefined, undefined);
      toast.success(result);
    } catch (error) {
      const msg = error.response.data.message;
      toast.error(msg || "Internal server error");
    } finally {
      setPlanDeletLoading(null);
    }
  };

  useEffect(() => {
    handeAllPlans();
    getTaxes();
  }, []);
  useEffect(() => {
    if (localPlanId) {
      handlegetByIdplan(localPlanId);
    }
  },[localPlanId]);

  return (
    <PlanContext.Provider
      value={{
        handeAllPlans,
        AllPlans,
        setPlanId,
        getPlan,
        getgst,
        handleDeleteByIdplan,
        allPlansLoading,
        planDeleteLoading,
        planIdloading,
        handeAllPlans,
        handlegetByIdplan,
        localPlanId,
        setPlanUpdateLoading
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
