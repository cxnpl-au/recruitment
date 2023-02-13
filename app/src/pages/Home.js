import React, { useEffect } from "react";
// import axiosConfig from "../services/axiosConfig";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../services/useAuth";
import Header from "../components/Header";

export default function Home() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.user) {
      console.log("Redirecting...");
      navigate("/login");
    }
  });

  return (
    <div>
      <Header/>
      <div>
        Home
      </div>
    </div>
  );
}
