export class ValidationError extends Error {
  constructor(fieldName, message = `${fieldName} ไม่ถูกต้อง`) {
    super('There are some data validation errors ocurred.')
    this.name = 'ValidationError'
    this.errors = {
      [fieldName]: { message }
    }
  }
}
