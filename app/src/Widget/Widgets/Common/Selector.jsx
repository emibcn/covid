import React from "react";
import PropTypes from "prop-types";

import Select from "@material-ui/core/Select";

import FormDecorators from "./FormDecorators";

// Renders a Select, with options from props
const Selector = (props) => {
  const { label, help, id, options, ...restProps } = props;
  return (
    <FormDecorators id={id} label={label} help={help}>
      <Select
        native
        {...restProps}
        aria-describedby={`helper-text-${id}`}
        inputProps={{
          name: label,
          id: id,
        }}
      >
        {options.map((option) => (
          <option key={`v_${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormDecorators>
  );
};

Selector.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  help: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Selector;
