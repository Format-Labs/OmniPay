import dotenv from "dotenv";
// const Web3 = require("web3");
import Web3 from "web3";
import * as Ethers from "ethers";

dotenv.config();

export const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/a11d1ebf625c40d0b2cc473431443791"
  )
);

export const ethers = new Ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/a11d1ebf625c40d0b2cc473431443791"
);
