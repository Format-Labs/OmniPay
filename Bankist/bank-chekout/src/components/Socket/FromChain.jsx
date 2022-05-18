function FromChain({ getChains, selectedChain, setChainIcon }) {
  const handleSelect = function (e) {
    selectedChain(e.target.value);
  };

  return (
    <div className="p-1 bg-gray-600 rounded-md outline-none">
      <label
        kind="caption/reg"
        htmlFor="chainId"
        color="currentColor"
        className="text-xl text-gray-300"
      >
        From
      </label>

      <div className="flex justify-between">
        <img
          className="w-8 h-8 mr-1 rounded-full"
          src={setChainIcon?.icon}
          alt="to"
        />
        <select
          onChange={(e) => handleSelect(e)}
          className="relative w-full py-2 pl-3 pr-10 ml-1 text-left text-white bg-gray-900 rounded-lg shadow-md outline-none cursor-default sm:text-sm"
        >
          <div></div>
          {getChains.map((chain) => (
            <option className="w-28" value={chain.chainId} key={chain.chainId}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FromChain;
