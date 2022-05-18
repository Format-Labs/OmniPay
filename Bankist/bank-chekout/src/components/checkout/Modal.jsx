import React from "react";

import { AiOutlineClose } from "react-icons/ai";
import Form from "../Socket/Form";

function Modal() {
  return (
    <div style={{ height: "100vh", backgroundColor: "#10000e0" }}>
      <div
        style={{ height: "100vh", backgroundColor: "#10000e0" }}
        className="flex flex-col items-center font-sans align-middle bg-gray-900 "
      >
        <div
          className="fixed flex items-center justify-center Background backdrop-blur-sm bg-white-100/10 opacity-2"
          style={{ height: "100vh", width: "100vw" }}
        >
          <div
            className="flex flex-col p-6 text-white bg-gray-800 border border-transparent rounded-md shadow-lg outline-none modalContainer shadow-purple-101 "
            style={{ height: "600px", width: "500px" }}
          >
            <div className="flex justify-between ">
              <h1 className="m-4 font-sans font-bold tracking-wide text-white-100 ">
                <span className="font-thin">Powerd by </span>
                OmniPay
              </h1>
              <button className="flex justify-end p-1 font-bold text-white border border-none rounded-md outline-none cursor-pointer bg-">
                <AiOutlineClose size="2em" />
              </button>
            </div>
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
