const hre = require("hardhat");

async function main() {
  // gets info of the account used to deploy
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log(
    "------------------------ Deploying to Rinkeby ------------------------\n"
  );

  console.log("Deploying contract with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const Settler = await hre.ethers.getContractFactory("Settler");
  const settler = await Settler.deploy(
    "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA",
    "0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4"
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
