// import bigNumber from ethers
const BN = require("bn.js");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Uniswap", function () {
  it("Should perform swaps", async function () {
    const [owner, alice, bob] = await ethers.getSigners();
    const DAI = 0x6b175474e89094c44da98b954eedeac495271d0f;
    const DAI_WHALE = 0x5d38b4e4783e34e2301a2a36c39a03c45798c4dd;
    const WBTC = 0x2260fac5e5542a773aa44fbcfedf7c193bc2c599;

    const WHALE = DAI_WHALE;
    const AMOUNT_IN = new BN(10).pow(new BN(18)).mul(new BN(1000000)); //1,000,00 DAI
    const AMOUNT_OUT_MIN = 1;
    const TOKEN_IN = DAI;
    const TOKEN_OUT = WBTC;
    const TO = owner;

    // Test swaps
    it("Should swap", async function () {
      const tokenIn = await IERC20.at(TOKEN_IN);
      const tokenOut = await IERC20.at(TOKEN_OUT);

      const TestUniswap = await ethers.getContractFactory("TestUniswap");
      const testUniswap = await TestUniswap.deploy();
      await testUniswap.deployed();

      const swap = await testUniswap.swap(
        tokenIn.address,
        tokenOut.address,
        AMOUNT_IN,
        AMOUNT_OUT_MIN,
        TO,
        {
          from: WHALE,
        }
      );
      console.log(`out : ${await tokenOut.balanceOf(TO)}`);
      expect(await tokenOut.balanceOf(TO)).to.equal(AMOUNT_OUT_MIN);
    });
  });
});
