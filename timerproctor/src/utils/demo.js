import { testerStatuses } from './const'

export const randomItem = (items) => items[Math.floor(Math.random() * items.length)]

export const getTesters = (size = 8) => {
  const statuses = Object.keys(testerStatuses)
  let result = []
  for (let i = 0; i < size; i++) {
    const status = randomItem(statuses)
    result.push({
      "lastSnapshot": {
        "url": status === 'authenticate' ? `https://picsum.photos/360/240` : `https://picsum.photos/240/180`
      },
      "_id": 1234 + i,
      "name": `demo${i}`,
      "status": status,
    })
  }
  return result
}
