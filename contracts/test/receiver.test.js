const { expect } = require("chai");

describe("Receiver", function () {
  let token, token2, receiver;

  beforeEach(async () => {
    const supply = ethers.utils.parseEther("1000000");
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(supply);

    const Token2 = await ethers.getContractFactory("Token2");
    token2 = await Token2.deploy(supply);

    const Receiver = await ethers.getContractFactory("Receiver");
    receiver = await Receiver.deploy(
      "0xE592427A0AEce92De3Edee1F18E0157C05861564"
    );
  });

  it("Should accept Token deposits", async function () {
    await token.approve(receiver.address, 10000);
    await receiver.deposit(
      "0x6b6576696e000000000000000000000000000000000000000000000000000000",
      token.address,
      10000
    );

    await token2.approve(receiver.address, 10000);
    await receiver.deposit(
      "0x4d61676769650000000000000000000000000000000000000000000000000000",
      token2.address,
      10000
    );

    expect(await token.balanceOf(receiver.address)).to.equal(10000);
    console.log(
      `Receriver balance: ${await token.balanceOf(receiver.address)}`
    );

    expect(await token2.balanceOf(receiver.address)).to.equal(10000);
    console.log(
      `Receriver Token2 balance: ${await token2.balanceOf(receiver.address)}`
    );

    const deposits = await receiver.getDeposits(
      "0x6b6576696e000000000000000000000000000000000000000000000000000000"
    );
    const deposits2 = await receiver.getDeposits(
      "0x4d61676769650000000000000000000000000000000000000000000000000000"
    );
    console.log(`Deposits: ${deposits}`);
    console.log(`Deposits2: ${deposits2}`);

    const balances = await receiver.getBalance(token.address);
    const balances2 = await receiver.getBalance(token2.address);
    console.log(`Balances: ${balances}`);
    console.log(`Balances2: ${balances2}`);
  });
});
