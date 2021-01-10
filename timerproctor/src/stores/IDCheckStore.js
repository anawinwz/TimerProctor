import { action, computed, observable } from 'mobx'
import { storage } from '~/utils/firebase'
class IDCheckStore {
  @observable sendState = ['IDLE', '']
  @observable accepted = null
  @observable reason = ''

  constructor(rootStore) {
    this.rootStore = rootStore
    this.authStore = this.rootStore?.AuthStore
    this.examStore = this.rootStore?.ExamStore
    this.socketStore = this.rootStore?.SocketStore
  }

  @action
  setSendState(state) {
    this.sendState = state
  }

  @action
  setResult(accepted, reason = '') {
    this.accepted = accepted
    this.reason = reason
  }

  @action
  submit(image = '') {
    const socket = this.socketStore?.socket
    return new Promise(async (resolve, reject) => {
      if (!socket) reject(new Error('การเชื่อมต่อเซิร์ฟเวอร์ขาดหาย'))
      
      try {
        const ext = image.includes('/png') ? 'png' : 'jpeg'
        const ref = `${this.authStore.userId}/${this.examStore.id}/idCheck.${ext}`
        const timestamp = Date.now()
      
        await storage.ref(ref).putString(image, 'data_url')

        const url = await storage.ref(ref).getDownloadURL()
        socket.emit('idCheck', { image: url, timestamp: timestamp }, data => {
          if (data?.err) return reject(new Error(data.err))
          resolve()
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  @computed
  get isIDApproved() {
    return this.accepted === true
  }
}

export default IDCheckStore
