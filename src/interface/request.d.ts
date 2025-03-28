/** các phương thức request */
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

/** kiểu dữ liệu truyền vào của các request */
interface InputRequest {
  /** path của request */
  path: string
  /** phương thức request */
  method: Method
  /** body của request */
  body?: any
  /** body đầu vào là json, trả kết quả về json */
  json?: boolean
  /** tham số header */
  headers?: HeadersInit
}

/** Đầu vào để request api */
export interface InputRequestApi {
  /** Dữ liệu gửi đi */
  body?: any
  /** Đuôi api */
  end_point?: string
  /** Headers */
  headers?: {}
}
