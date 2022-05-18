import React from "react";
// import { useState } from "react";
import Form from "./Form";
import { AiOutlineClose } from "react-icons/ai";

function Modal() {
  return (
    <div
      className="fixed flex items-center justify-center Background backdrop-blur-sm bg-white-100/10 opacity-2"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div
        className="flex flex-col p-6 text-white bg-gray-800 border border-transparent rounded-md shadow-lg outline-none modalContainer shadow-purple-101 "
        style={{ height: "600px", width: "500px" }}
      >
        <div className="flex justify-between ">
          <h1 className="m-4 tracking-wide text-white-100 ">
            Powerd by s
            <span className="outline-none rounded-md font-bold px-0.5  bg-purple-101">
              OC
            </span>
            ket
          </h1>
          <button className="flex justify-end p-1 font-bold text-white border border-none rounded-md outline-none cursor-pointer bg-">
            <AiOutlineClose size="2em" />
          </button>
        </div>
        {/* Form */}
        <Form />
      </div>
    </div>
  );
}

export default Modal;
