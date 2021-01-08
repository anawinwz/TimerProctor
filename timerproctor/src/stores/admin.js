import { createContext, useContext } from 'react'
import { create } from 'mobx-persist'

import AuthStore from './AuthStore'
import ExamStore from './ExamStore'

export class AdminRootStore {
  constructor() {
    const hydrate = create()
    this.AuthStore = new AuthStore(this)
    hydrate('admin_auth', this.AuthStore)
    
    this.ExamStore = new ExamStore(this)
  }
}

export const StoreContext = createContext(AdminRootStore)

export const useStore = () => useContext(StoreContext)

export default AdminRootStore
