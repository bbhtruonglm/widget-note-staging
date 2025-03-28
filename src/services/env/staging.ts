/**
 * .env.dev
 */

import type { Env } from '@/interface/env'

const ENV: Env = {
  secret_key: '348a2bd13920409d8fa4248a8bde1020',
  merchant: 'https://api.merchant.vn/v1',
  contact: 'https://api-contact.merchant.vn'
}

export default ENV
