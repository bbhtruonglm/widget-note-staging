import { InputRequest } from '@/interface/request'
import { DOMAIN } from '@/services/constant/domain'
import WIDGET from 'bbh-chatbox-widget-js-sdk'
/** hàm gọi API */
export const request = async ({
  path,
  method,
  json,
  body = {},
  headers = {},
}: InputRequest) => {
  try {
    // nếu body là json thì chuyển sang dạng chuỗi và tên các tham số header
    if (json) {
      body = JSON.stringify(body)
      headers = {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        // lấy access token từ widget sdk
        token: WIDGET.access_token || '',
        key: globalThis.$env.secret_key,
        ...headers,
      }
    }
    //nếu method là GET thì bỏ body
    if (method === 'GET') body = undefined
    //call api
    let result: any = await fetch(DOMAIN + path, { method, headers, body })
    //chuyển kết quả về json
    if (json) result = await result.json()
    return result
  } catch (e) {
    console.log('asyncRequest', e)
    throw e
  }
}
