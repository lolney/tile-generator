import React from "react";
import { Instruction, OsString, InstructionListProps } from "./types";
import PathInstruction from "./PathInstruction";
import BaseInstructionList from "./Base";

export const paths = {
  Mac: "~/Library/Application Support/Sid Meier's Civilization 5/Maps",
  Windows: `Program Files (x86)/Steam/SteamApps/Common/Sid Meier’s Civilization V/Assets/Maps`,
};

const civVHelpText = (os: OsString, path: string): Instruction => ({
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
        `Create a game via "Single Player" -> "Set Up
          Game"`,
        `Select "Map Type" -> "Additional Maps"`,
        `Select the map with the name of the file you downloaded, by
          default "TileBuilder"`,
      ],
    },
  ],
});

export default ({ os, hideTitle }: InstructionListProps) => (
  <BaseInstructionList
    hideTitle={hideTitle}
    instruction={civVHelpText(os, paths[os])}
  />
);
