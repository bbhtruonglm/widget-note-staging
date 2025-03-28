import { requestV2 } from '@/services/request'
import { useMerchantStore } from '@/services/stores'

import { InputRequestApi } from '@/interface/request'

/** api gọi đến domain merchant */
export async function apiRequestMerchant({ end_point, body }: InputRequestApi) {
  try {
    // * Call api với domain merchant
    const data = await requestV2({
      path: `${globalThis.$env.merchant}/${end_point}`,
      method: 'POST',
      json: true,
      body,
    })

    // * Trả về dữ liệu
    return data
  } catch (e) {
    throw e
  }
}

/** api gọi đến domain contact */
export async function apiRequestContact({ end_point, body }: InputRequestApi) {
  try {
    // * Call api với domain contact
    const data = await requestV2({
      path: `${globalThis.$env.contact}/${end_point}`,
      method: 'POST',
      json: true,
      headers: {
        'token-business': useMerchantStore().merchant_token,
      },
      body,
    })

    // * Trả về dữ liệu
    return data
  } catch (e) {
    throw e
  }
}

/** api lấy thông tin từ merchant */
export async function apiGetInfoMerchant(params: InputRequestApi) {
  try {
    return await apiRequestMerchant({
      end_point: 'public/chatbox/get_config',
      ...params,
    })
  } catch (error) {
    throw error
  }
}

/** api lấy thông tin từ contact */
export async function apiGetInfoContact(params: InputRequestApi) {
  try {
    return await apiRequestContact({
      end_point: 'contact/chatbox_sync_contact',
      ...params,
    })
  } catch (error) {
    throw error
  }
}

/** api tạo ghi chú contact */
export async function apiCreateNoteContact(params: InputRequestApi) {
  try {
    return await apiRequestContact({
      end_point: 'note/create_note',
      ...params,
    })
  } catch (error) {
    throw error
  }
}
