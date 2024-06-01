/** các phương thức request */
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

/** kiểu dữ liệu truyền vào của các request */
interface InputRequest {
  /** uri của request */
  uri: string
  /** phương thức request */
  method: Method
  /** body của request */
  body?: any
  /** body đầu vào là json, trả kết quả về json */
  json?: boolean
  /** tham số header */
  headers?: HeadersInit
}
