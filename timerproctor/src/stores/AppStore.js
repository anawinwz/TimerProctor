import { action, observable } from 'mobx'
import { isModelLoaded, loadModel } from '~/utils/faceDetection'

class AppStore {
  @observable hydrated = typeof window === 'undefined' ? true : false
  @observable isFaceModelLoaded = false

  @action
  async loadFaceModel() {
    await loadModel()
    
    this.isFaceModelLoaded = isModelLoaded()
  }

  @action
  hydrateFinish() {
    this.hydrated = true
  }
}

export default AppStore
