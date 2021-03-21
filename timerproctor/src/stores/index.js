import { createContext, useContext } from 'react'
import { create } from 'mobx-persist'

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

    const hydrate = create()
    this.AuthStore = new AuthStore(this, initialState.AuthStore)
    if (typeof window !== 'undefined')
      hydrate('auth', this.AuthStore)
        .then(() => this.AppStore.hydrateFinish())
    
    this.ExamStore = new ExamStore(this, initialState.ExamStore)
    this.TimerStore = new TimerStore(this, initialState.TimerStore)
    this.SocketStore = new SocketStore(this, initialState.SocketStore)
    this.IDCheckStore = new IDCheckStore(this, initialState.IDCheckStore)
    this.AttemptStore = new AttemptStore(this, initialState.AttemptStore)
  }
}

export const StoreContext = createContext(RootStore)

export const useStore = () => useContext(StoreContext)

export default RootStore
