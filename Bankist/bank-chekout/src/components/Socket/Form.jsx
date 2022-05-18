import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";

import FromChain from "./FromChain";
import TokensFrom from "./TokensFrom";
import TokensTo from "./TokensTo";
import TransactionDetails from "./TransactionDetails";
import TransactionType from "./TransactionType";
import ToChain from "./ToChain";

function Form() {
  const [chains, setChains] = useState([]);
  const [fromChain, setFromChain] = useState(1);
  const [toChain, setToChain] = useState(1);

  async function getChains() {
    const chains = await axios.get(
      "https://backend.movr.network/v2/supported/chains",
      {
        headers: {
          "API-KEY": `${process.env.REACT_APP_API_KEY}`,
        },
      }
    );
    setChains(chains.data.result);
  }

  useEffect(() => {
    getChains();
  }, []);
  const toChains = chains.filter((chain) => chain.chainId !== +fromChain);
  const theChainIcon = chains.find((chain) => chain.chainId === +fromChain);
  const theToChainIcon = toChains.find((chain) => chain.chainId === +toChain);

  console.log(fromChain);
  console.log(toChain);
  console.log(theChainIcon);

  return (
    <div>
      <form>
        <div className="grid items-center gap-3 mt-0 grid-cols-30">
          <FromChain
            getChains={chains}
            selectedChain={setFromChain}
            setChainIcon={theChainIcon}
          />
          <AiOutlineArrowRight className="relative my-10 ml-3 text-3xl font-bold bg-gray-500 border border-transparent rounded-md outline-none text-white-100 " />
          <ToChain
            getChains={toChains}
            selectedChain={setToChain}
            setChainIcon={theToChainIcon}
          />
        </div>

        {/* Amount and token to send */}
        <div className="mb-3">
          <TokensTo />
        </div>

        {/* Estimated Amount in destination chain */}
        <div className="mb-3">
          <TokensFrom />
        </div>

        {/* Transaction type */}
        <div className="flex justify-center ">
          <TransactionType />
        </div>
        {/* Transaction details */}
        <TransactionDetails />
        {/* Submit Transaction */}
        <div className="flex justify-center mt-2">
          <button className="w-40 p-3 text-xl font-bold bg-blue-600 rounded-lg text-white-100">
            Transfer
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
