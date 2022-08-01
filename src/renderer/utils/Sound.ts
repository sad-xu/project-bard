/**
 * 乐器发声 0-127 FluidR3_GM_sf2_file
 * 声音资源 https://surikov.github.io/webaudiofontdata/sound/0020_Aspirin_sf2_file.html
 * 音色表 https://blog.csdn.net/muyao987/article/details/106854562
 */

import { base64ToArrayBuffer } from './index'

/** 音色 */
interface Zone {
  keyRangeLow: number
  keyRangeMiddle: number
  keyRangeHigh: number
  buffer: AudioBuffer | null
  loop: boolean
  loopStart: number
  loopEnd: number
  // coarseTune: number
  // fineTune: number
  // originalPitch: number
  sampleRate: number
}
interface OriginZone extends Zone {
  file: string
}

/** 所有实例 */
const instanceList: Sound[] = []
/** 所有乐器音色 */
// const soundFontMap: { [prop: string]: Zone[] } = {}
let currentZoneList: Zone[] = []

/** 默认配置 */
let currentVolume = 0
let currentDuration = 0.3
let currentIsMock = false

/** 发音器 */
// (AudioBufferSourceNode --> gainNode) --> totalGainNode --> compressor --> destination
class Sound {
  canMock: boolean
  isMock: boolean
  delay: number
  interval: number
  context: AudioContext
  volume: number
  duration: number
  totalGainNode: GainNode
  zoneList: Zone[]
  singing: { [prop: string]: [GainNode, AudioBufferSourceNode] }
  singingList: number[]
  currentSinging: [number] | null

  constructor({ canMock = false } = {}) {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    const totalGainNode = context.createGain()
    // const compressor = context.createDynamicsCompressor()
    // totalGainNode.connect(compressor)
    // compressor.connect(context.destination)
    totalGainNode.connect(context.destination)

    this.canMock = canMock
    this.isMock = currentIsMock
    this.delay = 300 // 按下延迟/毫秒
    this.interval = 500 // 最短间隔/毫秒

    this.context = context
    this.volume = currentVolume // 音量百分比
    this.duration = currentDuration // 声音持续时间
    this.totalGainNode = totalGainNode
    this.zoneList = currentZoneList // 当前音色
    this.singing = {} // 正在演奏的
    this.singingList = [] // 正在、待演奏未结束的的列表 mock 专用
    this.currentSinging = null // 正在演奏的列表 模拟用
    // 初始化参数
    this.setVolume(currentVolume || 0.3)
    // 保存实例
    instanceList.push(this)
  }

  /**
   * 听个响
   *  音符 48-59 60-71 72-83 84
   *  高 低 平 higher lower ''
   *  高/低 半音 high low
   */
  sing(note: number) {
    if (this.isMock) {
      // 按下延迟
      setTimeout(() => {
        // this.singingList.push(note)
        // setTimeout(() => {
        this._sing(note)
        // }, this.interval * (this.singingList.length - 1))
      }, this.delay)
    } else this._sing(note)
  }

  /** 真正的发声 */
  _sing(note: number) {
    if (note > 84) note = 84
    else if (note < 48) note = 48
    const context = this.context
    const bufferSourceNode = context.createBufferSource()
    const gainNode = context.createGain()
    const zone = this.zoneList.find(
      (zone) => zone.keyRangeLow <= note && zone.keyRangeHigh >= note
    )
    if (!zone) return
    bufferSourceNode.buffer = zone.buffer
    // 循环播放
    bufferSourceNode.loop = zone.loop
    if (zone.loop) {
      bufferSourceNode.loopStart = zone.loopStart / zone.sampleRate
      bufferSourceNode.loopEnd = zone.loopEnd / zone.sampleRate
    }

    bufferSourceNode.detune.value = (note - zone.keyRangeMiddle) * 100

    // 音调 通过控制播放速度调整频率
    // const baseDetune =
    //   zone.originalPitch - 100 * zone.coarseTune - zone.fineTune
    // const playbackRate = 1 * Math.pow(2, (100 * note - baseDetune) / 1200)
    // bufferSourceNode.playbackRate.value = playbackRate // 播放速度 - 频率

    bufferSourceNode.connect(gainNode)
    gainNode.connect(this.totalGainNode)

    const currentTime = context.currentTime
    bufferSourceNode.start()
    gainNode.gain.exponentialRampToValueAtTime(1, currentTime + 0.1)
    if (this.singing[note]) {
      this._soundOff(note + '')
    }
    // ff14模拟  同一时刻只能发一个声音，同时按下多个键，会按顺序快速切换至最后一个
    if (this.isMock) {
      // const keys = Object.keys(this.singing)
      // keys.forEach((k) => {
      //   if (k !== note + '') {
      //     console.log(k)
      //     this._soundOff(k)
      //   }
      // })
      // if (this.currentSinging) {
      //   this._soundOff(this.currentSinging[0] + '')
      // }
      // if (this.currentSinging) {
      // }
      // this.currentSinging = [note]
    }

    this.singing[note] = [gainNode, bufferSourceNode]
  }

  /** 停止单个 */
  silent(note: string | number) {
    if (this.isMock) {
      setTimeout(() => {
        this._soundOff(note + '')
      }, this.delay)
    } else this._soundOff(note + '')
  }

  /** 停止所有 */
  silentAll() {
    if (this.isMock) {
      setTimeout(() => {
        for (const key in this.singing) {
          // this.singingList.forEach(k => {
          this._soundOff(key)
        }
      }, this.delay)
    } else {
      for (const key in this.singing) {
        this._soundOff(key)
      }
    }
  }

  /** 静音 */
  _soundOff(key: string) {
    const currentSing = this.singing[key]
    if (currentSing) {
      const currentTime = this.context.currentTime
      // Fix: 最短音间隔至少0.1s
      // const truthTime =
      //   currentTime - currentSing[2] > 0.1 ? currentTime : currentSing[2] + 0.1
      currentSing[0].gain.setTargetAtTime(
        0,
        currentTime + 0.1,
        this.duration / 3
      )
      currentSing[1].stop(currentTime + this.duration)
      delete this.singing[key]
      if (this.isMock) {
        this.currentSinging = null
      }
    }
  }

  /** 设置自身音量 */
  setVolume(percentage: number) {
    if (percentage <= 0) percentage = 0.0001
    this.volume = percentage
    this.totalGainNode.gain.exponentialRampToValueAtTime(
      3.4 * percentage,
      this.context.currentTime + 1
    )
  }

  /** 设置自身持续时间 */
  setDuration(duration: number) {
    this.duration = duration
  }

  /** 设置自身是否模拟 */
  setIsMock(flag: boolean) {
    if (this.canMock) {
      this.isMock = flag
    }
  }

  /** 设置模拟参数 按下延迟 最短间隔*/
  setMockParams(delay: number, interval: number) {
    this.delay = delay
    this.interval = interval
  }

  /**
   * 静态方法
   */

  /** 设置模拟 */
  static setIsMock(val: string) {
    const flag = Boolean(+val)
    currentIsMock = flag
    instanceList.forEach((instance) => {
      instance.setIsMock(flag)
    })
  }

  static setMockParams(delay: number, interval: number) {
    instanceList.forEach((instance) => {
      instance.setMockParams(delay, interval)
    })
  }

  /** 设置总音量 */
  static setAllVolume = (percentage: number) => {
    currentVolume = percentage
    instanceList.forEach((instance) => {
      instance.setVolume(percentage)
    })
  }

  /** 设置持续时间 */
  static setAllDuration = (duration: number) => {
    currentDuration = duration
    instanceList.forEach((instance) => {
      instance.duration = duration
    })
  }

  /** 设置乐器 */
  static setAllZone = (name = 'ff-grandpiano') => {
    const context = instanceList.length
      ? instanceList[0].context
      : new (window.AudioContext || window.webkitAudioContext)()

    const soundFontJSON = require('../assets/soundfonts/' + name + '.json')
    const zoneList = (soundFontJSON as OriginZone[]).map((z) => {
      const arraybuffer = base64ToArrayBuffer(z.file)
      const zone: Zone = {
        keyRangeLow: z.keyRangeLow,
        keyRangeMiddle: z.keyRangeMiddle,
        keyRangeHigh: z.keyRangeHigh,
        buffer: null,
        loop: z.loop,
        loopStart: z.loopStart || 0,
        loopEnd: z.loopEnd || 0,
        // coarseTune: z.coarseTune || 0,
        // fineTune: z.fineTune || 0,
        // originalPitch: z.originalPitch || 6000,
        sampleRate: z.sampleRate || 44100
      }
      context.decodeAudioData(
        arraybuffer,
        (audioBuffer) => {
          zone.buffer = audioBuffer
        },
        (err) => {
          console.log(err)
        }
      )
      return zone
    })
    currentZoneList = zoneList
    instanceList.forEach((instance) => {
      instance.zoneList = currentZoneList
    })
  }
}

export default Sound
