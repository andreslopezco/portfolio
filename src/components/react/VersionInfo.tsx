import React from "react";
import { useVersion } from "@/hooks/useVersion";

const VersionInfo: React.FC = () => {
  const { versionInfo, loading, error } = useVersion();
  if (loading || error || !versionInfo) return null;
  return (
    <span
      className="text-xs text-foreground/70 hover:text-foreground transition-colors"
    >
      {versionInfo.version}
    </span>
  );
};

export default VersionInfo;