declare global {
  var access_token: string | null;
  /**dữ liệu cấu hình của môi trường hiện tại */
  var $env: Env;
  /**NODE_ENV hiện tại */
  var $node_env: string;
}
export default global;
