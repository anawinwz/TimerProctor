import { action, makeAutoObservable } from 'mobx'
import { fetchAPI } from '../utils/api'

class Exam {
  loading = false
  id = ''
  name = ''
  info = {}
  
  constructor() {
    makeAutoObservable(this)
  }

  @action
  setId(id) {
    this.id = id
  }

  @action
  async getInfo(options = {}) {
    const { id, reload = false } = options
    if (!reload && this.info.name && (!id || this.id === id)) {
      return this.info
    }

    if (id) this.setId(id)

    try {
      this.loading = true
      this.info = await fetchAPI(`/exams/${this.id}/info`)
      this.name = this.info.name
    } catch (err) {
      this.info = {}
    } finally {
      this.loading = false
    }
  }
}

const ExamStore = new Exam()
export default ExamStore
