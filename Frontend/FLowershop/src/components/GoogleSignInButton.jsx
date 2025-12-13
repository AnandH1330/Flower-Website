import React, { useEffect } from "react";
import axios from "axios";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({ onAuth }) {
  useEffect(() => {
    if (!CLIENT_ID) {
      console.error("VITE_GOOGLE_CLIENT_ID is missing. Add it to .env and restart the dev server.");
      return;
    }

    const initGSI = () => {
      if (!window.google || !window.google.accounts?.id) {
        console.error("Google Identity Services not available after script load.");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        { theme: "outline", size: "large" }
      );
    };

    // Load script if not present
    if (!window.google) {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.onload = initGSI;
      s.onerror = () => console.error("Failed to load Google Identity Services script.");
      document.head.appendChild(s);
    } else {
      initGSI();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCredentialResponse(response) {
    const id_token = response?.credential;
    if (!id_token) {
      console.error("No id_token received from Google:", response);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/google-login/", { id_token });
      if (onAuth) onAuth(res.data);
      console.log("Google login success:", res.data);
    } catch (err) {
      console.error("Google login failed - backend returned:", err.response?.data || err.message || err);
    }
  }

  return <div id="g_id_signin" />;
}