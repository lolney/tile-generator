export interface Instruction {
  title: string;
  steps: Array<Instruction | React.ReactNode>;
}

export type OsString = "Mac" | "Windows";

export interface InstructionListProps {
  os: OsString;
  hideTitle?: boolean;
}

export type InstructionList = React.ComponentType<InstructionListProps>;
