const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log(
    "------------------------ Deploying to Rinkeby ------------------------\n"
  );

  console.log("Deploying contract with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());
  // We get the contract to deploy
  const Receiver = await hre.ethers.getContractFactory("Receiver");
  const receiver = await Receiver.deploy(
    "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    "0x82A0F5F531F9ce0df1DF5619f74a0d3fA31FF561",
    "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA"
  );

  await deployer.sendTransaction({
    to: receiver.address,
    value: ethers.utils.parseEther("4"),
  });

  await receiver.deployed();

  console.log("Receiver deployed to:", receiver.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
