import { createContext, useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axiosConfig from "./axiosConfig";
import jwt_decode from "jwt-decode";
// import { useNavigate } from "react-router-dom";

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
  const refreshStorage = localStorage.getItem("refresh")
    ? localStorage.getItem("refresh")
    : "";

  let currentUser = "";
  if (tokenStorage) {
    currentUser = jwt_decode(tokenStorage).userId;
  }

  const [user, setUser] = useState(currentUser || null);
  const [token, setToken] = useState(tokenStorage || null);
  const [refresh, setRefresh] = useState(refreshStorage || null);

  const checkJWT = () => {
    if (token != null) {
      let decodedToken = jwt_decode(token);
      let decodedRefresh = jwt_decode(refresh);
      console.log("Decoded: ", decodedToken);
      let currentDate = new Date();

      if (
        decodedToken.exp * 1000 < currentDate.getTime() &&
        decodedRefresh.exp * 1000 < currentDate.getTime()
      ) {
        console.log("Token expired");
        logout();
        return true;
      } else {
        console.log("Token valid");
        return false;
      }
    }
    return true;
  };

  const clear = () => {
    setUser(null);
    setToken(null);
    setRefresh(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  };

  const login = (email, password) => {
    console.log("signin", email);
    axiosConfig
      .post("/login", {
        email: email,
        password: password,
      })
      .then((result) => {
        console.log(result);
        const token = result.data?.token;
        const userId = result.data?.id;
        localStorage.setItem("token", token);
        localStorage.setItem("refresh", result.data.refresh);
        setUser(userId);
        setToken(token);
        setRefresh(result.data.refresh);

        // success();
        return result;
      })
      .catch((err) => {
        // clear();
        // failure();
        console.log(err);
      });

    // return user;
  };

  const signup = (role, name, email, password) => {
    // set user to server

    setUser(null);
    setToken(null);
    setRefresh(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    console.log("signup", role, name);
    axiosConfig
      .post("/users", {
        role: role,
        name: name,
        email: email,
        password: password,
      })
      .then((result) => {
        console.log(result);
        const token = result.data?.token;
        const userId = result.data?.id;
        localStorage.setItem("token", token);
        localStorage.setItem("refresh", result.data.refresh);
        setUser(userId);
        setToken(token);
        setRefresh(result.data.refresh);

        // success();
        return result;
      })
      .catch((err) => {
        console.log(err);
        // clear();
        // failure();
      });
  };

  const logout = (cb) => {
    // setUser(false);
    clear();
    if (cb) {
      cb();
    } else {
      window.location.href = "/";
    }

    // cb();
  };

  return { user, login, signup, logout, token, checkJWT };
}
