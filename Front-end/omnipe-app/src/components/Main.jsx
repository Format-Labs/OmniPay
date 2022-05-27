import { useContext } from "react";
// import Image from "next/image";
import { RiSettings3Fill } from "react-icons/ri";
import { TransactionContext } from "../context/GContext";

const style = {
  wrapper: `w-screen flex items-center justify-center mt-14`,
  content: `bg-gradient-to-r from-cyan-900 to-blue-900 w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

const Main = () => {
  const { handleSubmit, handleChange } = useContext(TransactionContext);
  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Create Account</div>
          <div>
            <RiSettings3Fill />
          </div>
        </div>
        <div>Account Address</div>

        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            placeholder="0x..."
            onChange={(e) => handleChange(e, "address")}
          />
          <div className={style.currencySelector}></div>
        </div>
        <div className="mt-2">Settlement Token Address</div>

        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            placeholder="0x..."
            onChange={(e) => handleChange(e, "settlementToken")}
          />
          <div className={style.currencySelector}></div>
        </div>
        <div onClick={(e) => handleSubmit(e)} className={style.confirmButton}>
          Confirm
        </div>
      </div>
    </div>
  );
};

export default Main;
