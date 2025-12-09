import axios from "axios";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const BannerContext = createContext();

export const BannerProvider = ({ children }) => {
    const token = isAutheticated();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(5);
    const [banner, setBanner] = useState([]);
    const [bannertype, setBannerType] = useState("Home Banner");

    const getHomebanners = async (page = 1, itemPerPage, bannertype) => {
        try {
            setLoading(true);
            const response = await axios.get("/api/homeBanner/getAll/", {
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

    const handleDelete = (_id) => {
        try {
            setLoading(true);
            let resp = axios.delete(`/api/homeBanner/delete/${_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            const errormessage = error.response && error.response.data.error;
            console.log("errormessage", errormessage);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getHomebanners(page, itemPerPage, bannertype);
    }, []);
      console.log("fetchBanner",banner)


    return <BannerContext.Provider value={{banner,getHomebanners,setPage,setItemPerPage,setBannerType,bannertype,itemPerPage,loading,page}}>{children}</BannerContext.Provider>;
};

export const useBanner = () => useContext(BannerContext);
