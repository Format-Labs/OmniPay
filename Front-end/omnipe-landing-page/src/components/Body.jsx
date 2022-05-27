import React from "react";

const Body = () => {
  return (
    <div className="h-screen bg-gradient-to-bl from-cyan-700 to-blue-800">
      <div className="flex flex-col items-center justify-center h-full p-20 ">
        <h1 className="m-1 text-5xl font-bold text-center text-white ">
          Powering the next generation of commerce and global payments
        </h1>

        <div className="text-xl text-center text-white">
          <p>Accept payments from all chains without any Hustle</p>
          <p className="font-mono font-bold text-center text-green-500">
            <i>create once accept everywhere</i>
          </p>
        </div>
      </div>
      <div className="h-screen bg-gradient-to-tl from-blue-700 to-cyan-800">
        <div className="flex flex-col items-center justify-center h-full p-20 ">
          <h1 className="m-1 text-5xl font-bold text-center text-white ">
            What is OmniPe?
          </h1>
          <div className="text-xl text-center text-white">
            <p>
              OmniPe is a cross-chain payments protocol that enables merchants
              and users to accept and do payments from all the major blockchains
              without any hustle.
            </p>
          </div>
          <h1 className="mt-20 text-2xl font-bold text-center text-white ">
            How does it work?
          </h1>
          <div className="text-xl text-center text-white">
            <p>
              OmniPe leverages the power of messaging protocols, decentralized
              exchanges and bridges to enable payments from any chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
