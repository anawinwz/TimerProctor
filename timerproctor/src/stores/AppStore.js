import { action, observable } from 'mobx'
class AppStore {
  @observable hydrated = false
  @action hydrateFinish() {
    this.hydrated = true
  }
}

export default AppStore
