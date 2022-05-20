require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("xdeployer");

require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",

  networks: {
    hardhat: {},
    rinkeby: {
      url: process.env.ETH_RINKEBY_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    fuji: {
      url: process.env.FUJI_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    mumbai: {
      url: process.env.MUMBAI_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  xdeploy: {
    contract: "Receiver",
    constructorArgsPath: "../deploy-args.js",
    salt: process.env.SALT,
    signer: process.env.PRIVATE_KEY,
    networks: ["rinkeby", "optimismTestnet", "fuji"],
    rpcUrls: [
      process.env.ETH_RINKEBY_TESTNET_URL,
      process.env.MUMBAI_TESTNET_URL,
      process.env.FUJI_TESTNET_URL,
    ],
    gasLimit: 1.6 * 10 ** 6,
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYSCAN_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY,
      avalancheFujiTestnet: process.env.FUJISCAN_API_KEY,
    },
  },
};
