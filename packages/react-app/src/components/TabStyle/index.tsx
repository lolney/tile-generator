import * as colors from "../../constants/colors";

const tabStyle = ({ $active, $disabled, $theme }: any) => ({
  outlineColor: colors.textColorWhite,
  borderBottomColor: "#4d90e6",
  fontWeight: 600,
  color: $active ? colors.textColorWhite : "#d6d6d6",
  ":hover": $disabled
    ? {}
    : {
        color: colors.textColorWhite,
      },
  ":focus": $disabled
    ? {}
    : {
        color: colors.textColorWhite,
      },
});

export default tabStyle;
