import { createContext, useContext } from 'react'
import { create } from 'mobx-persist'

import AppStore from './AppStore'

import AuthStore from './AuthStore'
import ExamStore from './ExamStore'
import ExamAdminStore from './admin/ExamAdminStore'

export class AdminRootStore {
  constructor() {
    this.AppStore = new AppStore()

    const hydrate = create()
    this.AuthStore = new AuthStore(this, true)
    hydrate('admin_auth', this.AuthStore).then(() => this.AppStore.hydrateFinish())
    
    this.ExamStore = new ExamStore(this)
    this.ExamAdminStore = new ExamAdminStore(this)
  }
}

export const AdminStoreContext = createContext(AdminRootStore)

export const useStore = () => useContext(AdminStoreContext)

export default AdminRootStore
