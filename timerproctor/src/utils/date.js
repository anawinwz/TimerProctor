import moment from 'moment'
import 'moment/locale/th'
moment.locale('th')

const formats = {
  time: 'LT',
  shortNoTime: 'D MMM YYYY',
  short: 'D MMM YYYY LT',
  full: 'D MMMM YYYY LT'
}

export const isMoment = (obj) => moment.isMoment(obj)

export const fromNowStr = (date) => date ? moment(date).fromNow(true) : '...'

export const dateStr = (date, type = 'short') => date ? moment(date).format(formats[type]) : '-'

export const shortDateStr = (date) => dateStr(date, 'short')

export const rangeStr = (a, b, type = 'short') => {
  if (!a || !b) return '-'
  let startDate = `${dateStr(a, type)}`
  if (moment(a).isSame(b, 'day')) return `${startDate} - ${dateStr(b, 'time')}`
  return `${startDate} - ${dateStr(b, type)}`
}
