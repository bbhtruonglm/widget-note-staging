import type { Env } from '@/interface/env'

/**export các biến môi trường dựa theo node_env hiện tại */
export async function currentEnv() {
  // lấy current env
  const NODE_ENV = import.meta.env.VITE_APP_ENV || 'development'

  // load file config theo env
  let r = await import(`@/services/env/${NODE_ENV}.ts`)
  if (r) {
    const ENV: { default: Env } = r
    // proceed(null, {$env: ENV.default, $node_env: NODE_ENV});
    return { $env: ENV.default, $node_env: NODE_ENV }
  }
}

export async function loadEnv() {
  let r = await currentEnv()
  if (!r) return
  globalThis.$env = r.$env
  globalThis.$node_env = r.$node_env
}
