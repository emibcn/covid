import React from 'react';

import { translate } from 'react-translate'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInfoCircle as faAbout,
} from '@fortawesome/free-solid-svg-icons'

class About extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <>
        <h1 id="modal_heading">
          <FontAwesomeIcon icon={ faAbout } style={{ marginRight: '.5em' }} />
          { t("About...") }
        </h1>
        <div id="modal_description" style={{ textAlign: 'left' }}>
          <p>
            { t("This applications displays public information extracted from the official web") }{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://dadescovid.cat">https://dadescovid.cat</a>
            .
          </p>
          <p>
            { t("The aim of this application is to display the data in different ways than the original, improving performance and adding more value to it.") }
          </p>

          <h3>{ t("Want more information?") }</h3>
          <p><a target='_blank' rel="noopener noreferrer" href='https://github.com/emibcn/covid'>{ t("The source code is publicly available.") }</a>{' '}
          { t("There, you can find more information about how it has been done, licence and credits.") }</p>

          <h3>{ t("Found a bug? Have a petition? Want to help somehow?") }</h3>
          <p><a target='_blank' rel="noopener noreferrer" href='https://github.com/emibcn/covid/issues'>{ t("Create an issue at GitHub.") }</a></p>

          <h3>{ t("Licenses") }</h3>
          <p>
            { t("The application, scripts and documentation in") }{' '}
            <a target='_blank' rel="noopener noreferrer" href='https://github.com/emibcn/covid'>{ t("this project") }</a>{' '}
            { t("are released under the") }{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/emibcn/covid/blob/master/LICENSE">GNU General Public License v3.0</a>
            .
          </p>
          <p>
            { t("The scripts and documentation published in") }{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/emibcn/covid-data/">covid-data</a>{' '}
            { t("are also released under the") }{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/emibcn/covid/blob/master/LICENSE">GNU General Public License v3.0</a>
            .
          </p>
          <p>
            { t("The data scrapped and published in") }{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/emibcn/covid-data/">covid-data</a>{' '}
            { t("is licensed by their owner, the") }{' '}<em>Generalitat de Catalunya</em>
            { t(", under their own conditions (") }
            <a target="_blank" rel="noopener noreferrer" href="http://opendatacommons.org/licenses/by/1.0/">Open Data Commons Attribution License</a>
            { t(", until now).") }{' '}
            { t("See more at the") }{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://analisi.transparenciacatalunya.cat/Salut/Dades-setmanals-de-COVID-19-per-comarca/jvut-jxu8">{ t("dataset API documentation") }</a>
            .
          </p>

        </div>
      </>
    )
  }
}

export default translate('About')(About);
