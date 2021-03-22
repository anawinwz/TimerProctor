import { action, computed, observable } from 'mobx'

class TimerStore {
  @observable isRunning = false
  @observable currentTime = 0
  @observable endTime = 0

  constructor(rootStore) {
    this.rootStore = rootStore
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
    return this.currentTime > this.endTime ? 0 : this.endTime - this.currentTime
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

export default TimerStore
