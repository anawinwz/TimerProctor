import { action, computed, makeAutoObservable } from 'mobx'

class Timer {
  isRunning = false
  currentTime = 0
  endTime = 0

  constructor() {
    makeAutoObservable(this)
  }
  
  @action
  set({ startTime, endTime }) {
    if (startTime) this.currentTime = startTime
    if (endTime) this.endTime = endTime
  }

  @action 
  reset() {
    this.isRunning = 0
    this.currentTime = 0
    this.endTime = 0
  }

  @action
  tick() {
    if (!this.isRunning) return
    this.currentTime += 1
    if (this.currentTime >= this.endTime) {
      this.isRunning = false
      return
    }
    setTimeout(() => this.tick(), 1000)
  }

  @action
  start() {
    if (this.isRunning) return
    this.isRunning = true
    this.tick()
  }

  @action
  pause() {
    if (!this.isRunning) return
    this.isRunning = false
  }

  @computed
  get remainingTime() {
    return this.endTime - this.currentTime
  }

  @computed 
  get isTimeout() {
    if (this.endTime > 0 && this.currentTime >= this.endTime) return true
    return false
  }

  @computed
  get displayRemainingTime() {
    const remainingTime = this.remainingTime
    const mins = Math.floor(remainingTime / 60)
    const secs = remainingTime % 60
    return `${mins < 10 ? 0 : ''}${mins}:${secs < 10 ? 0 : ''}${secs}`
  }
}

const TimerStore = new Timer()
export default TimerStore
