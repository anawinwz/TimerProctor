export const toOptions = (object) => Object.keys(object).map(value => ({ label: object[value], value }))

export const validators = {
  equal: (values) => (rule, value) => 
    value == values[0] ? 
    Promise.resolve() : Promise.reject(rule.message || `ต้องเป็นตัวเลขที่เท่ากับ ${values[0]}`),
  nEqual: (values) => (rule, value) => 
    value != values[0] ? 
    Promise.resolve() : Promise.reject(rule.message || `ต้องเป็นตัวเลขที่ไม่เท่ากับ ${values[0]}`),
  notBetween: (values) => (rule, value) => 
    value <= values[0] || value >= values[1] ? 
    Promise.resolve() : Promise.reject(rule.message || `ต้องเป็นตัวเลขที่ไม่อยู่ระหว่าง ${values[0]} - ${values[1]}`),
  
  includes: (values) => (rule, value) => 
    value.includes(values[0]) ? 
    Promise.resolve() : Promise.reject(rule.message || `ต้องมี ${values[0]}`),
  notIncludes: (values) => (rule, value) => 
    !value.includes(values[0]) ? 
    Promise.resolve() : Promise.reject(rule.message || `ต้องไม่มี ${values[0]}`),
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
  },
  number: {
    min: "ต้องเป็นตัวเลขที่ไม่น้อยกว่า ${min}",
    max: "ต้องเป็นตัวเลขที่ไม่มากกว่า ${max}",
    range: "ต้องเป็นตัวเลขที่อยู่ระหว่าง ${min} และ ${max}",
  }
}
