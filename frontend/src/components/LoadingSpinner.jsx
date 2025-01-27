import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
        <div className="mt-4 text-center text-white font-medium">
          Please wait...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
