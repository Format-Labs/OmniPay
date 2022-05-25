const hre = require("hardhat");

async function main() {
  // gets info of the account used to deploy
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log(
    "------------------------ Deploying to Mumbai ------------------------\n"
  );

  console.log("Deploying contract with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());
  // We get the contract to deploy
  const Settler = await hre.ethers.getContractFactory("Settler");
  const settler = await Settler.deploy(
    "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
    "0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7"
  );

  await settler.deployed();

  await deployer.sendTransaction({
    to: settler.address,
    value: ethers.utils.parseEther("1"),
  });

  console.log("Settler deployed to:", settler.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
