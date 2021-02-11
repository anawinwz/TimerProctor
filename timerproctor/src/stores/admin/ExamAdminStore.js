import { action, observable } from 'mobx'
import { fetchAPIwithToken } from '~/utils/api'

const initialCounts = {
  all: 0,
  loggedin: 0,
  authenticating: 0,
  authenticated: 0,
  started: 0,
  completed: 0
}

class ExamAdminStore {
  @observable loading = false
  @observable socketToken = ''
  @observable counts = initialCounts
  @observable testers = {}

  constructor(rootStore) {
    this.rootStore = rootStore
    this.examStore = rootStore.ExamStore
  }

  @action
  async startProctor() {
    try {
      const examId = this.examStore?.id
      const res = await fetchAPIwithToken(`/exams/${examId}/startProctor`, {})
      const { status, payload } = res
      if (status === 'ok') this.socketToken = payload.socketToken
    } catch {}
  }

  @action
  async getTesters() {
    try {
      this.loading = true
      const examId = this.examStore?.id
      const res = await fetchAPIwithToken(`/exams/${examId}/testers`)
      if (res.status === 'ok') {
        this.testers = res.payload.testers
      } else {
        throw new Error(res.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลหน้านี้')
      }
    } finally {
      this.loading = false
    }
  }

  @action
  addTester(tester = {}) {
    const { _id } = tester
    if (this.updateTester(_id, tester)) return true

    this.testers[_id] = tester
    this.counts.all += 1
    this.counts[tester.status] += 1
  }

  @action
  updateTester(_id, changes = {}) {
    if (!_id || !this.testers[_id]) return false

    const oldStatus = this.testers[_id].status
    this.testers[_id] = Object.assign({}, this.testers[_id], changes)
    if (oldStatus && changes?.status) {
      this.counts[oldStatus] -= 1
      this.counts[changes.status] += 1
    }
    return true
  }

  @action
  async getTester(testerId, scope = '') {
    try {
      this.loading = true
      const examId = this.examStore?.id
      const res = await fetchAPIwithToken(`/exams/${examId}/testers/${testerId}${scope ? `/${scope}` : ''}`)
      if (res.status === 'ok') {
        this.updateTester(testerId, res.payload)
      } else {
        throw new Error(res.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้เข้าสอบ')
      }
    } finally {
      this.loading = false
    }
  }

  @action
  async getCounts(isInit = false) {
    try {
      this.loading = true
      const examId = this.examStore?.id
      const res = await fetchAPIwithToken(`/exams/${examId}/testers/count`)
      const { status, payload } = res
      if (status === 'ok') this.counts = Object.assign({}, isInit ? initialCounts : this.counts, res.payload.counts)
    } catch {
    } finally {
      this.loading = false
    }
  }

  @action
  async editName(name) {
    const examId = this.examStore?.id 
    const res = await fetchAPIwithToken(`/exams/${examId}/update`, { name })
    const { status, message } = res
    if (status === 'ok')  {
      this.examStore?.updateInfo({ name })
    } else {
      throw new Error(message || 'เกิดข้อผิดพลาดในการเปลี่ยนชื่อ')
    }
  }
}

export default ExamAdminStore
