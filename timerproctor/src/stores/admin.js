import { createContext, useContext } from 'react'

import AppStore from './AppStore'

import AuthStore from './AuthStore'
import ExamStore from './ExamStore'
import ExamAdminStore from './admin/ExamAdminStore'
import SocketStore from './SocketStore'
import TimerStore from './TimerStore'

export class AdminRootStore {
  constructor(initialState = {}) {
    this.AppStore = new AppStore()

    this.AuthStore = new AuthStore(this, initialState.AuthStore, true)    
    this.ExamStore = new ExamStore(this, initialState.ExamStore, true)
    this.SocketStore = new SocketStore(this, initialState.SocketStore)
    this.TimerStore = new TimerStore(this, initialState.TimerStore)
    this.ExamAdminStore = new ExamAdminStore(this, initialState.ExamAdminStore)

    this.AppStore.hydrateFinish()
  }

  toJSON() {
    return {
      AuthStore: this.AuthStore.toJSON(),
      ExamStore: this.ExamStore.toJSON()
    }
  }
}

export const AdminStoreContext = createContext(AdminRootStore)

export const useStore = () => useContext(AdminStoreContext)

export default AdminRootStore
