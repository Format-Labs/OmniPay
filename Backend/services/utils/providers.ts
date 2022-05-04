import dotenv from "dotenv";
import Web3 from "web3";
import * as Ethers from "ethers";

dotenv.config();
export const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.INFURA_URL)
);
export const ethers = Ethers.getDefaultProvider();
