import { createContext, useContext } from 'react'
import { create } from 'mobx-persist'

import AuthStore from './AuthStore'
import ExamStore from './ExamStore'
import ExamAdminStore from './admin/ExamAdminStore'

export class AdminRootStore {
  constructor() {
    const hydrate = create()
    this.AuthStore = new AuthStore(this, true)
    hydrate('admin_auth', this.AuthStore)
    
    this.ExamStore = new ExamStore(this)
    this.ExamAdminStore = new ExamAdminStore(this)
  }
}

export const StoreContext = createContext(AdminRootStore)

export const useStore = () => useContext(StoreContext)

export default AdminRootStore
