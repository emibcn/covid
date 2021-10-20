import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '@material-ui/core/Tooltip'
import { translate } from 'react-translate'

// Render the Play/Pause button next to the Slider
function PlayPauseButtonUntranslated ({
  isPlaying,
  onPlay,
  onPause,
  className,
  t
}) {
  const id = `playpause_${Math.random()}`.replace('0.', '')
  const onChange = React.useCallback(() => {
    if (isPlaying) {
      onPause()
    } else {
      onPlay()
    }
  }, [isPlaying, onPause, onPlay])

  // All the styling magic is done into the SCSS file Slider.sccs ;)
  return (
    <Tooltip
      title={t('Toggle play status')}
      aria-label={!isPlaying ? t('play') : t('pause')}
    >
      <div className={`playpause ${className || ''}`}>
        <input
          id={id}
          type='checkbox'
          name='check'
          checked={!isPlaying}
          onChange={onChange}
          aria-label={t('Toggle play status')}
        />
        <label htmlFor={id} style={{ borderLeftColor: '' }} />
      </div>
    </Tooltip>
  )
}

PlayPauseButtonUntranslated.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  className: PropTypes.string,
  t: PropTypes.func.isRequired
}

PlayPauseButtonUntranslated.defaultProps = {
  classes: ''
}

// Translate Play/Pause component
const PlayPauseButton = translate('PlayPause')(PlayPauseButtonUntranslated)

export default PlayPauseButton
