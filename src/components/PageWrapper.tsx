import React from "react";
import { LoadingScreen } from "./LoadingSpinner";

interface PageWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  loading = false,
}) => {
  return (
    <div className="min-h-screen relative">
      {loading ? <LoadingScreen fullScreen={false} /> : children}
    </div>
  );
};

export default PageWrapper;
