import { createContext, useContext } from 'react'
import { create } from 'mobx-persist'

import AuthStore from './AuthStore'
import ExamStore from './ExamStore'
import TimerStore from './TimerStore'
import IDCheckStore from './IDCheckStore'

export class RootStore {
  constructor() {
    const hydrate = create()
    this.AuthStore = new AuthStore(this)
    hydrate('auth', this.AuthStore)
    this.ExamStore = new ExamStore(this)
    this.TimerStore = new TimerStore(this)
    this.IDCheckStore = new IDCheckStore(this)
  }
}

export const StoreContext = createContext()

export const useStore = () => useContext(StoreContext)

export default RootStore
