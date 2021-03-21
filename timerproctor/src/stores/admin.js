import { createContext, useContext } from 'react'
import { create } from 'mobx-persist'

import AppStore from './AppStore'

import AuthStore from './AuthStore'
import ExamStore from './ExamStore'
import ExamAdminStore from './admin/ExamAdminStore'
import SocketStore from './SocketStore'

export class AdminRootStore {
  constructor(initialState = {}) {
    this.AppStore = new AppStore()

    const hydrate = create()
    this.AuthStore = new AuthStore(this, initialState.AuthStore, true)
    if (typeof window !== 'undefined') 
      hydrate('admin_auth', this.AuthStore)
        .then(async () => {
          try {
            await this.AuthStore.token.renewToken()
          } catch {
          } finally {
            this.AppStore.hydrateFinish()
          }
        })
    
    this.ExamStore = new ExamStore(this, initialState.ExamStore, true)
    this.ExamAdminStore = new ExamAdminStore(this, initialState.ExamAdminStore)
    this.SocketStore = new SocketStore(this, initialState.SocketStore)
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
