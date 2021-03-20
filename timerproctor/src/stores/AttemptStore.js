import { action, observable } from 'mobx'
import { APIFailedError, fetchAPIwithToken } from '~/utils/api'
import { storage } from '~/utils/firebase'
class AttemptStore {
  @observable status = 'loggedin'
  @observable socketToken = ''

  constructor(rootStore) {
    this.rootStore = rootStore
    this.authStore = this.rootStore.AuthStore
    this.examStore = this.rootStore.ExamStore
    this.socketStore = this.rootStore.SocketStore
    this.idCheckStore = this.rootStore.IDCheckStore
  }

  @action
  async getAttempt() {
    const examId = this.examStore.id
    
    const { status: resStatus, message, payload } = await fetchAPIwithToken(`/exams/${examId}/testers`, {})
    if (!resStatus || !['failed', 'ok'].includes(resStatus)) throw new Error(message || 'ไม่สามารถขอเริ่มการสอบได้')
    else if (resStatus === 'failed') throw new APIFailedError(message)

    const { status, socketToken, idCheck } = payload
    this.status = status
    if (idCheck) {
      const { accepted, reason } = idCheck
      this.idCheckStore.setResult(accepted, reason)
    }
    this.socketToken = socketToken
  }

  @action
  submitSnapshot(image, facesCount = undefined, timestamp = Date.now()) {
    const socket = this.socketStore?.socket
    return new Promise(async (resolve, reject) => {
      try {
        const ext = image.includes('/png') ? 'png' : 'jpeg'
        const ref = `testtakers/${this.authStore.firebaseUID}/${this.examStore.id}/snaps/${timestamp}.${ext}`
      
        await storage.ref(ref).putString(image, 'data_url')

        const url = await storage.ref(ref).getDownloadURL()
        socket?.emit('snapshot', { image: url, facesCount: facesCount, timestamp: timestamp }, data => {
          if (data?.err) return reject(new Error(data.err))
          resolve()
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  @action
  setStatus(status = '') {
    if (!status) return false
    if (['completed'].includes(status) && !['started'].includes(this.status))
      return false
    this.status = status
  }

  @action
  setCompleted() {
    const socket = this.socketStore?.socket
    if (this.status === 'started') {
      socket?.emit('complete')
      this.status = 'completed'
    }
  }
}

export default AttemptStore
