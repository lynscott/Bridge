import React from "react";
import PageWrapper from "../components/PageWrapper";

const Settings: React.FC = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p>Update your preferences here.</p>
      </div>
    </PageWrapper>
  );
};

export default Settings;
