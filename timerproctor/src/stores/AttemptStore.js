import { action, observable } from 'mobx'
import { fetchAPIwithToken } from '../utils/api'
class AttemptStore {
  @observable status = 'login'
  @observable socketToken = ''

  constructor(rootStore) {
    this.rootStore = rootStore
    this.examStore = this.rootStore.ExamStore
    this.idCheckStore = this.rootStore.IDCheckStore
  }

  @action
  async getAttempt() {
    const examId = this.examStore.id
    
    const { status: resStatus, message, payload } = await fetchAPIwithToken(`/exams/${examId}/attempt`, {})
    if (!resStatus || resStatus !== 'ok') throw new Error(message || 'ไม่สามารถขอเริ่มการสอบได้')

    const { status, socketToken, idCheck: { accepted, reason } } = payload
    this.status = status
    this.socketToken = socketToken
    this.idCheckStore.setResult(accepted, reason)
  }
}

export default AttemptStore
