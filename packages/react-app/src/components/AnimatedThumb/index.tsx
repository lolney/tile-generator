import React, { useEffect, useState } from "react";
import { usePrevious } from "react-use";
import { useSelector } from "react-redux";
import { useStyletron } from "baseui";
import * as colors from "../../constants/colors";
import { State } from "../../redux/types";
import styles from "./styles.module.css";

interface AnimatedThumbProps {
  style?: any;
  zIndex?: number;
}

const AnimatedThumb: React.FC<AnimatedThumbProps> = ({
  style = {},
  zIndex = 1,
}) => {
  const [css, theme] = useStyletron();

  const isDirty = useSelector((state: State) => state.settings.dirty);
  const wasDirty = usePrevious(isDirty);

  const [animation, setAnimation] = useState<string>();

  useEffect(() => {
    if (!isDirty && wasDirty) {
      const duration = 400;
      setAnimation(`${styles.rotateShake} ${duration}ms`);
      setTimeout(() => {
        setAnimation(undefined);
      }, duration);
    }
  }, [isDirty, wasDirty]);

  return (
    <div className={css({ zIndex, position: "absolute" })}>
      <div
        className={css({
          height: "18px",
          width: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderStyle: "solid",
          borderWidth: "3px",
          borderColor: "#ccc",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          borderBottomLeftRadius: "4px",
          borderBottomRightRadius: "4px",
          backgroundColor: colors.textColorWhite,
          ...style,
          animation,
        })}
      ></div>
    </div>
  );
};

export default AnimatedThumb;
