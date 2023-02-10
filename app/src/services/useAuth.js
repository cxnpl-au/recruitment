import { createContext, useContext, useState, useEffect } from "react";
import axiosConfig from "./axiosConfig";
// import jwt_decode from "jwt-decode";
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

  let userDecoded = "";
  if (tokenStorage) {
    // userDecoded = jwt_decode(tokenStorage).userId;
  }
  //   const navigate = useNavigate();
  const [user, setUser] = useState(userDecoded || null);
  const [token, setToken] = useState(tokenStorage || null);
  const [refresh, setRefresh] = useState(refreshStorage || null);

  //   const isJWTExpired = () => {
  //     if (token != null) {
  //       let decodedToken = jwt_decode(token);
  //       let decodedRefresh = jwt_decode(refresh);
  //       console.log("decoded: ", decodedToken);
  //       let currentDate = new Date();
  //       // check if refresh is expired as well, if so sign out
  //       if (
  //         decodedToken.exp * 1000 < currentDate.getTime() &&
  //         decodedRefresh.exp * 1000 < currentDate.getTime()
  //       ) {
  //         console.log("token expired");
  //         Logout();
  //         return true;
  //       } else {
  //         console.log("valid token");
  //         return false;
  //       }
  //     }
  //     return true;
  //   };

  const clear = () => {
    // setRefresh(null);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  };

  const login = (email, password) => {
    // do sign in functionality and return user
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
        // localStorage.setItem("refresh", result.data.refresh);
        // console.log("CREATED REFRESH TOKEN: ", result.data.refresh);
        // setRefresh(result.data.refresh);
        setUser(userId);
        setToken(token);
        // success();
        return result;
      })
      .catch((err) => {
        // clear();
        // failure();
        console.log(err);
      });

    // return user;
    // return user deatils from server.
  };

  const signup = (role, name, email, password) => {
    // set user to server

    // setUser(null);
    // setToken(null);
    // setRefresh(null);
    // localStorage.removeItem("token");
    // localStorage.removeItem("refresh");
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
        // localStorage.setItem("refresh", result.data.refresh);
        // setRefresh(result.data.refresh);
        setUser(userId);
        setToken(token);
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

  //   axiosConfig.interceptors.response.use(
  //     (response) => {
  //       return response;
  //     },
  //     (error) => {
  //       let originalRequest = error.config;
  //       console.log(originalRequest);
  //       console.log(error.response);
  //       let localRefreshToken = localStorage.getItem("refresh");
  //       let localAccessToken = localStorage.getItem("token");
  //       if (
  //         error.response &&
  //         error.response.status === 401 &&
  //         localRefreshToken
  //       ) {
  //         console.log(localRefreshToken);
  //         return axiosConfig
  //           .post(
  //             "/users/refreshToken",
  //             {
  //               refresh: localRefreshToken,
  //               token: localAccessToken,
  //             },
  //             (error) => {
  //               console.log("error");
  //             }
  //           )
  //           .then((result) => {
  //             console.log(result);
  //             localStorage.setItem("token", result.data.token);
  //             localStorage.setItem("refresh", result.data.refresh);
  //             setRefresh(result.data.refresh);
  //             setUser(result.data.userId);
  //             setToken(result.data.token);
  //             originalRequest._retry = true;
  //             originalRequest.headers.Authorization =
  //               "Bearer " + result.data.token;
  //             console.log(originalRequest);
  //             let new_response = axiosConfig.request(originalRequest);
  //             console.log(new_response);
  //             return new_response;
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //             setRefresh(null);
  //             setUser(null);
  //             setToken(null);
  //             return Promise.reject(err);
  //           });
  //       } else {
  //         return Promise.reject(error);
  //       }
  //     }
  //   );

  //   useEffect(() => {}, [token, user, refresh]);

  return { user, login, signup, logout, token };
}
