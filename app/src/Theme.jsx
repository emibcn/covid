import React from "react";

import { translate } from "react-translate";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import ThemeIcon from "@material-ui/icons/Brightness4";
import DarkThemeIcon from "@material-ui/icons/Brightness2";
import LightThemeIcon from "@material-ui/icons/BrightnessHigh";

const iconStyles = {
  fontSize: "1.5rem",
  verticalAlign: "middle",
  marginRight: ".5em",
};
const themes = [
  {
    name: "Light",
    icon: <LightThemeIcon style={iconStyles} />,
    value: "light",
  },
  {
    name: "Dark",
    icon: <DarkThemeIcon style={iconStyles} />,
    value: "dark",
  },
];

const Theme = (props) => {
  const { t, theme, onThemeChange } = props;
  const handleThemeChange = (e) => onThemeChange(e.target.value);

  return (
    <>
      <h1 id="modal_heading">
        <ThemeIcon style={iconStyles} />
        {t("Theme")}
      </h1>
      <>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="theme"
            name="theme"
            value={theme}
            onChange={handleThemeChange}
          >
            {themes.map(({ name, icon, value }) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio />}
                label={
                  <>
                    {icon}
                    {t(name)}
                  </>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </>
    </>
  );
};

export default translate("Theme")(Theme);
