import React from "react";
import PathInstruction from "./PathInstruction";
import { Instruction, OsString, InstructionListProps } from "./types";
import BaseInstructionList from "./Base";

export const paths = {
  Mac:
    "~/Library/Application Support/Sid Meier's CivilizationVI/Saves/WorldBuilder",
  Windows: `Documents/My Games/Sid Meier's CivilizationVI/Saves/WorldBuilder`,
};

const civ6HelpText = (os: OsString, path: string): Instruction => ({
  title: "Civilization VI",
  steps: [
    {
      title: "Install your map",
      steps: [
        "Install by putting the map in the Civ 6 WorldBuilder folder",
        <PathInstruction {...{ os, path }} />,
      ],
    },
    {
      title: "Play your map",
      steps: [
        `Create a game with "Create Game"`,
        `In the setup screen, click the map type under "Choose a Map" to open the map selector`,
        `Find your map under "Worldbuilder Maps"`,
      ],
    },
  ],
});

export default ({ os, hideTitle }: InstructionListProps) => (
  <BaseInstructionList
    hideTitle={hideTitle}
    instruction={civ6HelpText(os, paths[os])}
  />
);
