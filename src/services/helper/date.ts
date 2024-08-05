import { isAfter } from 'date-fns/isAfter'
/** kiểm tra xem ngày có hợp lệ không */
export function checkDate(date: string | number) {
  if (!date) return false
  let date_temp = new Date(Number(date))
  if(!isAfter(date_temp, new Date())) return false
  return true
}