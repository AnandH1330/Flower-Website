
// import { createContext, useContext, useState } from "react";
// import axiosInstance from "../Api/axiosInstance";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   // Load user safely from localStorage
//   const loadUser = () => {
//     try {
//       const user = localStorage.getItem("user");
//       return user ? JSON.parse(user) : null;
//     } catch {
//       localStorage.removeItem("user");
//       return null;
//     }
//   };

//   const [user, setUser] = useState(loadUser());
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     !!localStorage.getItem("access")
//   );

//   const login = async (username, password) => {
//     const res = await axiosInstance.post("login/", { username, password });

//     localStorage.setItem("access", res.data.access);
//     localStorage.setItem("refresh", res.data.refresh);
//     localStorage.setItem("user", JSON.stringify(res.data.user));
//     localStorage.setItem("is_admin", res.data.user.is_admin);

//     setUser(res.data.user);
//     setIsAuthenticated(true);

//     return res.data.user;
//   };

//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);



import { createContext, useContext, useState } from "react";
import axiosInstance from "../Api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user safely from localStorage
  const loadUser = () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  };

  const [user, setUser] = useState(loadUser());
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access")
  );

  const login = async (username, password) => {
    const res = await axiosInstance.post("login/", { username, password });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("is_admin", res.data.user.is_admin);

    setUser(res.data.user);
    setIsAuthenticated(true);

    return res.data.user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        setUser,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);