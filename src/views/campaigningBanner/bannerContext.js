const { createContext, useContext, } = require("react");

const BannerContext=createContext();

export const BannerProvider=({children})=>{
    return(
        <BannerContext.Provider value={""}>{children}</BannerContext.Provider>
    )
}

export const useBanner=()=>useContext(BannerContext)