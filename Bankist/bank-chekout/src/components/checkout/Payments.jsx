import React from "react";
import { useState, useContext, useEffect } from "react";
import { TransactionContext } from "../../context/GContext";

const chains = [
  { name: "Avalanche", image: "../../public/images/eth.svg", value: 1 },
  { name: "Polygon", image: "../../public/images/eth.svg", value: 3 },
];

const tokens = [
  { name: "USDC", address: "0x4a0d1092e9df255cf95d72834ea9255132782318" },
];

const Payments = () => {
  const [amount] = useState(100);
  const [tokenAmount] = useState(amount);
  const [selectedToken, setSelectedToken] = useState(tokens[0].address);
  const [selectedChain, setSelectedChain] = useState(chains[0].name);

  const {
    connectWallet,
    currentAccount,
    handleConfirm,
    handlePay,
    handleApprove,
  } = useContext(TransactionContext);

  useEffect(() => {
    handleConfirm(amount, selectedToken);
  }, [amount, setSelectedToken]);

  const MakeItem = function (chain) {
    return (
      <option className="w-28" value={chain} key={chain}>
        {chain}
      </option>
    );
  };
  const handleSelect = function (e) {
    setSelectedChain(e.target.value);
    console.log(selectedChain);
  };

  return (
    <div>
      <div className="flex justify-between bg-[#ecedf1] rounded-sm ">
        <div className="w-40 p-1 bg-[#cdccd1] rounded-md outline-none m-1 ">
          <div>
            <div className="m-1">
              <label htmlFor="chainId" className="font-bold text-black ">
                Choose Chains
              </label>
            </div>
            <select
              onChange={(e) => handleSelect(e)}
              className="relative py-2 pl-3 pr-10 text-2xl text-left text-black bg-white rounded-lg shadow-md cursor-default w-100 focus:outline-none sm:text-sm"
            >
              {chains.map((chains) => MakeItem(chains.name))}
            </select>
          </div>
        </div>
        <div className="w-40 p-1 bg-[#cdccd1] rounded-md outline-none m-1 ">
          <div>
            <div className="m-1">
              <label htmlFor="chainId" className="font-bold text-black ">
                Choose Tokens
              </label>
            </div>
            <select className="relative py-2 pl-3 pr-10 text-2xl text-left text-black bg-white rounded-lg shadow-md cursor-default w-100 focus:outline-none sm:text-sm">
              {tokens.map((token) => MakeItem(token.name))}
            </select>
          </div>
        </div>
      </div>
      <div className="m-2 text-3xl text-black border-2 rounded-sm bg-slate-200s">
        <div>$ {amount}</div>
      </div>
      <div className="m-2 text-3xl text-black border-2 rounded-sm bg-slate-200s">
        <div>{tokenAmount} USDC</div>
      </div>
      {/* confirm button */}
      {currentAccount ? (
        <button
          // get the amount in usd and amount
          // get the selected chain and token

          onClick={() => handlePay()}
          className="p-2 m-2 text-3xl text-white bg-blue-600 border-2 rounded-2xl"
        >
          <div>Confirm</div>
        </button>
      ) : (
        <button
          onClick={() => connectWallet()}
          className="p-2 m-2 text-3xl text-white bg-blue-600 border-2 rounded-2xl"
        >
          <div> Connect Wallet</div>
        </button>
      )}
      <button
        onClick={() => handleApprove()}
        className="p-2 m-2 text-3xl text-white bg-blue-600 border-2 rounded-2xl"
      >
        <div> Approve</div>
      </button>
    </div>
  );
};

export default Payments;
