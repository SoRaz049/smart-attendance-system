import React from "react";

const FullWidthWrapper = ({
  children,
  className = "", // Provide a default value for className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`container mx-auto w-full p-4 ${className}`}>
      {children}
    </div>
  );
};

export default FullWidthWrapper;
