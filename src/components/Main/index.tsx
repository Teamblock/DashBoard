import React from "react";

const Main = ({ children }) => (
  <main className="flex flex-col items-center justify-start flex-grow w-full h-full min-h-[60vh] bg-[#1a202e]">
    {children}
  </main>
);
export default Main;
