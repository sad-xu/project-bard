export default interface MIDI {
  _id: string
  name: string
  // 简介
  desc: string
  // 资源地址
  file: string
  // MIDI 音符个数 -- 难度
  notesNum: number
  // 详情访问数
  watchNum: number
  // 收藏数
  collectedNum: number
  // 上传人
  uploaderId: string
  uploaderName: string
  // 上传人是否是作者
  isAuth: boolean
  // 上传人不是作者时，真正的作者名
  authName: string
  // 上传时间
  uploadTime: number
  // 最近修改时间
  lastModified: number
}
