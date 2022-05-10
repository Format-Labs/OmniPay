import axios from "axios";
import { ethers } from "../utils/providers.js";
import { web3 } from "../utils/providers.js";
import { getAddressesBalances } from "eth-balance-checker/lib/ethers.js";
import { getAddressesBalances as getWeb3Balances } from "eth-balance-checker/lib/web3.js";
import { AddressBalanceMap } from "eth-balance-checker";
import getContractBalances from "./getContractBalances.js";

// const ethers = Ethers.getDefaultProvider();
const addresses = [
  // Binance hot wallet
  "0xfe9e8709d3215310075d67e3ed32a380ccf451c8",
  // Bitfinex hot wallet
  "0x742d35cc6634c0532925a3b844bc454e4438f44e",
  // Bittrex hot wallet
  "0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98",
  // Huobi hot wallet
  "0xdc76cd25977e0a5ae17155770273ad58648900d3",
  // Kraken hot wallet
  "0xe853c56864a2ebe4576a807d26fdc4a0ada51919",
];

async function getTokens(): Promise<string[]> {
  const response = await axios.get(
    "https://tokens.coingecko.com/uniswap/all.json"
  );
  const data = await response.data.tokens.map((token: any) => token.address);

  return data;
}

async function getBalances(): Promise<AddressBalanceMap> {
  const balances = await getAddressesBalances(
    ethers,
    addresses,
    await getTokens()
  );
  return balances;
}

async function getW3Balances(): Promise<AddressBalanceMap> {
  const balances = await getWeb3Balances(web3, addresses, await getTokens());
  return balances;
}
await getContractBalances(addresses, await getTokens());
await getW3Balances();
await getBalances();
