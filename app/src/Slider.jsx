import React from 'react';
import PropTypes from 'prop-types';

import SliderLib from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

import './Slider.scss';

// Component to render the label's value
function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip
      open={ open }
      enterTouchDelay={ 0 }
      placement="bottom"
      title={ value }
    >
      { children }
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.node.isRequired,
};

// Render the Play/Pause button next to the Slider
class PlayPauseButton extends React.PureComponent {
  onChange = () => {
    if ( this.props.isPlaying ) {
      this.props.onPause();
    }
    else {
      this.props.onPlay();
    }
  }

  // All the magic is done into the SCSS file Slider.sccs ;)
  render() {
    return (
      <div className="playpause">
        <input
          type="checkbox"
          id="playpause"
          name="check"
          checked={ !this.props.isPlaying }
          onChange={ this.onChange }
        />
        <label
          htmlFor="playpause"
          style={{ borderLeftColor: '' }}
        />
      </div>
    )
  }
}

/*
   Renders a Slider with a play/pause button next to it, inside a
   sticky container at the top of the page
*/
class Slider extends React.PureComponent {
  state = {
    isPlaying: false
  }

  onPause = () => {
    clearTimeout(this.timer);
    this.setState({ isPlaying: false });
  }

  onPlay = () => {
    this.setTimer();
    this.setState({ isPlaying: true });
  }

  // TODO: Allow changing the timeout/speed
  setTimer = () => {
    this.timer = setTimeout(this.updatePlay, 40);
  }

  updatePlay = () => {
    this.props.onChange(
      {}, // event
      this.props.value < this.props.max - 1
        ? this.props.value + 1
        : 0
    );
    this.setTimer();
  }

  render() {
    const { isPlaying } = this.state;
    return (
      <>
        <SliderLib
          valueLabelDisplay="on"
          ValueLabelComponent={ ValueLabelComponent }
          aria-labelledby="discrete-slider-small-steps"
          step={ 1 }
          min={ 0 }
          style={{ margin: '0 1em' }}
          { ...this.props }
        />
        <PlayPauseButton
           onPlay={ this.onPlay }
           onPause={ this.onPause }
           isPlaying={ isPlaying }
        />
      </>
    )
  }
}

export default Slider;
