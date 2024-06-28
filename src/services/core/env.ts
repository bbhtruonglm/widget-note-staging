import type { Env } from '@/interface/env'

/**export các biến môi trường dựa theo node_env hiện tại */
export async function currentEnv() {
  try {
    // lấy current env
    const NODE_ENV = import.meta.env.VITE_APP_ENV || 'development'

    // load file config theo env
    let r = await import(`@/services/env/${NODE_ENV}.ts`)
    if (r) {
      const ENV: { default: Env } = r
      // proceed(null, {$env: ENV.default, $node_env: NODE_ENV});
      return { $env: ENV.default, $node_env: NODE_ENV }
    }
  } catch (error) {
    console.log('get current env', error)
    throw 'Lỗi lấy current env'
  }
}

export async function loadEnv() {
  try {
    // lấy biến môi trường của môi trường hiện tại
    let r = await currentEnv()
    if (!r) return
    // thiết lập vào biến global
    globalThis.$env = r.$env
    globalThis.$node_env = r.$node_env
  } catch (error) {
    console.log('load env', error)
    throw error
  }
}
