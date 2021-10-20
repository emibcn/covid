import React from 'react'
import PropTypes from 'prop-types'

function PlayPauseHandler ({ isPlaying, onNext }) {
  // Use a timer holder to prevent an update when
  // setting or cancelling the timer
  // This is a controlled side effect.
  const [timerHolder] = React.useState({ timer: false })

  // Use useCallback to prevent the useEffect below beeing
  // recalled on each render
  const startTimer = React.useCallback(() => {
    timerHolder.timer = setTimeout(() => {
      timerHolder.timer = false
      onNext()
      startTimer()
    }, 40)
  }, [timerHolder, onNext])

  const stopTimer = React.useCallback(() => {
    if (timerHolder.timer) {
      clearTimeout(timerHolder.timer)
      timerHolder.timer = false
    }
  }, [timerHolder])

  React.useEffect(() => {
    if (isPlaying) {
      startTimer()
      // Ensure timer is stoped on unmount
      return stopTimer
    }

    return () => {}
  }, [isPlaying, startTimer, stopTimer])

  return null
}

PlayPauseHandler.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired
}

export default PlayPauseHandler
