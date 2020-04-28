import React from "react";
import { Instruction } from "./types";
import styles from "./styles.module.css";

interface InstructionListProps {
  instruction: Instruction;
  hideTitle?: boolean;
  level?: number;
}

const Step: React.FC<{
  step: Instruction | React.ReactNode;
  level: number;
}> = ({ step, level }) =>
  React.isValidElement(step) || typeof step === "string" ? (
    <>{step}</>
  ) : (
    <BaseInstructionList instruction={step as Instruction} level={level + 1} />
  );

const BaseInstructionList: React.FC<InstructionListProps> = ({
  instruction: { title, steps },
  hideTitle,
  level = 0,
}) => {
  const ListType = level === 0 ? "ol" : "ul";
  const HeaderType = level === 0 ? "h1" : "h3";
  return (
    <>
      {!hideTitle && <HeaderType className={styles.header}>{title}</HeaderType>}
      <ListType>
        {steps.map((step, i) => (
          <li key={i} className={styles.instructionList}>
            <Step step={step} level={level} />
          </li>
        ))}
      </ListType>
    </>
  );
};

export default BaseInstructionList;
