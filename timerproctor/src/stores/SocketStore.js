import { action, observable } from 'mobx'
import { io } from 'socket.io-client'
import { baseUrl } from '~/utils/api'
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

    if (!url.includes('http')) url = `${baseUrl}${url}`
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
