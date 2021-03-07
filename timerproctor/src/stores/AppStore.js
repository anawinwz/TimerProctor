import { action, observable } from 'mobx'
class AppStore {
  @observable hydrated = typeof window === 'undefined' ? true: false
  @action hydrateFinish() {
    this.hydrated = true
  }
}

export default AppStore
