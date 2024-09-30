import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-grow p-4 bg-gray-900 text-white overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;
