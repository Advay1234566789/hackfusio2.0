import React from "react";

export function LampContainer({ children }) {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-500 opacity-50 blur-2xl" />
      {children}
    </div>
  );
}
