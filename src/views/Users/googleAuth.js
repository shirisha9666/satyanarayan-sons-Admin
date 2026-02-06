import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React from "react";

const GoogleAuth = () => {
  // const googleAuth=()=>
  const responsGoogle = async (authResult) => {
    try {
   
     console.log(authResult);
    } catch (error) {
    console.error("Error while requesting google code", error);
    }
  };
  const goggleLogin = useGoogleLogin({
    onSuccess: responsGoogle,
    onError: responsGoogle,
    flow: "auth-code",
  });
  return (
    <div className="App">
      <button onClick={goggleLogin}>Login with google</button>
    </div>
  );
};

export default GoogleAuth;
