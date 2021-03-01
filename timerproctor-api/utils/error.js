class ValidationError extends Error {
  constructor(errors = {}) {
    super('There are some data validation errors ocurred.')
    this.name = 'ValidationError'
    this.errors = errors
  }
}
