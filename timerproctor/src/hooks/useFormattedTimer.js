import { useTimer } from 'use-timer'
const useFormattedTimer = (options = null) => {
  const timer = useTimer(options)

  let formattedTime = '--:--'
  if (timer.time > 0) {
    const mins = Math.floor(timer.time / 60)
    const secs = timer.time % 60
    formattedTime = `${mins < 10 ? 0 : ''}${mins}:${secs < 10 ? 0 : ''}${secs}`
  }

  return {
    ...timer,
    formattedTime 
  }
}

export default useFormattedTimer
