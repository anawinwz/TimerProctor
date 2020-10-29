import { createContext, useContext } from 'react'
import auth from './auth'
import exam from './exam'
import timer from './timer'

export const store = {
  AuthStore: auth,
  ExamStore: exam,
  TimerStore: timer
}

export const StoreContext = createContext(store)

export const useStore = () => useContext(StoreContext)

export default store
