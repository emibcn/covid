import React from 'react';
import PropTypes from 'prop-types';

import { translate } from 'react-translate'

import Divider from '@material-ui/core/Divider';

import {FormDecorators, Selector} from '../Common';
import DatasetSelector from './EditDataset';

/*
   Renders the edit form for the Map widget
*/
class Edit extends React.PureComponent {

  onChangeDataset = (value) => this.props.onChangeDataset(value);

  render() {
    const {
      dataset,
      bcnIndex,
      t
    } = this.props;

    return (
      <div style={{ textAlign: 'left' }}>
        <FormDecorators
          id={ 'sections-tree' }
          label={ t("Select the dataset") }
          fixTree
        >
          <DatasetSelector
            bcnIndex={ bcnIndex }
            value={ dataset }
            onChange={ this.onChangeDataset }
          />
        </FormDecorators>
      </div>
    )
  }
}

Edit.propTypes = {
  dataset: PropTypes.string.isRequired,
  bcnIndex: PropTypes.array.isRequired,
  onChangeDataset: PropTypes.func.isRequired,
  onChangeSection: PropTypes.func.isRequired,
};

export default translate('Widget/Bcn/Edit')(Edit);
