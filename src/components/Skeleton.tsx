import React from "react";

interface SkeletonProps {
  className?: string;
  dark?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", dark = false }) => {
  return (
    <div
      className={`animate-pulse rounded ${
        dark ? "bg-white/10" : "bg-black/10"
      } ${className}`}
    />
  );
};

export default Skeleton;
