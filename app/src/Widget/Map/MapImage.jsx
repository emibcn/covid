import React from 'react';
import PropTypes from 'prop-types';

import { ReactSVG } from 'react-svg'
import ReactTooltip from "react-tooltip";

import Loading from '../../Loading';

import './Map.css';

const fallback=() => <span>Error!</span>;
const loading=() => <Loading />;

/*
   Renders an SVG map, allowing to change each region background color and tooltip
   Some of the code here has been inspired in the original from https://dadescovid.org
*/
class MapImage extends React.Component {

  svg = null;

  // Save SVG DOM node reference
  // This way we can access it's regions to modify them
  wrapperNodeSVG = React.createRef();

  // Get the SVG node itself
  getSVG = () => this.wrapperNodeSVG.current.svgWrapper.querySelector(`svg`);

  isSVGMounted = () => {
    return this.wrapperNodeSVG &&
      'current' in this.wrapperNodeSVG &&
      this.wrapperNodeSVG.current &&
      'svgWrapper' in this.wrapperNodeSVG.current &&
      this.wrapperNodeSVG.current.svgWrapper &&
      'querySelector' in this.wrapperNodeSVG.current.svgWrapper &&
      this.getSVG();
  }

  // Gets the color for a given value (in func params) in a colors table (in props)
  get_color_fons = valor => {
    const color = this.props.colors
      .find( c => valor >= c.valor);
    return color ? color.color : 'fff'
  }

  // Sets the background color in a SVG region for a given value
  setColorBackground = (svg, valors, id) => {
    const elem = svg.querySelector(`#${id}`);
    if ( elem ) {
      elem.style.fill = this.get_color_fons(valors[id]);
    }
  }

  // Sets the background color for all regions in values prop
  omplir_colors = (svg) => {
    const valors = this.props.valors[ this.props.indexValues ];
    const setColorBackground = this.setColorBackground.bind(this, svg, valors);
    Object.keys(valors).forEach( setColorBackground );
  }
  
  // Renders the tip contents for a region
  getTipContent = id => {
    if ( id && this.isSVGMounted() ) {
      const valors = this.props.valors[ this.props.indexValues ];
      const element = this.svg.querySelector(`#${id}`);
      if (!element) {
        return '';
      }
      const label = element.getAttribute('label');
      return (
        <>
          <h1>{ label }</h1>
          { this.props.label }: { valors[id] }
        </>
      );
    }

    return '';
  }

  // Sets data into each map region to be used by the tooltip renderer
  setTooltipData = (svg) => {
    const dataFor = `mapa-${this.props.id}`;
    const setData = element => {
      element.setAttribute('data-tip', element.id);
      element.setAttribute('data-for', dataFor);
    }
    svg.querySelectorAll(`.map_elem`)
      .forEach( setData );
  }

  // Process data into the SVG DOM node before first injecting it into the DOM tree
  beforeInjection = (svg) => {
    this.svg = svg;
    this.omplir_colors(svg);
    this.setTooltipData(svg);
  }

  // Get SVG DOM node and reset colors from data if needed
  afterInjection = (error, svg) => {
    if (error) {
      throw Error(error)
    }
    ReactTooltip.rebuild();
    this.svg = svg;
    this.omplir_colors(this.svg);
  }

  // Update background colors if SVG is mounted
  updateColorsIfPossible = () => {
    if ( this.isSVGMounted() && this.svg ) {
      this.omplir_colors(this.svg);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateColorsIfPossible()
  }

  componentDidMount() {
    this.updateColorsIfPossible()
  }

  render() {
    return (
      <>
        <ReactSVG
          src={ this.props.mapSrc }
          ref={ this.wrapperNodeSVG }
          role="img"
          aria-label="Description of the overall image"
          beforeInjection={ this.beforeInjection }
          afterInjection={ this.afterInjection }
          evalScripts="never"
          fallback={ fallback }
          loading={ loading }
          renumerateIRIElements={ false }
        />
        <ReactTooltip
          id={ `mapa-${this.props.id}` }
          getContent={ this.getTipContent }
        />
      </>
    );
  }
}

MapImage.defaultProps = {
  dies: [],
  valors: [],
  indexValues: 0,
  label: 'Index',
};

MapImage.propTypes = {
  label: PropTypes.string,
  mapSrc: PropTypes.string,
  id: PropTypes.string,
  dies: PropTypes.arrayOf(PropTypes.string).isRequired,
  valors: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  colors: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  indexValues: PropTypes.number.isRequired,
};

export default MapImage;
