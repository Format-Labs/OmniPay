import React from "react";

const TransactionDetails = () => {
  return (
    <div className="px-1 pr-2 mt-4 text-lg bg-gray-500 border-transparent rounded-md outline-none text-white-100">
      {/* bridge */}
      <div className="flex justify-between">
        <div>Bridge</div>
        <div>-Hyphen network</div>
      </div>
      {/* Time */}
      <div className="flex justify-between">
        <div>Bridging time</div>
        <div>10 mins</div>
      </div>
      {/* Bridge Fee */}
      <div className="flex justify-between">
        <div>Bridge Fee</div>
        <div>$0.9</div>
      </div>
      {/* Network Fee */}
      <div className="flex justify-between">
        <div>Network Fee</div>
        <div>$30.01</div>
      </div>
    </div>
  );
};

export default TransactionDetails;
