import React from "react";
import { useVersion } from "@/hooks/useVersion";

const VersionInfo: React.FC = () => {
  const { versionInfo, loading, error } = useVersion();
  if (loading || error || !versionInfo) return null;
  return (
    <a
      href="https://github.com/andreslopezco/portfolio"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors"
      aria-label="Ver código fuente en GitHub"
    >
      {versionInfo.version}
    </a>
  );
};

export default VersionInfo;
