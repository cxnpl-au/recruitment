import React from "react";
import { Route, Navigate } from "react-router-dom";
import useAuth from "../services/useAuth";

// receives component and any other props represented by ...rest
export default function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  if (!auth.user) {
    return (
      <Navigate
        to={{
          pathname: "/login",
        }}
      />
    );
  } else {
    return children;
  }
}
