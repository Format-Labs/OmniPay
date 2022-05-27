/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { contractABI, contractAddress } from "../lib/constants";
import { ethers } from "ethers";

export const TransactionContext = React.createContext();

let eth;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [home, setHome] = useState(true);

  const [formData, setFormData] = useState({
    address: "",
    settlementToken: "",
  });
  // console.log(home);

  const connectWallet = async (mematask = eth) => {
    try {
      if (!mematask) return alert("Please install MetaMask");
      const accounts = await mematask.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      throw new Error("Couldn't connect to MetaMask");
    }
  };

  const handleCreateAccount = async (metamask = eth) => {
    const { address, settlementToken } = formData;
    const transactionContract = getEthereumContract();
    const txHash = await transactionContract.createAccount(
      address,
      settlementToken
    );
    setIsLoading(true);
    await txHash.wait();
    setIsLoading(false);
    setIsConfirmed(true);

    return txHash;
  };

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    const { address, settlementToken } = formData;
    e.preventDefault();

    if (!address || !settlementToken) {
      alert("Please fill in all fields");
      return;
    }

    handleCreateAccount();
  };

  const handleRoutes = (state) => {
    setHome(state);
  };
  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        handleChange,
        connectWallet,
        formData,
        handleSubmit,
        isLoading,
        handleCreateAccount,
        home,
        setHome,
        handleRoutes,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
