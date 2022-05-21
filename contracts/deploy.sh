#!/bin/sh

# npx hardhat run ./scripts/deploySettlerMumbai.js  --network mumbai
npx hardhat run ./scripts/deploySettler.js  --network rinkeby
npx hardhat run ./scripts/deployReceiverFuji.js  --network fuji