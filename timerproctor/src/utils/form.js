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
