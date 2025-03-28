/** kiểu dữ liệu của biến môi trường */
export interface Env {
  /** key bí mật của widget */
  secret_key: string
  /** domain call api merchant */
  merchant: string
  /** domain call api contact */
  contact: string
}
