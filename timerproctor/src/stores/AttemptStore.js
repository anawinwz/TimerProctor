import { action, observable } from 'mobx'
import { APIFailedError, fetchAPIwithToken } from '~/utils/api'
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
    if (!resStatus || !['failed', 'ok'].includes(resStatus)) throw new Error(message || 'ไม่สามารถขอเริ่มการสอบได้')
    else if (resStatus === 'failed') throw new APIFailedError(message)

    const { status, socketToken, idCheck: { accepted } } = payload
    this.status = status
    this.socketToken = socketToken
    if (accepted) this.idCheckStore.setResult(accepted)
  }
}

export default AttemptStore
