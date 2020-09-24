import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';

import MapData from '../../Backend/Maps';

// UI-Material Styles
const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


// Renders a Select, with options from props
const Selector = (props) => {
  const classes = useStyles();
  const { label, help, id, options, ...restProps } = props;
  return (
    <div style={{ 
      margin: '0 auto',
      display: 'block',
    }}>
      <FormControl required className={ classes.formControl }>
        <InputLabel htmlFor={ id }>{ label }</InputLabel>
        <Select
          native
          { ...restProps }
          aria-describedby={ `helper-text-${id}` }
          inputProps={{
            name: label,
            id: id,
          }}
        >
          { options.map( option => (
            <option key={ `v_${option.value}` } value={ option.value }>{ option.label }</option>
          )) }
        </Select>
        { help ? (
            <FormHelperText id={ `helper-text-${id}` }>
              { help }
            </FormHelperText>
          ) : null 
        }
      </FormControl>
    </div>
  )
}

// Renders a Select with map kinds options
const MapSelectorOptions = MapData.kinds()
  .map( kind => ({ value: kind, label: kind }));
const MapSelector = (props) => {
  return (
    <Selector
      options={ MapSelectorOptions }
      label={ "Tipus" }
      help={ "Selecciona el tipus de regions a mostrar" }
      { ...props }
    />
  )
}

// Renders a Select with map values options
const MapValueSelectorOptions = MapData.kinds()
  .reduce( (options, kind) => {
    options[kind] = MapData.values(kind)
      .map( values => ({ value: values, label: MapData.metaName(values) }));
    return options
  }, {});
const MapValueSelector = (props) => {
  const { kind, ...restProps } = props;
  return (
    <Selector
      label={ "Valors" }
      help={ "Selecciona l'origen de les dades" }
      options={ MapValueSelectorOptions[kind] }
      { ...restProps }
    />
  )
}

/*
   Renders the edit form for the Map widget
*/
class Edit extends React.PureComponent {

  onChangeMapKind = (event) => { console.log("Event: ", event); this.props.onChangeMapKind(event.target.value) };
  onChangeMapValue = (event) => this.props.onChangeMapValue(event.target.value);

  render() {
    const { mapKind, mapValue } = this.props;

    return (
      <div style={{ textAlign: 'left' }}>
        <MapSelector
          value={ mapKind }
          onChange={ this.onChangeMapKind }
        />
        <Divider style={{ margin: '2em 0' }} />
        <MapValueSelector
          kind={ mapKind }
          value={ mapValue }
          onChange={ this.onChangeMapValue }
        />
      </div>
    )
  }
}

Edit.propTypes = {
  mapKind: PropTypes.string.isRequired,
  mapValue: PropTypes.string.isRequired,
  onChangeMapKind: PropTypes.func.isRequired,
  onChangeMapValue: PropTypes.func.isRequired,
};

export default Edit;
