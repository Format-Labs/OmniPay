/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import {
  contractABI,
  contractAddress,
  ERC20ABI,
  erc20Address,
} from "../lib/constants";
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

const getERC20Contract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const erc20Contract = new ethers.Contract(erc20Address, ERC20ABI, signer);

  return erc20Contract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [amount, setAmount] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [approved, setIsApproved] = useState(false);
  const [confirmed, setIsConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    addressTo: "0x83dbAD8Bc853924Acb6AD1D0688fff806e934e1F",
    token: "0x4a0d1092e9df255cf95d72834ea9255132782318",
    amount: Math.round(amount),
    amountUSD: Math.round(amount),
    risk: false,
  });

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

  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install MetaMask");
      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      throw new Error("Couldn't connect to MetaMask");
    }
  };

  const getAmount = async (amount) => {
    setAmount(amount);
    setFormData({
      ...formData,
      amount: Math.round(amount).toString(),
      amountUSD: Math.round(amount).toString(),
    });
  };

  const handlePay = async (metamask = eth) => {
    const { addressTo, token, amount, amountUSD, risk } = formData;
    const parsedAmount = ethers.utils.parseUnits(amount.toString(), 6);
    const transactionContract = getEthereumContract();
    const txHash = await transactionContract.Pay(
      addressTo,
      token,
      parsedAmount,
      amountUSD,
      risk
    );
    setIsLoading(true);
    await txHash.wait();
    setIsLoading(false);
    setIsConfirmed(true);

    return txHash;
  };

  const handleApprove = async (metamask = eth) => {
    const { amount } = formData;
    const parsedAmount = ethers.utils.parseUnits(
      Math.round(amount).toString(),
      6
    );
    const transactionContract = getERC20Contract();
    const txHash = await transactionContract.approve(
      contractAddress,
      parsedAmount
    );

    setIsLoading(true);

    await txHash.wait();
    setIsLoading(false);
    setIsApproved(true);
  };

  const handleSelect = function (e) {
    setSelectedChain(e.target.value);
  };

  const handleConfirm = (token) => {
    // and set FormData
    setFormData({
      ...formData,
      token,
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        handleConfirm,
        formData,
        isLoading,
        handleSelect,
        handlePay,
        handleApprove,
        getAmount,
        approved,
        confirmed,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
