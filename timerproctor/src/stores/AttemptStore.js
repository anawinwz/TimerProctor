import { action, observable } from 'mobx'
class AttemptStore {
  @observable state = 'login'
  @observable socketToken = ''

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action
  getState() {}

  @action
  getSocketToken() {}
}

export default AttemptStore
