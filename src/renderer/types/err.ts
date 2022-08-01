/**
 * event 监听报错事件
 * rejection 异步报错未处理
 * boundary react-错误边界
 * request 服务端错误
 * resource 资源加载失败
 */
export type ErrSource =
  | 'event'
  | 'rejection'
  | 'boundary'
  | 'request'
  | 'resource'

export default interface Err {
  _id: string
  // 错误来源
  source: ErrSource
  // 报错信息
  msg: string
  // 错误堆栈
  stack: string
  // 浏览器信息
  agent: string
  // 尺寸
  size: string
  // 用户id 可选
  userId: string
  // 错误发生时间
  t: number
}
