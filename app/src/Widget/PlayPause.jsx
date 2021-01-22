import React from 'react';
import PropTypes from 'prop-types';

import { translate } from 'react-translate'
import Tooltip from '@material-ui/core/Tooltip';

// Magic for Play/Pause button
import './PlayPause.scss';

// Render the Play/Pause button next to the Slider
const PlayPauseButtonUntranslated = ({isPlaying, onPlay, onPause, className, t}) => {
  const onChange = React.useCallback(() => {
    if ( isPlaying ) {
      onPause();
    }
    else {
      onPlay();
    }
  }, [isPlaying, onPause, onPlay]);

  // All the styling magic is done into the SCSS file Slider.sccs ;)
  return (
    <Tooltip
      title={ t("Toggle play status") }
      aria-label={ !isPlaying ? t("play") : t("pause") }
    >
      <div className={ `playpause ${className || ''}` }>
        <input
          type="checkbox"
          id="playpause"
          name="check"
          checked={ !isPlaying }
          onChange={ onChange }
          aria-label={ t("Toggle play status") }
        />
        <label
          htmlFor="playpause"
          style={{ borderLeftColor: '' }}
        />
      </div>
    </Tooltip>
  )
}

// Translate Play/Pause component
const PlayPauseButton = translate('PlayPause')(PlayPauseButtonUntranslated);

const PlayPauseHandler = ({isPlaying, onNext}) => {
  // Use a timer holder to prevent an update when
  // setting or cancelling the timer
  // This is a controlled side effect.
  const [timerHolder] = React.useState({timer: false});

  // Use useCallback to prevent the useEffect below beeing
  // recalled on each render
  const startTimer = React.useCallback(() => {
    timerHolder.timer = setTimeout(() => {
      timerHolder.timer = false;
      onNext();
      startTimer();
    }, 40);
  }, [timerHolder, onNext]);

  const stopTimer = React.useCallback(() => {
    if ( timerHolder.timer ) {
      clearTimeout(timerHolder.timer);
      timerHolder.timer = false;
    }
  }, [timerHolder]);

  React.useEffect(() => {
    if(isPlaying) {
      startTimer();
      // Ensure timer is stoped on unmount
      return stopTimer
    }
  }, [isPlaying, startTimer, stopTimer]);

  return null;
}

const PlayPause = ({className, value, max, onChange}) => {
  // Handle playing status
  // Use useCallback to reduce children rerenders
  const [isPlaying, setIsPlaying] = React.useState(false);
  const onPause = React.useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const onPlay = React.useCallback(() => {
    setIsPlaying(true);
  }, [setIsPlaying]);

  // Use useRef and useCallback to avoid recreating the
  // callback on each render and hence force unneded updates
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const onNext = React.useCallback(() => {
    const next = valueRef.current < max - 1 ? valueRef.current + 1 : 0;
    onChange({/*event*/}, next);
  }, [valueRef, max, onChange]);

  return (
    <>
      <PlayPauseButton
        className={ className }
        onPlay={ onPlay }
        onPause={ onPause }
        isPlaying={ isPlaying }
      />
      <PlayPauseHandler
        isPlaying={isPlaying}
        onNext={onNext}
      />
    </>
  )
}

PlayPause.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
};

export default PlayPause;
