import { action, observable } from 'mobx'
import { APIFailedError, fetchAPIwithToken } from '~/utils/api'
import { storage } from '~/utils/firebase'
class AttemptStore {
  @observable status = 'login'
  @observable socketToken = ''

  constructor(rootStore) {
    this.rootStore = rootStore
    this.authStore = this.rootStore.AuthStore
    this.examStore = this.rootStore.ExamStore
    this.socketStore = this.rootStore.SocketStore
  }

  @action
  async getAttempt() {
    const examId = this.examStore.id
    
    const { status: resStatus, message, payload } = await fetchAPIwithToken(`/exams/${examId}/attempt`, {})
    if (!resStatus || !['failed', 'ok'].includes(resStatus)) throw new Error(message || 'ไม่สามารถขอเริ่มการสอบได้')
    else if (resStatus === 'failed') throw new APIFailedError(message)

    const { status, socketToken } = payload
    this.status = status
    this.socketToken = socketToken
  }

  @action
  submitSnapshot(image) {
    const socket = this.socketStore?.socket
    return new Promise(async (resolve, reject) => {
      try {
        const ext = image.includes('/png') ? 'png' : 'jpeg'
        const timestamp = Date.now()
        const ref = `${this.authStore.userId}/${this.examStore.id}/snaps/${timestamp}.${ext}`
      
        await storage.ref(ref).putString(image, 'data_url')

        const url = await storage.ref(ref).getDownloadURL()
        socket.emit('snapshot', { image: url, facesCount: 1, timestamp: timestamp }, data => {
          if (data?.err) return reject(new Error(data.err))
          resolve()
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default AttemptStore
