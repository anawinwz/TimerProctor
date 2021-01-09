import { action, observable } from 'mobx'
import { io } from 'socket.io-client'

class SocketStore {
  @observable socket
  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action
  init(url, opts = {}) {
    if (this.socket) this.destroy()

    if (typeof opts.autoConnect === 'undefined') 
      opts.autoConnect = false

    this.socket = io(url, opts)
    return this.socket
  }

  @action
  destroy() {
    if (!this.socket) return

    this.socket.removeAllListeners()
    this.socket.close()
    this.socket = null
  }
}

export default SocketStore
