import React from "react";
import { Instruction } from "./types";
import PathInstruction from "./PathInstruction";
import BaseInstructionList from "./Base";

export const paths = {
  Mac: "~/Library/Application Support/Sid Meier's Civilization 5/Maps",
  Windows: `Program Files (x86)/Steam/SteamAp@tile-generator/common"
};

const civVHelpText = (os: "Mac" | "Windows", path: string): Instruction => ({
  title: "Civilization V",
  steps: [
    {
      title: "Install your map",
      steps: [
        "Install by putting the map in the Civ 5 Maps folder",
        <PathInstruction {...{ os, path }} />,
      ],
    },
    {
      title: "Play your map",
      steps: [
        `From the main menu, create a game via "Single Player" -> "Set Up
          Game"`,
        `Select "Map Type" -> "Additional Maps"`,
        `Select the map with the name of the file you downloaded, by
          default "TileBuilder"`,
      ],
    },
  ],
});

export default ({
  os,
  hideTitle,
}: {
  os: keyof typeof paths;
  hideTitle?: boolean;
}) => (
  <BaseInstructionList
    hideTitle={hideTitle}
    instruction={civVHelpText(os, paths[os])}
  />
);
