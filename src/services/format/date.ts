/** chuyển thời gian dạng timstamp sang HH:mm  - DD/MM/YYYY */
export function convertTimeList(value: string) {
  // kiểm tra giá trị truyền vào có tồn tại hay không
  if (!value) return ''
  // lấy giá trị của ngày được truyền vào
  const date = new Date(value)
  // lấy giờ của thời gian truyền vào
  const hours = ('0' + date.getHours()).slice(-2)
  // lấy phút của thời gian truyền vào
  const minutes = ('0' + date.getMinutes()).slice(-2)
  // lấy ngày của thời gian truyền vào
  const day = ('0' + date.getDate()).slice(-2)
  // lấy tháng của thời gian truyền vào
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  // lấy năm của thời gian truyền vào
  const year = date.getFullYear()
  //trả về định dạng HH:mm - DD/MM/YYYY
  return `${hours}:${minutes} - ${day}/${month}/${year}`
}

export function timestampToDate(value: number) {
  if (!value) return ''
  const date = new Date(value)
  const day = ('0' + date.getDate()).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2) // Month is zero-indexed
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
