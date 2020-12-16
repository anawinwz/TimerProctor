export const toOptions = (object) => Object.keys(object).map(value => ({ label: object[value], value }))
