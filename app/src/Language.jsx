import React from "react";

import { translate } from "react-translate";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import available from "./i18n/available";

class Language extends React.Component {
  render() {
    const { t, language, onLanguageChange } = this.props;
    console.log(this.props);
    return (
      <>
        <h1 id="modal_heading">
          <FontAwesomeIcon icon={faLanguage} style={{ marginRight: ".5em" }} />
          {t("Language")}
        </h1>
        <div>
          {Object.keys(available).map((key) => (
            <>
              <input
                type="radio"
                id="language"
                name="language"
                value={language}
              />
              <label for="language">{key}</label>
              <br />
            </>
          ))}
        </div>
      </>
    );
  }
}

export default translate("Language")(Language);
