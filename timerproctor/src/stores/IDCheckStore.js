import { action, computed, observable } from 'mobx'
class IDCheckStore {
  @observable sendState = ['IDLE', '']
  @observable accepted = null
  @observable reason = ''

  constructor(rootStore) {
    this.rootStore = rootStore
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
  async submit(image) {
    const socket = this.socketStore?.socket
    return new Promise((resolve, reject) => {
      if (!socket) reject(new Error('การเชื่อมต่อเซิร์ฟเวอร์ขาดหาย'))
      
      socket.emit('idCheck', { image, timestamp: Date.now() }, data => {
        if (data?.err) return reject(new Error(data.err))
        resolve()
      })
    })
  }

  @computed
  get isIDApproved() {
    return this.accepted === true
  }
}

export default IDCheckStore
