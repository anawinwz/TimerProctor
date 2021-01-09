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
  constructor() {
    this.AppStore = new AppStore()

    const hydrate = create()
    this.AuthStore = new AuthStore(this)
    hydrate('auth', this.AuthStore).then(() => this.AppStore.hydrateFinish())
    
    this.ExamStore = new ExamStore(this)
    this.TimerStore = new TimerStore(this)
    this.SocketStore = new SocketStore(this)
    this.AttemptStore = new AttemptStore(this)
    this.IDCheckStore = new IDCheckStore(this)
  }
}

export const StoreContext = createContext(RootStore)

export const useStore = () => useContext(StoreContext)

export default RootStore
