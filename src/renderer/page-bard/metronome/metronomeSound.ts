import { base64ToArrayBuffer, METRO_VLOUME } from '../../utils'
import path from 'path'

/** 声音类型 */
type SoundType = 'ding' | 'da'

/** 默认配置 */
let currentVolume = Number(localStorage.getItem(METRO_VLOUME)) || 0.3

/** 节拍器 发声 */
class MetronomeSound {
  context: AudioContext
  volume: number
  totalGainNode: GainNode
  ding: AudioBuffer | null
  da: AudioBuffer | null

  constructor() {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const totalGainNode = context.createGain()
    const compressor = context.createDynamicsCompressor()
    totalGainNode.connect(compressor)
    compressor.connect(context.destination)

    this.context = context
    this.volume = currentVolume // 音量百分比
    this.totalGainNode = totalGainNode
    this.ding = null
    this.da = null

    // 初始化加载音源
    this.getAudioBuffer()
    // 初始化音量
    this.setVolume(currentVolume)
  }

  /** 获取音源 */
  getAudioBuffer() {
    const json = require('../../assets/soundfonts/dingda.json')
    const dingBuffer = base64ToArrayBuffer(json.ding)
    const daBuffer = base64ToArrayBuffer(json.da)
    this.context.decodeAudioData(dingBuffer, (audioBuffer) => {
      this.ding = audioBuffer
    })
    this.context.decodeAudioData(daBuffer, (audioBuffer) => {
      this.da = audioBuffer
    })
  }

  /** sing */
  _sing(name: SoundType) {
    const context = this.context
    const bufferSourceNode = context.createBufferSource()
    const gainNode = context.createGain()
    if (!this[name]) return
    bufferSourceNode.buffer = this[name]
    bufferSourceNode.connect(gainNode)
    gainNode.connect(this.totalGainNode)

    const currentTime = context.currentTime
    bufferSourceNode.start()
    gainNode.gain.setValueAtTime(1, currentTime)
  }

  /** ding */
  singDing() {
    this._sing('ding')
  }

  /** da */
  singDa() {
    this._sing('da')
  }

  /** 设置音量 */
  setVolume(percentage: number = 0.3) {
    if (percentage <= 0) percentage = 0.0001
    this.volume = percentage
    this.totalGainNode.gain.exponentialRampToValueAtTime(
      3.4 * percentage,
      this.context.currentTime + 1
    )
  }
}

export default new MetronomeSound()
