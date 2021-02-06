export const toOptions = (object) => Object.keys(object).map(value => ({ label: object[value], value }))

export const validators = {
  equal: (values) => (rule, value) => 
    value == values[0] ? 
    Promise.resolve() : Promise.reject(rule.message || `ค่าต้องเท่ากับ ${values[0]}`),
  nEqual: (values) => (rule, value) => 
    value != values[0] ? 
    Promise.resolve() : Promise.reject(rule.message || `ค่าต้องไม่เท่ากับ ${values[0]}`),
  notBetween: (values) => (rule, value) => 
    value <= values[0] || value >= values[1] ? 
    Promise.resolve() : Promise.reject(rule.message || `ค่าต้องไม่อยู่ระหว่าง ${values[0]} - ${values[1]}`)
}

export const validateMessages = {
  required: 'คำถามนี้จำเป็นต้องตอบ',
  types: {
    string: 'ต้องเป็นข้อความ',
    number: 'ต้องเป็นตัวเลข',
    date: 'ต้องเป็นวันที่',
    integer: 'ต้องเป็นจำนวนเต็ม',
    float: 'ต้องเป็นจำนวนทศนิยม',
    email: 'ต้องเป็นอีเมล',
    url: 'ต้องเป็นลิงก์'
  }
}
