import { action, observable } from 'mobx'
import { fetchAPIwithToken } from '~/utils/api'

class ExamAdminStore {
  @observable loading = false
  @observable socketToken = ''
  @observable counts = {
    all: 0,
    loggedin: 0,
    authenticating: 0,
    authenticated: 0,
    started: 0,
    completed: 0
  }
  @observable testers = []

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
    this.testers.push(tester)
    this.counts.all += 1
    this.counts?.[tester?.status] += 1
  }

  @action
  updateTester(_id, changes = {}) {
    const idx = this.testers.findIndex(tester => tester?._id == _id)
    const oldStatus = this.testers[idx]?.status
    this.testers[idx] = Object.assign({}, this.testers[idx], changes)
    if (oldStatus && changes?.status) {
      this.counts[oldStatus] -= 1
      this.counts[changes.status] += 1
    }
  }

  @action
  async getCounts() {
    try {
      const examId = this.examStore?.id
      const res = await fetchAPIwithToken(`/exams/${examId}/testers/count`)
      const { status, payload } = res
      if (status === 'ok') this.counts = Object.assign({}, this.counts, res.payload.counts)
    } catch {}
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
