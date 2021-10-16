import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-translate'

import { FormDecorators } from '../Common'
import DatasetSelector from './EditDataset'

/*
   Renders the edit form for the BCN widget
*/
const Edit = ({ dataset, t, onChangeDataset }) => (
  <div style={{ textAlign: 'left' }}>
    <FormDecorators id='sections-tree' label={t('Select the dataset')} fixTree>
      <DatasetSelector value={dataset} onChange={onChangeDataset} />
    </FormDecorators>
  </div>
)

Edit.propTypes = {
  dataset: PropTypes.string.isRequired,
  onChangeDataset: PropTypes.func.isRequired
}

export default translate('Widget/Bcn/Edit')(Edit)
