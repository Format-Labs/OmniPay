const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", function () {
  it("Deployment should asign the total supply of tokens to the owner", async function () {
    const supply = ethers.utils.parseEther("1000000");
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(supply);

    const ownerBalancer = await token.balanceOf(owner.address);
    expect(await ownerBalancer).to.equal(supply);
  });
});
