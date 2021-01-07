import { action, computed, observable } from 'mobx'
class IDCheckStore {
  @observable sendState = ['IDLE', '']
  @observable accepted = null
  @observable reason = ''

  constructor(rootStore) {
    this.rootStore = rootStore
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
  submit(image) {
    return fetchAPI(`/users/submitIDCheck`, {
      userId: this.rootStore.AuthStore.userId,
      image: image
    })
  }

  @computed
  get isIDApproved() {
    return this.accepted === true
  }
}

export default IDCheckStore
