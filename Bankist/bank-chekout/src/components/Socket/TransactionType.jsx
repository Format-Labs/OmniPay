import React from "react";

const TransactionType = () => {
  return (
    <div className="inline-flex overflow-hidden shadow-lg rounded-xl shadow-gray-800 ">
      <input
        type="radio"
        value="fast"
        name="fastPath"
        id="fastPath"
        className="hidden"
      />
      <label
        htmlFor="fastPath"
        className="py-2 px-3.5 text-sm font-sans text-white-100 bg-gray-600 cursor-pointer border-r-2 border-black rounded-sm"
      >
        Fastest
      </label>
      <input
        type="radio"
        value="cheap"
        name="cheapPath"
        id="cheapPath"
        className="hidden"
      />
      <label
        htmlFor="cheapPath"
        className="py-2 px-3.5 text-sm font-sans text-white-100 bg-gray-600 cursor-pointer border-r-2 border-black rounded-sm"
      >
        Cheapest
      </label>
      <input
        type="radio"
        value="high"
        name="highestPath"
        id="highPath"
        className="hidden"
      />
      <label
        htmlFor="highPath"
        className="py-2 px-3.5 text-sm font-sans text-white-100 bg-gray-600 cursor-pointer  rounded-sm"
      >
        High Returns
      </label>
    </div>
  );
};

export default TransactionType;
