export interface Instruction {
  title: string;
  steps: Array<Instruction | React.ReactNode>;
}
