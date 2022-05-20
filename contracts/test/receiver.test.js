const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payments", function () {
  beforeEach(async function () {
    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];

    // use this chainId
    this.chainIdSrc = 1;
    this.chainIdDst = 2;

    // create a LayerZero Endpoint mock for testing
    const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock");
    this.layerZeroEndpointMockSrc = await LZEndpointMock.deploy(
      this.chainIdSrc
    );
    this.layerZeroEndpointMockDst = await LZEndpointMock.deploy(
      this.chainIdDst
    );
    this.mockEstimatedNativeFee = ethers.utils.parseEther("0.001");
    this.mockEstimatedZroFee = ethers.utils.parseEther("0.00025");
    this.supply = ethers.utils.parseEther("1000000000");
    await this.layerZeroEndpointMockSrc.setEstimatedFees(
      this.mockEstimatedNativeFee,
      this.mockEstimatedZroFee
    );
    await this.layerZeroEndpointMockDst.setEstimatedFees(
      this.mockEstimatedNativeFee,
      this.mockEstimatedZroFee
    );

    // Create Receive and settler contracts
    const Receiver = await ethers.getContractFactory("Receiver");
    this.receiver = await Receiver.deploy(
      "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      this.layerZeroEndpointMockSrc.address,
      this.layerZeroEndpointMockSrc.address
    );
    const Settler = await ethers.getContractFactory("Settler");
    this.settler = await Settler.deploy(
      this.layerZeroEndpointMockDst.address,
      this.layerZeroEndpointMockDst.address,
      "0xE592427A0AEce92De3Edee1F18E0157C05861564"
    );

    const Token = await ethers.getContractFactory("Token");
    this.token = await Token.deploy(this.supply);

    await this.owner.sendTransaction({
      to: this.receiver.address,
      value: ethers.utils.parseEther("10"),
    });
    await this.owner.sendTransaction({
      to: this.settler.address,
      value: ethers.utils.parseEther("10"),
    });

    // Set the source endpoint to the receive contract
    await this.layerZeroEndpointMockSrc.setDestLzEndpoint(
      this.settler.address,
      this.layerZeroEndpointMockDst.address
    );
    // Set the destination endpoint to the settler contract
    await this.layerZeroEndpointMockDst.setDestLzEndpoint(
      this.receiver.address,
      this.layerZeroEndpointMockSrc.address
    );

    // Set each contract source address so it can send to each other
    await this.receiver.setTrustedRemote(this.chainIdDst, this.settler.address);
    await this.settler.setTrustedRemote(this.chainIdSrc, this.receiver.address);
  });

  it("should send a payment from the source to the destination", async function () {});
});
