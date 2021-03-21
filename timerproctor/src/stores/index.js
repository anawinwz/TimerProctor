import { createContext, useContext } from 'react'

import AppStore from './AppStore'

import AuthStore from './AuthStore'
import ExamStore from './ExamStore'
import AttemptStore from './AttemptStore'
import TimerStore from './TimerStore'
import IDCheckStore from './IDCheckStore'
import SocketStore from './SocketStore'

export class RootStore {
  constructor(initialState = {}) {
    this.AppStore = new AppStore()

    this.AuthStore = new AuthStore(this, initialState.AuthStore)
    this.ExamStore = new ExamStore(this, initialState.ExamStore)
    this.TimerStore = new TimerStore(this, initialState.TimerStore)
    this.SocketStore = new SocketStore(this, initialState.SocketStore)
    this.IDCheckStore = new IDCheckStore(this, initialState.IDCheckStore)
    this.AttemptStore = new AttemptStore(this, initialState.AttemptStore)

    this.AppStore.hydrateFinish()
  }

  toJSON() {
    return {
      AuthStore: this.AuthStore.toJSON(),
      ExamStore: this.ExamStore.toJSON()
    }
  }
}

export const StoreContext = createContext(RootStore)

export const useStore = () => useContext(StoreContext)

export default RootStore
