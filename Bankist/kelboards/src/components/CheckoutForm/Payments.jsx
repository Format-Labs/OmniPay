import React from "react";
import { useState, useContext, useEffect } from "react";
import { TransactionContext } from "../../context/Gcontext";

const chains = [
  { name: "Avalanche", image: "../../public/images/eth.svg", value: 1 },
];

const tokens = [
  { name: "USDC", address: "0x4a0d1092e9df255cf95d72834ea9255132782318" },
];

const Payments = ({ amount }) => {
  const [tokenAmount] = useState(amount);
  const [selectedToken] = useState(tokens[0].address);

  const {
    connectWallet,
    currentAccount,
    handleConfirm,
    handlePay,
    handleApprove,
    getAmount,
    approved,
    handleNetworkSwitch,
  } = useContext(TransactionContext);

  useEffect(() => {
    let isMounted = true;
    handleConfirm(selectedToken);
    getAmount(amount);
    return () => (isMounted = false);
  }, []);

  const MakeItem = function (chain) {
    return (
      <option className="w-28" value={chain} key={chain}>
        {chain}
      </option>
    );
  };

  return (
    <div style={{ backgroundColor: "#eaebee", borderRadius: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "#ecedf1",
          // borderRadius: "10px",
          padding: "10px",
        }}
      >
        <div style={{ backgroundColor: "#cdccd1", borderRadius: "10px" }}>
          <div>
            <div
              className="m-1"
              style={{
                marginLeft: "10px",
                padding: "4px",
              }}
            >
              <label
                htmlFor="chainId"
                style={{ fontSize: "20px", fontWeight: "bold", color: "black" }}
              >
                Choose Chains
              </label>
            </div>
            <select
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "black",
                position: "relative",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                borderRadius: "10px",
              }}
            >
              {chains.map((chains) => MakeItem(chains.name))}
            </select>
          </div>
        </div>
        <div style={{ backgroundColor: "#cdccd1", borderRadius: "10px" }}>
          <div>
            <div className="m-1" style={{ margin: "0.25rem" }}>
              <label
                htmlFor="chainId"
                className="font-bold text-black "
                style={{ fontSize: "20px", fontWeight: "bold", color: "black" }}
              >
                Choose Tokens
              </label>
            </div>
            <select
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "black",
                position: "relative",
                paddingTop: "0.5rem",
                margin: "0.25rem",
                paddingBottom: "0.5rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
            >
              {tokens.map((token) => MakeItem(token.name))}
            </select>
          </div>
        </div>
      </div>
      <div
        className="m-2 text-3xl text-black border-2 rounded-sm bg-slate-200"
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "black",
          backgroundColor: "rgb(226 232 240)",
          borderRadius: "10px",
          margin: "0.5rem",
          textAlign: "center",
          padding: "10px",
        }}
      >
        <div>$ {amount}</div>
      </div>
      <div
        className="m-2 text-3xl text-black border-2 rounded-sm bg-slate-200"
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "black",
          backgroundColor: "rgb(226 232 240)",
          borderRadius: "10px",
          margin: "0.5rem",
          textAlign: "center",
          padding: "10px",
        }}
      >
        <div>{tokenAmount} USDC</div>
      </div>
      <div
        // center the button
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        {(() => {
          if (currentAccount) {
            if (approved) {
              return (
                <button
                  onClick={() => handlePay()}
                  className="p-2 m-2 text-3xl text-white bg-blue-600 border-2 rounded-2xl"
                  style={{
                    fontSize: "20px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "rgb(0, 122, 255)",
                    borderRadius: "10px",
                    margin: "0.5rem",
                    outline: "none",
                    cursor: "pointer",
                    borderColor: "transparent",
                  }}
                >
                  <div>Confirm</div>
                </button>
              );
            } else {
              return (
                <button
                  onClick={() => handleApprove()}
                  className="p-2 m-2 text-3xl text-white bg-blue-600 border-2 rounded-2xl"
                  style={{
                    alignSelf: "center",
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "rgb(0, 122, 255)",
                    borderRadius: "10px",
                    margin: "0.5rem",
                    outline: "none",
                    cursor: "pointer",
                    borderColor: "transparent",
                  }}
                >
                  <div> Approve</div>
                </button>
              );
            }
          } else {
            return (
              <button
                onClick={() => {
                  connectWallet();
                  handleNetworkSwitch();
                }}
                className="p-2 m-2 text-3xl text-white bg-blue-600 border-2 rounded-2xl"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                  backgroundColor: "rgb(0, 122, 255)",
                  borderRadius: "10px",
                  margin: "0.5rem",
                  outline: "none",
                  cursor: "pointer",
                  borderColor: "transparent",
                }}
              >
                <div> Connect Wallet</div>
              </button>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default Payments;
