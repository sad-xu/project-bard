//
function bytesToNumber(byteArray: Uint8Array) {
  return parseInt(bytesToHex(byteArray), 16)
}

//
function bytesToHex(byteArray: Uint8Array) {
  let hex = '0x'
  byteArray.forEach((byte) => {
    hex += ('0' + byte.toString(16)).slice(-2)
  })
  return hex
}

//
function bytesToLetters(byteArray: Uint8Array) {
  let letters = ''
  byteArray.forEach((byte) => {
    letters += String.fromCharCode(byte)
  })
  return letters
}

/** 计算动态字节值 */
function getTruthNum(byteArray: Uint8Array) {
  let sum = 0
  byteArray.forEach((byte) => {
    if (byte & 0x80) {
      sum += byte & 0x7f
      sum <<= 7
    } else sum += byte
  })
  return sum
}

/** 限制音调范围 48-59 60-71 72-83 84 */
function limitTone(t: number) {
  if (t < 48) {
    return 59 - ((47 - t) % 12)
  } else if (t > 84) {
    return 72 + ((t - 84) % 12)
  } else return t
}

/*
  头块 + 音轨块 * n

  头块 <标志符串MThd>(4字节) + <头块数据区长度>(4字节) + <头块数据区>(6字节) ff ff tt tt dd dd
  音轨块 <标志符串MTrk>(4字节) + <音轨块数据区长度>(4字节) + <音轨块数据区>(多个MIDI事件构成)

  MIDI事件 <delta time> + <MIDI 消息>
  MIDI消息 <状态字节> + <数据字节> * n
  状态字节 最高位为1 128 ~ 255
  数据字节 最高位为0 0 ~ 127

  Example: 植物大战僵尸.mid
    0, 255, 88, 4, 4, 2, 8, 82 // 0 FF 58 节拍 一个四分音符包含的32分音符的个数
    0, 255, 81, 3, 8, 82, 174  // 0 FF 51 速度  0x852ae = 545454微秒
    0, 255, 3, 1, 49 // 0 FF 歌曲/音轨名 0x31
    0, 193, 0 // 0 C1 改变乐器 0
    0, 192, 0 // 0 C0 改变乐器 0
    143, 0, 177, 95, 0 // 1920 B1 控制器编号 值
    0, 177, 92, 0,
    0, 176, 100, 0,
    129, 85, 128, 73, 0, // 213 0x80 松开音符
*/

// [time, type, data, desc]
type Track = [number, number, Uint8Array | number, string]
export interface MidiInfo {
  headerChunk: {
    id: string
    length: number
    ffff: Uint8Array
    tttt: number
    dddd: Uint8Array
    timingType: number
    tick: number
    tempo: number
    meter: [number, number]
    bpm: number
    clefs: number[]
  }
  trackChunk: Track[][]
}

/** 解析 MIIDI 文件 */
export function parseMIDI(arrayBuffer: ArrayBuffer): MidiInfo {
  const buffer = new Uint8Array(arrayBuffer)
  const midiInfo: MidiInfo = {
    headerChunk: {
      id: bytesToLetters(buffer.subarray(0, 4)),
      length: bytesToNumber(buffer.subarray(4, 8)),
      ffff: buffer.subarray(8, 10), // 00 单音轨 01 多个同步音轨 10 多个独立音轨
      tttt: bytesToNumber(buffer.subarray(10, 12)), // 音轨块数
      dddd: buffer.subarray(12, 14), // 时间类型
      timingType: (+buffer.subarray(12, 13) & 0b1000) >> 3, //  0 TPQN计时-每四分音符中所包含的Tick数量 48-480  1 SMPTE计时
      tick: +bytesToHex(buffer.subarray(12, 14)) & 0b111111111111,
      tempo: 545454, // 四分音符的时长 微秒
      meter: [4, 4], // 4/4拍
      bpm: 120, // 每分钟拍子数
      clefs: [] // 各个音轨的调号
    },
    trackChunk: [] as Track[][]
  }
  //
  const unitList: Uint8Array[] = []
  for (let i = 14; i < buffer.length; ) {
    if (buffer.subarray(i, i + 4).join('') === '7784114107') {
      const len = bytesToNumber(buffer.subarray(i + 4, i + 8))
      unitList.push(buffer.subarray(i + 8, i + 8 + len))
      i += len + 8
    } else i += 8
  }
  //
  const trackChunk: Track[][] = []
  unitList.forEach((unit, unitIndex) => {
    const trackList: Track[] = []
    const len = unit.length
    midiInfo.headerChunk.clefs.push(0)
    let lastStat = 0
    for (let i = 0; i < len; ) {
      const start = i
      while (unit[i] >= 128) {
        i++
      }
      i++
      const time = getTruthNum(unit.subarray(start, i)) // delta time
      let stat = unit[i] // 状态字节
      let track: Track | undefined = undefined
      // 简写情况 前后状态一致,后面的状态字节可省略
      if (stat < 0x80) {
        stat = lastStat
        i--
      } else {
        lastStat = stat
      }
      // 正常情况
      switch (true) {
        case stat >= 0x80 && stat <= 0x8f:
          track = [time, 0x80, limitTone(unit.subarray(i + 1, i + 3)[0]), 'up']
          i += 3
          break
        case stat >= 0x90 && stat <= 0x9f: {
          // 按下且力度为0 === 声音关闭
          const note = unit.subarray(i + 1, i + 3)
          if (note[1] === 0) {
            track = [time, 0x80, limitTone(note[0]), 'up']
          } else {
            track = [time, 0x90, limitTone(note[0]), 'down']
          }
          i += 3
          break
        }
        case stat >= 0xa0 && stat <= 0xaf:
          track = [time, 0xa0, unit.subarray(i + 1, i + 3), '音键压力']
          i += 3
          break
        case stat >= 0xb0 && stat <= 0xbf:
          track = [time, 0xb0, unit.subarray(i + 1, i + 3), '控制变化']
          i += 3
          break
        case stat >= 0xc0 && stat <= 0xcf:
          track = [time, 0xc0, unit.subarray(i + 1, i + 2), '改变乐器']
          i += 2
          break
        case stat >= 0xd0 && stat <= 0xdf:
          track = [time, 0xd0, unit.subarray(i + 1, i + 2), '通道触动压力']
          i += 2
          break
        case stat >= 0xe0 && stat <= 0xef:
          track = [time, 0xe0, unit.subarray(i + 1, i + 3), '弯音轮变换']
          i += 3
          break
        case stat === 0xf2:
          track = [time, 0xf2, unit.subarray(i + 1, i + 3), '歌曲位道指针']
          i += 3
          break
        case stat === 0xf3:
          track = [time, 0xf3, unit.subarray(i + 1, i + 2), '歌曲选择']
          i += 2
          break
        case stat === 0xf0 || stat === 0xf7: {
          i += 1
          const start = i
          while (unit[i] >= 128) {
            i++
          }
          i++
          const len = getTruthNum(unit.subarray(start, i))
          track = [time, 0xf0, unit.subarray(i, i + len), '系统码']
          i += len
          break
        }
        case stat === 0xff: {
          i += 2
          const type = unit[i - 1]
          const start = i
          while (unit[i] >= 128) {
            i++
          }
          i++
          const len = getTruthNum(unit.subarray(start, i))
          const arr = unit.subarray(i, i + len)
          let desc = ''
          if (type === 0x00) desc = '设置轨道音序'
          else if (type === 0x01) desc = '文本信息'
          else if (type === 0x02) desc = '版权信息'
          else if (type === 0x03) desc = '歌曲名称'
          else if (type === 0x04) desc = '乐器名称'
          else if (type === 0x05) desc = '歌词'
          else if (type === 0x06) desc = '标记'
          else if (type === 0x07) desc = '注释'
          else if (type === 0x2f) desc = '音轨结束标志'
          else if (type === 0x51) {
            // FF 51 03 tt tt tt  MicroTempo
            let tempo = 0
            for (let j = 0; j < len; j++) {
              tempo += arr[j] * Math.pow(16, (len - j - 1) * 2)
            }
            midiInfo.headerChunk.tempo = tempo
            midiInfo.headerChunk.bpm = Math.round(60000000 / tempo)
            desc = '设定速度-微秒'
          } else if (type === 0x58) {
            //  FF 58 nn dd cc bb  '0x04021808'
            // nn dd 拍子的分子\分母 分母是2的指数 dd/2^nn 4/2^2 = 4/4
            // cc 一个节拍器的MIDI时钟 dd 一个4分音符包括的32分音符的个数 8
            midiInfo.headerChunk.meter = [arr[0], Math.pow(2, arr[1])]
            desc = '节拍'
          } else if (type === 0x59) {
            // TODO https://www.jianshu.com/p/281e54c323ce
            //  FF 59 02 sf mi   默认大调 00 FF 59 02 FD 00
            // 59 | 02 | 升降号数：-7~-1(降号)，0（c）,1~7(升号) | 大小调：0（大调），1（小调）
            let clef = arr[0] > 128 ? arr[0] ^ 0b11111111 : arr[0]
            midiInfo.headerChunk.clefs[unitIndex] = clef
            desc = '调号'
          }
          track = [time, 0xff00 + type, arr, desc]
          i += len
          break
        }
      }
      trackList.push(track as Track)
    }
    // 过滤无音符的音轨
    // if (trackList.some((item) => item[2] === 60)) {
    if (trackList.some((item) => item[1] === 128)) {
      trackChunk.push(trackList)
    }
  })
  midiInfo.trackChunk = trackChunk
  return midiInfo
}

/** 单个音符 */
interface Note {
  code: number
  tone: string
  scale: number
  t: number
  duration: number // 按下->收起 间隔
  durationTick: number
  dt: number // 按下->按下 间隔
  dtTick: number
}

/** MIDI JSON -> stave String */
export function midiToStave({ headerChunk, trackChunk }: MidiInfo) {
  const [timeNum, signNum] = headerChunk.meter
  const tick = headerChunk.tick

  let texContent: string[] = []
  trackChunk.forEach((chunk) => {
    // TODO: 谱号，分析当前音轨最高音和最低音
    // TODO: 调号 clef
    let score = `
      \\staff{score}
      \\clef G2
      \\ts ${timeNum} ${signNum}
    `
    let list: Note[] = []
    let time = 0
    const codeObj: { [key: string]: number } = {}
    chunk.forEach(([t, type, code]) => {
      time += t
      const numCode = code as number
      if (type === 0x80) {
        if (codeObj[numCode] === undefined) return
        const duration = time - codeObj[numCode]
        list.push({
          code: numCode,
          ...calcNote(numCode),
          t: codeObj[numCode],
          duration: duration,
          durationTick: calcTicks(duration, tick),
          dt: 0,
          dtTick: 0
        })
        if (list.length > 1) {
          const dt = codeObj[numCode] - list[list.length - 2].t
          list[list.length - 2].dt = dt
          list[list.length - 2].dtTick = calcTicks(dt, tick)
        }
        delete codeObj[numCode]
      } else if (type === 0x90) {
        if (codeObj[numCode] === undefined) codeObj[numCode] = time
      } else if (type === 0xff2f) {
        // end
        list[list.length - 1].dt = time - list[list.length - 1].t
        list[list.length - 1].dtTick = calcTicks(
          list[list.length - 1].dt as number,
          tick
        )
      }
    })

    let splitTime = 0
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      // 留白 休止符 限制最短16分
      if (item.dt - item.duration >= tick / 4) {
        const n = calcTicks(item.dt - item.duration, tick)
        score += ` r.${n} `
      }

      // 和弦
      let chords = []
      while (list[i].dt === 0) {
        chords.push(list[i])
        i++
      }
      if (chords.length) {
        chords.push(list[i])
        score += `(${chords.map((it) => `${it.tone}${it.scale}`).join(' ')}).${
          item.durationTick
        } `
      } else {
        score += `${item.tone}${item.scale}.${item.durationTick} `
      }

      splitTime += 1 / item.dtTick
      if (splitTime >= timeNum / signNum) {
        score += '| '
        splitTime = 0
      }
    }

    if (score[score.length - 2] === '|') score = score.slice(0, -2)
    texContent.push(score)
  })

  return `
    \\tempo ${headerChunk.bpm}
    .
    ${texContent.join(`
  `)}`
}

/** 计算x分音符  (实际间隔，理想四分音符) */
function calcTicks(num: number, tick: number) {
  if (num <= tick * 4 && num > tick * 2) return 1
  else if (num <= tick * 2 && num > tick) return 2
  else if (num <= tick && num > tick / 2) return 4
  else if (num <= tick / 2 && num > tick / 4) return 8
  else if (num <= tick / 4 && num > tick / 8) return 16
  else if (num <= tick / 8 && num > tick / 16) return 32
  else if (num > tick * 4) return 1
  // TODO: 超长音
  else return 64 // 太短的不考虑
}

/** 计算x音符 */
const TONE_MAP = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
]
function calcNote(code: number) {
  return {
    tone: TONE_MAP[code % 12],
    scale: Math.floor(code / 12) - 1
  }
}

/** 使用案例 */
/*
const loadMidi = (fileName: string) => {
  const request = new XMLHttpRequest()
  request.open('GET', `/${fileName}.mid`, true)
  request.responseType = 'arraybuffer'
  request.onload = () => {
    const tex = midiToStave(parseMIDI(request.response as ArrayBuffer))
  }
  request.send(null)
}

const initVexflow = (tex: string) => {
  api = new alphaTab.AlphaTabApi(this.$el.querySelector('#paper'), {
    useWorkers: false,
    fontDirectory: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@alpha/dist/font/',
    padding: [0,0,0,0],
    staveProfile: 'Score',
    stretchForce: 0.8,
    player: {
      enableUserInteraction: false
    },
    notation: {
      notationMode: 'SongBook',
      // RhythmHeight: 20,
      elements: {
        EffectDynamics: false
      }
    }
  });
  api.tex(tex)
  // api.tex(`
  // \\tempo 96
  // .
  // \\staff{score}
  // \\clef G2
  // \\ts 4 4
  // c4.8 d4.8 e4.8 e4.8 | (c4 d4).4 d4.4 f4.4 f4.4 | r.1
  // \\staff{score}
  // \\clef F4
  // c2.4 c2.4 c2.4 c2.4 |`)

  api.error.on(err => {
    console.log(err)
  })
  let t = new Date()
  api.renderStarted.on(() => {
    console.log('start')
  })
  api.renderFinished.on(() => {
    console.log('finish', new Date() - t)
    const wrapper = this.$el.querySelector('#paper .at-surface')
    wrapper.removeChild(wrapper.lastChild)
  })
}
*/
