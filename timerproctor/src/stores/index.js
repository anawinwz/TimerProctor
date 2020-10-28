import { createContext, useContext } from 'react'
import auth from './auth'
import exam from './exam'

export const store = {
  AuthStore: auth,
  ExamStore: exam
}

export const StoreContext = createContext(store)

export const useStore = () => useContext(StoreContext)

export default store
