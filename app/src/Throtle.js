// KISS Throtle
// Ensures a function is not called more than once every timeout
// - Run is banned while timer is on
// - Run is ensured the first time (no timer is on) and when forced (you know it's the last time). In this case, timer is also cleared
// - A last run IS NOT ensured if you don't recall after timer is out or manually forced
// You can manually clear the timer if you want to ensure next run
class Throtle {
  timer = false

  // Starts Throtle timer (bans running, except if forced)
  start (timeout) {
    this.timer = setTimeout(this.clear, timeout)
  }

  // Clear Throtle timer (allows running)
  clear = () => {
    if (this.timer !== false) {
      clearTimeout(this.timer)
      this.timer = false
    }
  }

  // Run function, if not throtled or if force == true
  run (force, timeout, func) {
    if (force) {
      this.clear()
    }

    if (this.timer === false) {
      this.start(timeout)
      func()
    }
  }
}

export default Throtle
