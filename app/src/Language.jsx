import React from "react";

import { translate } from "react-translate";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import available from "./i18n/available";

const Language = (props) => {
  const { t, language, onLanguageChange } = props;
  const handleLanguageChange = (e) => onLanguageChange(e.target.value);

  const filteredLanguages = available.reduce((languages, current) => {
    return !languages.find((item) => item.label === current.label)
      ? languages.concat([current])
      : languages;
  }, []);

  return (
    <>
      <h1 id="modal_heading">
        <FontAwesomeIcon icon={faLanguage} style={{ marginRight: ".5em" }} />
        {t("Language")}
      </h1>
      <>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="language"
            name="language"
            value={language}
            onChange={handleLanguageChange}
          >
            {filteredLanguages.map((ele, index) => (
              <FormControlLabel
                key={index}
                value={ele.key}
                control={<Radio />}
                label={ele.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </>
    </>
  );
};

export default translate("Language")(Language);
