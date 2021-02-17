import { action, computed, observable } from 'mobx'
import { fetchAPI } from '~/utils/api'

class ExamStore {
  @observable loading = false
  @observable error = null
  @observable lastFetch = 0

  @observable id = ''
  @observable name = ''
  @observable info = {}
  @observable annoucements = []

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action
  async getInfo(options = {}) {
    const { id, reload = false } = options
    if (!reload && this.info?.name && (!id || this.id === id) && Date.now() - this.lastFetch < 15000) {
      return this.info
    }

    if (id) this.id = id

    try {
      this.loading = true
      this.info = await fetchAPI(`/exams/${this.id}`)
      this.name = this.info.name
      this.lastFetch = Date.now()
      this.error = null
    } catch (err) {
      this.info = {}
      this.error = err
    } finally {
      this.loading = false
    }
  }

  @action
  updateInfo(info = {}) {
    this.info = Object.assign({}, this.info, info)
    if (info?.name) this.name = info.name
  }
  
  @action
  updateStatus(status) {
    if (this.timeWindow?.mode === 'realtime') {
      this.info.timeWindow.realtime = {
        ...this.info.timeWindow.realtime,
        status
      }
      if (status === 'started') this.info.timeWindow.realtime.startedAt = Date.now()
    }
  }

  @action
  updateAnnoucement(text) {
    this.annoucements.push(text)
  }

  @computed
  get timeWindow() {
    return this.info?.timeWindow || {}
  }

  @computed
  get status() {
    if (!this.timeWindow) return 'pending'
    if (this.timeWindow?.mode === 'realtime')
      return this.timeWindow?.realtime?.status
    return 'pending'
  }

  @computed
  get isPromptIDCheck() {
    return this.info?.authentication?.idCheckMode === 'prompt'
  }
}

export default ExamStore
