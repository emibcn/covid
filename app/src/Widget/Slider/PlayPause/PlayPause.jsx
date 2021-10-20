import React from 'react'
import PropTypes from 'prop-types'

import PlayPauseButton from './PlayPauseButton'
import PlayPauseHandler from './PlayPauseHandler'

// Magic for Play/Pause button
import './PlayPause.scss'

function PlayPause ({ className, value, max, onChange }) {
  // Handle playing status
  // Use useCallback to reduce children rerenders
  const [isPlaying, setIsPlaying] = React.useState(false)
  const onPause = React.useCallback(() => {
    setIsPlaying(false)
  }, [setIsPlaying])

  const onPlay = React.useCallback(() => {
    setIsPlaying(true)
  }, [setIsPlaying])

  // Use useRef and useCallback to avoid recreating the
  // callback on each render and hence force unneded updates
  const valueRef = React.useRef(value)
  valueRef.current = value
  const onNext = React.useCallback(() => {
    const next = valueRef.current < max - 1 ? valueRef.current + 1 : 0
    onChange(
      {
        /* event */
      },
      next
    )
  }, [valueRef, max, onChange])

  return (
    <>
      <PlayPauseButton
        className={className}
        onPlay={onPlay}
        onPause={onPause}
        isPlaying={isPlaying}
      />
      <PlayPauseHandler isPlaying={isPlaying} onNext={onNext} />
    </>
  )
}

PlayPause.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

PlayPause.defaultProps = {
  className: ''
}

export default PlayPause
