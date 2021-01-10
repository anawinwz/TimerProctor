import { action, observable } from 'mobx'
import { fetchAPIwithToken } from '~/utils/api'

class ExamAdminStore {
  @observable counts = {}
  @observable socketToken = ''

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
