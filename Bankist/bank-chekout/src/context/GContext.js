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
  const [selectedChain, setSelectedChain] = useState(10006);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    addressTo: "0x83dbAD8Bc853924Acb6AD1D0688fff806e934e1F",
    token: "",
    amount: "",
    amountUSD: "",
    risk: false,
  });

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async (mematask = eth) => {
    console.log("connectWallet");

    try {
      if (!mematask) return alert("Please install MetaMask");
      const accounts = await mematask.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      console.log(currentAccount);
    } catch (err) {
      console.error(err);
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
      console.error(err);
      throw new Error("Couldn't connect to MetaMask");
    }
  };

  const sendTransaction = async (
    metamask = eth,
    connectedAccount = currentAccount
  ) => {
    try {
      if (!metamask) return alert("Please install MetaMask");
      const { addressTo, amount } = formData;
      const transactionContract = getEthereumContract();

      const parsedAmount = ethers.utils.parseEther(amount);

      await metamask.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: "0x7ef40",
            value: parsedAmount._hex,
          },
        ],
      });

      const TransactionHash = await transactionContract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transferring ETH ${parsedAmount} to ${addressTo}`,
        "TRANSFER"
      );

      setIsLoading(true);

      await TransactionHash.wait();

      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
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

    console.log(txHash);

    return txHash;
  };

  const handleApprove = async (metamask = eth) => {
    const { addressTo, amount } = formData;
    const parsedAmount = ethers.utils.parseUnits(amount.toString(), 6);
    const transactionContract = getERC20Contract();
    const txHash = await transactionContract.approve(
      contractAddress,
      //   parsedAmount._hex
      parsedAmount
    );
    console.log(parsedAmount._hex);

    setIsLoading(true);
    await txHash.wait();
    setIsLoading(false);
  };

  const handleSelect = function (e) {
    setSelectedChain(e.target.value);
  };

  const handleConfirm = (amount, token) => {
    // and set FormData
    setFormData({
      ...formData,
      amount,
      token,
    });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    const { addressTo, amount } = formData;
    e.preventDefault();

    if (!addressTo || !amount) {
      alert("Please fill in all fields");
      return;
    }

    sendTransaction();
  };

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        sendTransaction,
        handleConfirm,
        formData,
        handleSubmit,
        isLoading,
        handleSelect,
        handlePay,
        handleApprove,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
