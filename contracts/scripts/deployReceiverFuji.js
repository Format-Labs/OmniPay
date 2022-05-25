const hre = require("hardhat");

async function main() {
  // gets info of the account used to deploy
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log(
    "------------------------ Deploying to Fuji ------------------------\n"
  );

  console.log("Deploying contract with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());
  // We get the contract to deploy
  const Receiver = await hre.ethers.getContractFactory("Receiver");
  const receiver = await Receiver.deploy(
    "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    "0x13093E05Eb890dfA6DacecBdE51d24DabAb2Faa1",
    "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706"
  );

  await deployer.sendTransaction({
    to: receiver.address,
    value: ethers.utils.parseEther("2"),
  });

  console.log("Receiver deployed to:", receiver.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
