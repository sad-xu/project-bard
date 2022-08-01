export default interface User {
  _id: string // openid
  name: string
  // 头像
  avatar: string
  // 个人介绍
  desc: string
  // 权限级别
  level: number
  // 创建时间
  createTime: number
  // 已收藏乐谱
  collection?: SimpleMIDI[]
  // 已创建乐谱
  creation?: SimpleMIDI[]
  // 按键配置
  keyConfig?: string
}

interface SimpleMIDI {
  _id: number
  name: string
}
