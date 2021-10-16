import React from "react";
import PropTypes from "prop-types";

import { translate } from "react-translate";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Divider from "@material-ui/core/Divider";

import ChartRegionSelector from "./EditRegion";

// UI-Material Styles
const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  labelFixed: {
    position: "initial",
    transform: "unset",
    marginBottom: theme.spacing(2),
  },
}));

const FormDecorators = (props) => {
  const classes = useStyles();
  const { label, help, id, children, fixTree } = props;
  return (
    <div
      style={{
        margin: "0 auto",
        display: "block",
      }}
    >
      <FormControl required className={classes.formControl}>
        <InputLabel
          className={fixTree ? classes.labelFixed : null}
          htmlFor={id}
        >
          {label}
        </InputLabel>
        {children}
        {help ? (
          <FormHelperText id={`helper-text-${id}`}>{help}</FormHelperText>
        ) : null}
      </FormControl>
    </div>
  );
};

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
        {options.map(({ value, label }) => (
          <option key={`v_${value}`} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </FormDecorators>
  );
};

// Renders a Select with chart division options
const ChartDivisionSelector = translate("Widget/Chart/Edit")((props) => {
  const { t, divisions, ...restProps } = props;
  const ChartDivisionSelectorOptions = React.useMemo(
    () => divisions.map((kind) => ({ value: kind, label: kind })),
    [divisions]
  );
  return (
    <Selector
      options={ChartDivisionSelectorOptions}
      label={t("Division")}
      help={t("Select the division type to show")}
      {...restProps}
    />
  );
});

// Renders a Select with chart population options
const ChartPopulationSelector = translate("Widget/Chart/Edit")((props) => {
  const { t, populations, ...restProps } = props;
  const ChartPopulationSelectorOptions = React.useMemo(
    () => populations.map((kind) => ({ value: kind, label: kind })),
    [populations]
  );
  return (
    <Selector
      label={t("Population")}
      help={t("Select the population")}
      options={ChartPopulationSelectorOptions}
      {...restProps}
    />
  );
});

// Renders a Select with chart population options
const ChartDatasetSelector = translate("Widget/Chart/Edit")((props) => {
  const { t, ...restProps } = props;
  const ChartDatasetSelectorOptions = React.useMemo(
    () => [
      { value: "grafic_extensio", label: t("Extensió") },
      { value: "grafic_risc_iepg", label: t("Risc iEPG") },
      { value: "seguiment", label: t("Tracking") },
      { value: "situacio", label: t("Situation") },
    ],
    [t]
  );
  return (
    <Selector
      label={t("Dataset")}
      help={t("Select the dataset")}
      options={ChartDatasetSelectorOptions}
      {...restProps}
    />
  );
});

/*
   Renders the edit form for the Map widget
*/
class Edit extends React.PureComponent {
  onChangeChartDivision = (event) =>
    this.props.onChangeChartDivision(event.target.value);
  onChangeChartPopulation = (event) =>
    this.props.onChangeChartPopulation(event.target.value);
  onChangeChartDataset = (event) =>
    this.props.onChangeChartDataset(event.target.value);
  onChangeChartRegion = (value) => this.props.onChangeChartRegion(value);

  render() {
    const {
      chartDivision,
      chartPopulation,
      chartDataset,
      chartRegion,
      divisions,
      populations,
      chartsIndex,
      t,
    } = this.props;

    return (
      <div style={{ textAlign: "left" }}>
        <ChartDivisionSelector
          divisions={divisions}
          value={chartDivision}
          onChange={this.onChangeChartDivision}
        />
        <Divider style={{ margin: "2em 0" }} />
        <ChartPopulationSelector
          populations={populations}
          value={chartPopulation}
          onChange={this.onChangeChartPopulation}
        />
        <Divider style={{ margin: "2em 0" }} />
        <ChartDatasetSelector
          value={chartDataset}
          onChange={this.onChangeChartDataset}
        />

        <Divider style={{ margin: "2em 0" }} />
        <FormDecorators id={"regions-tree"} label={t("Region")} fixTree>
          <ChartRegionSelector
            id={"regions-tree"}
            chartsIndex={chartsIndex}
            division={chartDivision}
            population={chartPopulation}
            value={chartRegion}
            onChange={this.onChangeChartRegion}
          />
        </FormDecorators>
      </div>
    );
  }
}

Edit.propTypes = {
  chartDivision: PropTypes.string.isRequired,
  chartPopulation: PropTypes.string.isRequired,
  chartDataset: PropTypes.string.isRequired,
  chartRegion: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onChangeChartDivision: PropTypes.func.isRequired,
  onChangeChartPopulation: PropTypes.func.isRequired,
  onChangeChartDataset: PropTypes.func.isRequired,
  onChangeChartRegion: PropTypes.func.isRequired,
};

export default translate("Widget/Chart/Edit")(Edit);
