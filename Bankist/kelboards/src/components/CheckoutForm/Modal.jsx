import React from "react";

// import { AiOutlineClose } from "react-icons/ai";
import Payments from "./Payments";

function Modal({ amount }) {
  return (
    // <div>
    <div style={{ backgroundColor: "#eaebee", borderRadius: "10px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          borderRadius: "10px",
        }}
      >
        <div>
          <h1
            className="m-4 font-sans font-bold tracking-wide text-black text-white-100 "
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "black",
              letterSpacing: "0.025rem",
              margin: "10px",
            }}
          >
            <span
              className="font-thin"
              style={{ fontSize: "0.8rem", fontWeight: "bold" }}
            >
              Powered by{" "}
            </span>
            OmniPe
          </h1>
        </div>
        <Payments amount={amount} />
      </div>
    </div>
  );
}

export default Modal;
