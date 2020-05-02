import * as colors from "../../constants/colors";

const tabStyle = ({ $active, $disabled, $theme }: any) => ({
  outlineColor: colors.textColorWhite,
  borderBottomColor: "#4d90e6",
  color: $active ? $theme.colors.mono100 : colors.textColorWhite,
  ":hover": $disabled
    ? {}
    : {
        color: $theme.colors.mono100,
      },
  ":focus": $disabled
    ? {}
    : {
        color: $theme.colors.mono100,
      },
});

export default tabStyle;
