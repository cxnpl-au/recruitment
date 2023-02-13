import React, { useEffect } from "react";
import axiosConfig from "../services/axiosConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../services/useAuth";
import Header from "../components/Header";
import AccountCard from "../components/AccountCard";

export default function Home() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
    // get accounts in org
    axiosConfig
      .get("/accounts", {
        headers: { Authorization: "Bearer " + auth.token },
      })
      .then((res) => {
        setAccounts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth.token]);

  return (
    <div class="w-full ">
      <Header />
      <div class="flex mx-5 my-5 justify-center">
        <div class="sm:container">
          <div class="grid grid-cols-1 max-w-700">
            {accounts
              ? accounts?.map((acc) => {
                  return <AccountCard account={acc} />;
                })
              : "No accounts"}
          </div>
        </div>
      </div>
    </div>
  );
}
