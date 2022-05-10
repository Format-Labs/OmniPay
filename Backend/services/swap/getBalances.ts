import moralis from "moralis/node.js";
import dotenv from "dotenv";

dotenv.config();

const serverUrl = "https://ilbowaqswden.usemoralis.com:2053/server";
const appId = process.env.APP_ID;
const masterKey = process.env.MASTER_KEY;

interface IOptions {
  address: string;
}

const options: IOptions = {
  address: "0xfe9e8709d3215310075d67e3ed32a380ccf451c8",
};

const getBalances = async (options: IOptions) => {
  await moralis.start({ serverUrl, appId, masterKey });

  const balances = await moralis.Web3API.account.getTokenBalances(options);
  const tokenBalances = balances.map((balance) => {
    return {
      address: balance.token_address,
      balance: balance.balance,
    };
  });
  console.log(tokenBalances);
};

getBalances(options);
