import { action, computed, observable } from 'mobx'
import { fetchAPIwithAdminToken } from '~/utils/api'
import { secDiff } from '~/utils/date'

const initialCounts = {
  all: 0,
  loggedin: 0,
  authenticating: 0,
  authenticated: 0,
  started: 0,
  completed: 0,
  terminated: 0
}

const initialHasNewCounts = {
  all: false,
  loggedin: false,
  authenticating: false,
  authenticated: false,
  started: false,
  completed: false,
  terminated: false
}

class ExamAdminStore {
  @observable loading = false

  @observable lastExamId = ''

  @observable socketToken = ''
  @observable currentStatus = 'all'
  @observable counts = initialCounts
  @observable hasNewCounts = initialHasNewCounts
  @observable testers = {}
  @observable proctors = {}
  @observable testerIdMappings = []

  constructor(rootStore) {
    this.rootStore = rootStore
    this.examStore = rootStore.ExamStore
    this.authStore = rootStore.AuthStore
    this.timerStore = rootStore.TimerStore
  }

  @action
  clearInfo() {
    this.socketToken = ''

    const examId = this.examStore?.id
    if (examId !== this.lastExamId) {
      this.lastExamId = examId
      this.counts = initialCounts
      this.hasNewCounts = initialHasNewCounts
      this.testers = {}
      this.proctors = {}
      this.testerIdMappings = []
    }
  }

  @computed
  get isExamOwner() {
    let ownerId = this.examStore?.info?.owner
    if (typeof ownerId?._id === 'string') ownerId = ownerId._id
    return ownerId === this.authStore.userId
  }

  @action
  async startProctor() {
    try {
      const examId = this.examStore?.id
      const res = await fetchAPIwithAdminToken(`/exams/${examId}/startProctor`, {})
      const { status, payload } = res
      if (status === 'ok') this.socketToken = payload.socketToken
    } catch {}
  }

  @action
  async startTimer() {
    const timeWindow = this.examStore?.info?.timeWindow
    if (!timeWindow) return

    const { mode, realtime } = timeWindow
    if (mode !== 'realtime') return

    if (realtime?.status === 'started') {
      this.timerStore.set({ startTime: secDiff(realtime?.startedAt, new Date()) })
      this.timerStore.start()
    } else {
      this.timerStore.reset()
    }
  }

  @action
  async getTesters() {
    try {
      this.loading = true
      const examId = this.examStore.id
      const res = await fetchAPIwithAdminToken(`/exams/${examId}/testers`)
      if (res.status === 'ok') {
        this.testers = res.payload.testers
      } else {
        throw new Error(res.message || 'เกิดข้อผิดพลาดในการโหลดรายชื่อผู้เข้าสอบ')
      }
    } finally {
      this.loading = false
    }
  }

  @action
  async getTestersCount(isInit = false) {
    try {
      this.loading = true
      const examId = this.examStore?.id
      const res = await fetchAPIwithAdminToken(`/exams/${examId}/testers/count`)
      const { status, payload } = res
      if (status === 'ok') this.counts = Object.assign({}, isInit ? initialCounts : this.counts, payload.counts)
    } catch {
    } finally {
      this.loading = false
    }
  }

  @action
  setCurrentStatus(status = 'all') {
    this.currentStatus = status
  }

  @action
  setHasNoNewCount(status = '') {
    if (typeof this.hasNewCounts[status] !== 'undefined') {
      this.hasNewCounts[status] = false
    }
  }

  @action
  clearLocalTesters(statuses = []) {
    if (statuses.length === 0) {
      const affected = this.testers.length
      this.testers = {}
      return affected
    }

    for (const [id, tester] of Object.entries(this.testers)) {
      if (statuses.includes(tester.status)) {
        delete this.testers[id]
        this.counts[tester.status] -= 1
      }
    }
  }

  @action
  addLocalTester(tester = {}) {
    const { _id } = tester
    if (this.updateLocalTester(_id, tester, true)) return true

    Object.assign(this.testers, {}, { [_id]: tester })
    this.counts.all += 1
    this.counts[tester.status] += 1
    if (this.currentStatus !== tester.status)
      this.hasNewCounts[tester.status] = true
  }

  @action
  updateLocalTester(_id, changes = {}, fromSocket = false) {
    if (!_id || !this.testers[_id]) return false

    const oldStatus = this.testers[_id].status
    this.testers[_id] = Object.assign({}, this.testers[_id], changes)
    if (oldStatus && changes?.status && oldStatus !== changes.status) {
      this.counts[oldStatus] -= 1
      this.counts[changes.status] += 1
      if (fromSocket && this.currentStatus !== changes.status)
        this.hasNewCounts[changes.status] = true

      if (this.counts[oldStatus] === 0)
        this.hasNewCounts[oldStatus] = false
    }
    return true
  }

  @action
  addSnapshotToLocalTester(_id, snapshot = {}) {
    if (!_id || !this.testers[_id]) return false
    
    const oldSnapshots = this.testers[_id].snapshots
    if (typeof oldSnapshots === 'undefined' || !Array.isArray(oldSnapshots))
      return false

    this.testers[_id].snapshots.push(snapshot)
    return true
  }

  @action
  addEventToLocalTester(_id, event = {}) {
    if (!_id || !this.testers[_id]) return false
    
    const oldEvents = this.testers[_id].events
    if (typeof oldEvents === 'undefined' || !Array.isArray(oldEvents))
      return false

    this.testers[_id].events = [...this.testers[_id].events, event]
    return true
  }

  @action
  async getTester(testerId, scope = '') {
    try {
      this.loading = true

      await this.examStore.getInfo()
      const examId = this.examStore.id

      const res = await fetchAPIwithAdminToken(`/exams/${examId}/testers/${testerId}${scope ? `/${scope}` : ''}`)
      if (res.status === 'ok') {
        if (scope) this.updateLocalTester(testerId, res.payload)
        else this.addLocalTester(res.payload)
      } else {
        throw new Error(res.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้เข้าสอบ')
      }
    } catch {
      throw new Error('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้เข้าสอบ')
    } finally {
      this.loading = false
    }
  }

  @action
  async terminateTester(_id = '', reason = '') {
    if (!_id) return false
    
    const examId = this.examStore?.id 
    const res = await fetchAPIwithAdminToken(`/exams/${examId}/testers/${_id}/status`, { status: 'terminated', reason }, 'PATCH')
    const { status, message } = res
    if (status === 'ok')  {
      return this.updateLocalTester(_id, { status: 'terminated' })
    } else {
      throw new Error(message || 'เกิดข้อผิดพลาดในการเชิญผู้เข้าสอบรายนี้ออก')
    }
  }

  @action
  async editName(name) {
    const examId = this.examStore?.id 
    const res = await fetchAPIwithAdminToken(`/exams/${examId}`, { name }, 'PATCH')
    const { status, message } = res
    if (status === 'ok')  {
      this.examStore?.updateLocalInfo({ name })
    } else {
      throw new Error(message || 'เกิดข้อผิดพลาดในการเปลี่ยนชื่อ')
    }
  }

  @action
  updateLocalAllowLogin(allow) {
    try {
      this.examStore.timeWindow.realtime.allowLogin = allow
    } catch {}
  }

  @action
  async getProctors() {
    try {
      const examId = this.examStore.id
      const res = await fetchAPIwithAdminToken(`/exams/${examId}/proctors`)
      if (res.status === 'ok') {
        this.proctors = res.payload.proctors
      } else {
        throw new Error(res.message || 'เกิดข้อผิดพลาดในการโหลดรายชื่อกรรมการคุมสอบ')
      }
    } catch {
      throw new Error('เกิดข้อผิดพลาดในการโหลดรายชื่อกรรมการคุมสอบ')
    }
  }

  @computed
  get onlineProctors() {
    const proctors = Object.entries(this.proctors)
    return proctors.filter(([_, proctor = {}]) => proctor.online === true)
  }

  @action
  async inviteProctor(email = '', notify = false) {
    if (!email) return 'กรุณากรอกอีเมลที่ต้องการเชิญก่อน'
    
    const examId = this.examStore?.id 
    const res = await fetchAPIwithAdminToken(`/exams/${examId}/proctors`, { email, notify })
    const { status, message } = res
    if (status === 'ok')  {
      this.getProctors()
      return message
    } else {
      throw new Error(message || 'เกิดข้อผิดพลาดในการเชิญบุคคลนี้เป็นกรรมการ')
    }
  }

  @action
  async cancelProctor(_id = '') {
    if (!_id) return false
    
    const examId = this.examStore?.id 
    const res = await fetchAPIwithAdminToken(`/exams/${examId}/proctors/${_id}`, null, 'DELETE')
    const { status, message } = res
    if (status === 'ok')  {
      return this.getProctors()
    } else {
      throw new Error(message || 'เกิดข้อผิดพลาดในการยกเลิกบุคคลนี้จากกรรมการ')
    }
  }

  @action
  updateLocalProctor(_id, changes = {}) {
    if (!_id || !this.proctors[_id]) return false

    this.proctors[_id] = Object.assign({}, this.proctors[_id], changes)
    return true
  }

  @action
  async getTesterIdMappings() {
    try {
      const examId = this.examStore.id
      const res = await fetchAPIwithAdminToken(`/exams/${examId}/testerIdMappings`)
      if (res.status === 'ok') {
        this.testerIdMappings = res.payload.mappings
      } else {
        throw new Error(res.message || 'เกิดข้อผิดพลาดในการโหลดรายชื่อที่นำเข้าไว้')
      }
    } catch {
      throw new Error('เกิดข้อผิดพลาดในการโหลดรายชื่อที่นำเข้าไว้')
    }
  }

  @action
  async deleteTesterIdMappings() {
    try {
      const examId = this.examStore.id
      const res = await fetchAPIwithAdminToken(`/exams/${examId}/testerIdMappings`, null, 'DELETE')
      if (res.status === 'ok') {
        this.testerIdMappings = []
      } else {
        throw new Error(res.message || 'เกิดข้อผิดพลาดในการลบรายชื่อที่นำเข้าไว้')
      }
    } catch {
      throw new Error('เกิดข้อผิดพลาดในการลบรายชื่อที่นำเข้าไว้')
    }
  }

  @action
  async importTesterIdMappings(sheet = []) {
    if (!Array.isArray(sheet) || sheet.length === 0) return false
    
    const examId = this.examStore?.id 
    const res = await fetchAPIwithAdminToken(`/exams/${examId}/testerIdMappings`, { mappings: sheet }, 'PUT')
    const { status, message } = res
    if (status === 'ok')  {
      this.testerIdMappings = [...sheet]
    } else {
      throw new Error(message || 'เกิดข้อผิดพลาดในการนำเข้ารายชื่อ')
    }
  }
}

export default ExamAdminStore
