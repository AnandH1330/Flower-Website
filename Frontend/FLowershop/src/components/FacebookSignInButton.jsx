import React from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";

export default function FacebookSignInButton({ onAuth, setError }) {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID || "718167080906886";

  const handleSuccess = async (fbResponse) => {
    // fbResponse typically contains { accessToken, userID, name, email, ... }
    const access_token = fbResponse?.accessToken || fbResponse?.access_token;
    if (!access_token) {
      setError?.("Failed to get Facebook access token");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/facebook-login/", {
        access_token,
      });

      const data = res.data;
      // Persist tokens + user (backend returns { access, refresh, user })
      if (data?.access) localStorage.setItem("access", data.access);
      if (data?.refresh) localStorage.setItem("refresh", data.refresh);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
      if (data?.user) localStorage.setItem("is_admin", data.user.is_admin);

      if (onAuth) onAuth(data);
    } catch (err) {
      console.error("Facebook backend verification error:", err.response?.data || err);
      const msg = err.response?.data?.error || "Backend verification failed";
      setError?.(msg);
    }
  };

  const handleFail = (err) => {
    console.error("Facebook login failed / cancelled:", err);
    setError?.("Facebook login failed or cancelled");
  };

  return (
    <FacebookLogin
      appId={appId}
      onSuccess={handleSuccess}
      onFail={handleFail}
      autoLoad={false}
      fields="name,email,picture"
      scope="public_profile,email"
      size="medium"
      textButton="Continue with Facebook"
    />
  );
}