import { AddressBalanceMap } from "eth-balance-checker";
import { getAddressesBalances as getWeb3Balances } from "eth-balance-checker/lib/web3.js";

import { web3, ethers } from "../utils/providers.js";

async function getContractBalances(
  addresses: string[],
  tokens: string[]
): Promise<AddressBalanceMap> {
  let balances;
  balances = await getWeb3Balances(web3, addresses, tokens);
  return balances;
}

export default getContractBalances;
