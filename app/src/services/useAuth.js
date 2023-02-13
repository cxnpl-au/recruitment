import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axiosConfig from "./axiosConfig";
import jwt_decode from "jwt-decode";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const tokenStorage = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : "";

  let currentUser = "";

  if (tokenStorage) {
    currentUser = jwt_decode(tokenStorage).userId;
  }

  const [user, setUser] = useState(currentUser || null);
  const [token, setToken] = useState(tokenStorage || null);

  const checkToken = () => {
    if (token != null) {
      let decodedToken = jwt_decode(token);
      console.log("Decoded: ", decodedToken);
      let currentDate = new Date();

      if (decodedToken.exp * 1000 > currentDate.getTime()) {
        console.log("Token valid");
        return;
      }
    }
    console.log("Token expired");
    logout();
  };

  //   const checkToken = () => {
  //     console.log("check token", token);
  //     if (token != null) {
  //       axiosConfig
  //         .post("/auth")
  //         .then((result) => {
  //           //   console.log(result);
  //           const token = result.data?.token;
  //           const userId = result.data?.id;
  //           localStorage.setItem("token", token);

  //           setUser(userId);
  //           setToken(token);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           logout();
  //         });
  //       //   let decodedToken = jwt_decode(token);
  //       //   console.log("Decoded: ", decodedToken);
  //       //   let currentDate = new Date();

  //       //   if (decodedToken.exp * 1000 < currentDate.getTime()) {
  //       //     console.log("Token expired");
  //       //     logout();
  //       //     return true;
  //       //   } else {
  //       //     console.log("Token valid");
  //       //     return false;
  //       //   }
  //     }
  //     // return true;
  //   };

  const clear = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const login = (email, password) => {
    console.log("signin", email);
    axiosConfig
      .post("/login", {
        email: email,
        password: password,
      })
      .then((result) => {
        const token = result.data?.token;
        const userId = result.data?.id;
        localStorage.setItem("token", token);
        setUser(userId);
        setToken(token);
        return result;
      })
      .catch((err) => {
        // clear();
        console.log(err);
      });
  };

  const signup = (role, name, email, password) => {
    // set user to server

    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    console.log("signup", role, name);
    axiosConfig
      .post("/users", {
        role: role,
        name: name,
        email: email,
        password: password,
      })
      .then((result) => {
        const token = result.data?.token;
        const userId = result.data?.id;
        localStorage.setItem("token", token);
        setUser(userId);
        setToken(token);
        return result;
      })
      .catch((err) => {
        console.log(err);
        // clear();
      });
  };

  const logout = (cb) => {
    clear();
    if (cb) {
      cb();
    } else {
      window.location.href = "/";
    }
  };

  return { user, login, signup, logout, token, checkToken };
}
