#!/bin/sh
npx hardhat verify --constructor-args RinkebyDeployArgs.js 0x1204eEC14363B4D78211aDb845BCA5692f243dcf --network rinkeby
npx hardhat verify --constructor-args FujiDeployArgs.js 0xfA05D3DaD3ffAB0Ae73F6A122CBFAa7f88e2574C --network fuji