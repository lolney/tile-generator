import React from "react";

interface PathInstructionProps {
  os: "Mac" | "Windows";
  path: string;
}

const PathInstruction: React.FC<PathInstructionProps> = ({ os, path }) =>
  os === "Mac" ? (
    <>
      To find it in Finder, hold Command-Shift-G to open the "Go to Folder..."
      menu, then enter:
      <em> {path}</em>
    </>
  ) : (
    <>
      To find this folder, open File Explorer and navigate to: <em>{path}</em>
    </>
  );

export default PathInstruction;
