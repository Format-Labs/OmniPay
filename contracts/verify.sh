#!/bin/sh
npx hardhat verify --constructor-args RinkebyDeployArgs.js 0x1204eEC14363B4D78211aDb845BCA5692f243dcf --network rinkeby
npx hardhat verify --constructor-args FujiDeployArgs.js 0xDAc24DcF66F570279d6a0B96cBdD593f918ef772 --network fuji