import { createContext, useContext } from 'react'
import { create } from 'mobx-persist'

import AuthStore from './AuthStore'
import ExamStore from './ExamStore'
import AttemptStore from './AttemptStore'
import TimerStore from './TimerStore'
import IDCheckStore from './IDCheckStore'

export class RootStore {
  constructor() {
    const hydrate = create()
    this.AuthStore = new AuthStore(this)
    hydrate('auth', this.AuthStore)
    
    this.ExamStore = new ExamStore(this)
    this.AttemptStore = new AttemptStore(this)
    this.TimerStore = new TimerStore(this)
    this.IDCheckStore = new IDCheckStore(this)
  }
}

export const StoreContext = createContext(RootStore)

export const useStore = () => useContext(StoreContext)

export default RootStore
