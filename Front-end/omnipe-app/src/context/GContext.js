/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { contractABI, contractAddress } from "../lib/constants";
import { ethers } from "ethers";

export const TransactionContext = React.createContext();

let eth;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}
const networks = {
  rinkeby: {
    chainId: `0x${Number(4).toString(16)}`,
    chainName: "Rinkeby Test Network",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.infura.io/v3/"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org",
    ],
    blockExplorerUrls: ["https://bscscan.com"],
  },
};

const changeNetwork = async () => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: networks.rinkeby.chainId,
        },
      ],
    });
  } catch (err) {
    if (err.code === 4902) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            ...networks["rinkeby"],
          },
        ],
      });
      // alert("Switching to Rinkeby failed. Please do it manually.");
    }
  }
};

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
  const [currentAccount, setCurrentAccount] = useState("");
  const [home, setHome] = useState(true);
  const [balance, setBalance] = useState(0);
  const [amnt, setAmount] = useState({
    amount: "",
    token: "0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4",
    address: "",
  });

  const [formData, setFormData] = useState({
    address: "",
    settlementToken: "",
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

  const handleNetworkSwitch = async () => {
    await changeNetwork();
  };

  const handleCreateAccount = async (metamask = eth) => {
    try {
      const { address, settlementToken } = formData;
      const transactionContract = getEthereumContract();
      const txHash = await transactionContract.createAccount(
        address,
        settlementToken
      );
      setIsLoading(true);
      await txHash.wait();
      setIsLoading(false);

      return txHash;
    } catch (err) {
      alert(err.reason);
    }
  };

  const getBalance = async () => {
    const transactionContract = getEthereumContract();
    // isLoading(true);
    const balance = await transactionContract.getBalance(currentAccount);
    // isLoading(false);
    setBalance(balance.toString(10));
    return balance;
  };

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const handleChangeAmount = (e, name) => {
    setAmount((prevState) => ({ ...prevState, [name]: e.target.value }));
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
  const withdraw = async () => {
    try {
      const { amount, address, token } = amnt;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseUnits(amount, 6);
      const txHash = await transactionContract.withdraw(
        address,
        parsedAmount,
        token
      );
      setIsLoading(true);
      await txHash.wait();
      setIsLoading(false);
    } catch (err) {
      alert(err.reason);
    }
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
        handleNetworkSwitch,
        getBalance,
        withdraw,
        handleChangeAmount,
        balance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
