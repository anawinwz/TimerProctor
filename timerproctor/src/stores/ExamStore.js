import { action, computed, observable } from 'mobx'
import { fetchAPI, fetchAPIwithToken } from '~/utils/api'
import { userToken, adminToken } from '~/utils/token'

class ExamStore {
  @observable loading = true
  @observable error = null
  @observable lastFetch = 0

  @observable id = ''
  @observable name = ''
  @observable info = {}
  @observable announcements = []

  constructor(rootStore, fromAdmin = false) {
    this.rootStore = rootStore
    this.fromAdmin = fromAdmin
    this.token = this.fromAdmin ? adminToken : userToken
  }

  @action
  clearInfo() {
    this.lastFetch = 0

    this.id = ''
    this.name = ''
    this.info = {}
    this.announcements = []
  }

  @action
  async getInfo(options = {}) {
    const { id, reload = false } = options
    if (!reload && this.info?.name && (!id || this.id === id) && Date.now() - this.lastFetch < 15000) {
      return this.info
    }

    if (id) this.id = id
    if (!this.id) return {}

    try {
      this.loading = true

      const res = this.fromAdmin ? await fetchAPIwithToken(`/exams/${this.id}`, null, null, this.token) : await fetchAPI(`/exams/${this.id}`)
      const { status, payload, message } = res
      if (status === 'ok') {
        const { exam } = payload
        Object.assign(this.info, {}, exam)

        this.name = this.info.name
        
        this.lastFetch = Date.now()
        this.error = null
        return this.info
      } else if (status === 'notfound') {
        this.clearInfo()
        this.error = null
      } else {
        throw new Error(message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลการสอบ')
      }
    } catch (err) {
      Object.assign(this.info, {})
      this.error = err
      return this.info
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
  async getAnnouncements() {
    try {
      const { status, payload } = await fetchAPIwithToken(`/exams/${this.id}/announcements`, null, null, this.token)
      this.announcements = (status === 'ok') ? payload.announcements : []
    } catch {
      this.announcements = []
    }
  }

  @action
  updateAnnouncement(text) {
    this.announcements.push(text)
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
  get isIDCheck() {
    return this.info?.authentication?.idCheckMode !== 'none'
  }

  @computed
  get isPromptIDCheck() {
    return this.info?.authentication?.idCheckMode === 'prompt'
  }
}

export default ExamStore
