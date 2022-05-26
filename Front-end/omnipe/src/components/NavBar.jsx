import React from "react";

const NavBar = () => {
  return (
    <nav className="fixed top-0 flex items-center justify-between w-full p-6 bg-gradient-to-bl from-gray-900 to-blue-900">
      <div className="flex items-center flex-shrink-0 mr-6 text-white">
        <span className="text-xl font-semibold tracking-tight">Omnipe</span>
      </div>

      <div>
        <a
          href="#1"
          className="inline-block px-4 py-2 mt-4 text-sm leading-none text-white border border-white rounded hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0"
        >
          Open App
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
