/**
 * .env.dev
 */

import type { Env } from '@/interface/env'

const ENV: Env = {
  secret_key: '0cf5516973a145929ff36d3303183e5f',
  merchant: 'https://api.merchant.vn/v1',
  contact: 'https://api-contact.merchant.vn'
}

export default ENV
