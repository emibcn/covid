import React from 'react';
import PropTypes from 'prop-types';

import { styled } from "@material-ui/core/styles";

import { ReactSVG } from 'react-svg'
import ReactTooltip from "react-tooltip";

import Loading from '../../../Loading';
import LegendElement from '../Common/LegendElement';

import './Map.css';

// Renders ReactTooltip with MaterialUI theme styles
const ReactTooltipStyled = styled(ReactTooltip)( ({theme}) => ({
  backgroundColor: `${theme.palette.background.default} !important`,
  color: `${theme.palette.text.primary} !important`,
  opacity: '1 !important',
  borderColor: `${theme.palette.text.hint} !important`,
  ...theme.shape,
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.fontSize,
  '&:before': {
    borderTopColor: `${theme.palette.text.hint} !important`,
  },
  '&:after': {
    borderTopColor: `${theme.palette.background.default} !important`,
  }
}));

// Helper functions for ReactTooltip
const fallback=() => <span>Error!</span>; /* Should never happen */
const loading=() => <Loading />;

const TipContent = React.memo(({id, valuesDay, label, element, colorGetter}) => {
  const valueRaw = valuesDay.get(id);
  const color = colorGetter(valueRaw);
  const value = `${ label }: ${ valueRaw ?? ''}`;
  const title = element.getAttribute('label');
  return (
    <>
      <h4>{ title }</h4>
      <LegendElement { ...{value, color} } justify="center" />
    </>
  );
});

/*
   Renders an SVG map, allowing to change each region background color and tooltip
   Optimized:
    - Save index of map elements with their ID as index
    - Don't update if only `indexValues` has changed, but trigger colors update
      using indexed DOM elements

   Some of the code here has been inspired in the original from https://dadescovid.org
*/
class MapImage extends React.Component {

  svg = null;
  state = {
    // Used to force update based on side effects
    svgStatus: null,
  };

  // Save SVG DOM node reference
  // This way we can access it's regions to modify them
  wrapperNodeSVG = React.createRef();

  // Get the SVG node itself
  isSVGMounted = () => {
    return (this?.wrapperNodeSVG?.current?.container?.querySelector(`svg`) !== null);
  }

  // Gets the color for a given value (in func params) in a colors table (in props)
  getColor = (value) => {
    const color = this.props.colors
      .find( c => value >= c.value);
    return color ? color.color : 'fff'
  }

  // Sets the background color in a SVG region for a given value
  setColorBackground = (element, value) => {
    element.style.fill = this.getColor(value);
  }

  // Sets the background color for all regions in values prop
  fillColors = (props) => {
    if(this.timer) {
      return
    }

    this.timer = requestAnimationFrame(() => {
      const values = props.values[ props.indexValues ] || {};
      const elements = this.mapElements;
      for( const [id, value] of values.entries() ) {
        this.setColorBackground(elements.get(id), value);
      }
      this.timer = false;
    }, 0);
  }
  
  // Sets data into a map region to be used by the tooltip renderer)
  setTooltipData = (element) => {
    const dataFor = `mapa-${this.props.id}`;
    element.setAttribute('data-tip', element.id);
    element.setAttribute('data-for', dataFor);
  }

  // Save an Map of the map elements, indexed by their `id`
  saveElementsIndex = (svg) => {
    this.mapElements = new Map(
      Array.prototype.map.call(
        this.svg.querySelectorAll(`.map_elem`),
        (current) => {
          this.setTooltipData(current);
          return [current.id, current];
        }
      ));
  }

  // Process data into the SVG DOM node before first injecting it into the DOM tree
  beforeInjection = (svg) => {
    this.svg = svg;
    this.saveElementsIndex();
    this.fillColors(this.props);
    this.setState({svgStatus: 'beforeInjection'});
  }

  // Get SVG DOM node and reset colors from data if needed
  afterInjection = (error, svg) => {
    if (error) {
      throw Error(error)
    }

    // Call ReactTooltip to rebuild its database with new objects
    ReactTooltip.rebuild();
    this.svg = svg;
    this.setState({svgStatus: 'afterInjection'});
  }

  // Update background colors if SVG is mounted
  updateColorsIfPossible = (props) => {
    if ( this.isSVGMounted() && this.svg ) {
      this.fillColors(props);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.mapSrc !== prevProps.mapSrc ) {
      this.setState({svgStatus: 'srcChanged'});
    }
  }

  componentDidMount() {
    this.updateColorsIfPossible(this.props);
    this.setState({svgStatus: 'mounted'});
  }

  // Help GC about side effects
  componentWillUnmount() {
    if(this.timer) {
      cancelAnimationFrame(this.timer);
    }
  }

  // Optimize renders:
  // - Only render on map/svg changes
  // - Trigger color update on indexUpdate, but
  //   avoid render if this is the only change
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.indexValues !== nextProps.indexValues) {
      this.updateColorsIfPossible(nextProps);
      if (this.state.tooltipShow) {
        // It's slow, but it's the faster solution found to update tooltip content
        // without re-drawing full tooltip component (very slow)
        ReactTooltip.show(this.mapElements.get( this.state.tooltipShow ));
      }
    }
    if (this.props.mapSrc    !== nextProps.mapSrc ||
        this.state.svgStatus !== nextState.svgStatus) {
      return true;
    }
    return false;
  }

  // Renders the tip contents for a region
  afterTipShow = event => this.setState({ tooltipShow: event.target.id });
  afterTipHide = event => this.setState({ tooltipShow: false });
  getTipContent = (id) => {
    if ( !id ) {
      return '';
    }

    const element = this.mapElements?.get(id) ?? false;
    if (!element) {
      return '';
    }

    const {values, indexValues, label} = this.props;
    const valuesDay = values[ indexValues ];
    return <TipContent { ...{
      id,
      valuesDay,
      label,
      element,
      colorGetter: this.getColor,
    }} />;
  }

  render() {
    const {mapSrc, title, id} = this.props;
    return (
      <>
        <ReactSVG
          src={ mapSrc }
          ref={ this.wrapperNodeSVG }
          role="img"
          aria-label={ title }
          beforeInjection={ this.beforeInjection }
          afterInjection={ this.afterInjection }
          evalScripts="never"
          fallback={ fallback }
          loading={ loading }
          renumerateIRIElements={ false }
        />
        <ReactTooltipStyled
          id={ `mapa-${id}` }
          getContent={ this.getTipContent }
          afterShow={ this.afterTipShow }
          afterHide={ this.afterTipHide }
          border={ true }
        />
      </>
    );
  }
}

MapImage.defaultProps = {
  values: [],
  indexValues: 0,
  label: 'Index',
  title: 'Map',
};

MapImage.propTypes = {
  label: PropTypes.string,
  mapSrc: PropTypes.string,
  id: PropTypes.string,
  // {["day"]: {["regionId"]: "color"} }
  values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  colors: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
  indexValues: PropTypes.number.isRequired,
};

export default MapImage;
