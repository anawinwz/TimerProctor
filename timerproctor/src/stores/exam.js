import { action, computed, makeAutoObservable } from 'mobx'
import { fetchAPI } from '../utils/api'

class Exam {
  loading = false
  id = ''
  name = ''
  info = {}
  
  constructor() {
    makeAutoObservable(this)
  }

  @action
  setId(id) {
    this.id = id
  }

  @action
  async getInfo(options = {}) {
    const { id, reload = false } = options
    if (!reload && this.info.name && (!id || this.id === id)) {
      return this.info
    }

    if (id) this.setId(id)

    try {
      this.loading = true
      this.info = await fetchAPI(`/exams/${this.id}/info`)
      this.name = this.info.name
    } catch (err) {
      this.info = {}
    } finally {
      this.loading = false
    }
  }
  
  @action
  updateStatus(status) {
    if (this.timeWindow?.mode === 'realtime') 
      this.info.timeWindow.realtime.status = status

    console.log(this.info)
  }

  @computed
  get timeWindow() {
    return this.info?.timeWindow || {}
  }

  @computed
  get status() {
    if (!this.timeWindow) return 'pending'
    if (this.timeWindow.mode === 'realtime')
      return this.timeWindow.realtime.status
    return 'pending'
  }

  @computed
  get isPromptIDCheck() {
    return this.info?.authentication?.idCheckMode === 'prompt'
  }
}

const ExamStore = new Exam()
export default ExamStore
