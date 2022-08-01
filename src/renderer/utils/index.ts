// user
export const USER_ID_KEY = 'ff-user-id'
export const TOKEN_KEY = 'ff-token'
export const NAME_KEY = 'ff-name'
export const AVATAR_KEY = 'ff-avatar'
export const KEY_CONFIG_KEY = 'ff-key-config'
// sound
export const VOLUME = 'ff-volume'
export const DURATION = 'ff-duration'
export const INSTRUMENT = 'ff-instrument'
export const IS_MOCK = 'ff-is-mock'

// 本地存储
// 切换按键/简谱音符
export const SHOW_NOTE_LABEL = 'ff-show-note-label'
// 切换显示五线谱/简谱
export const SHOW_STAVE_SCORE = 'ff-show-stave-score'

// 节拍器配置
// 音量
export const METRO_VLOUME = 'ff-metro-vloume'
// bpm
export const METRO_BPM = 'ff-metro-bpm'
// beat
export const METRO_BEAT = 'ff-metro-beat'
// 是否敲响震铃
export const METRO_IS_DING = 'ff-metro-is-ding'

// session storage
// 当前曲谱数据
export const CURRENT_NOTES = 'ff-current-notes'

// 当前背景index
export const CURRENT_BG_INDEX = 'ff-bg-index'

// export function debounce(fn: () => void, wait = 300) {
//   let timeId: number | undefined
//   return function (this: any, ...args: []) {
//     return new Promise((resolve, reject) => {
//       window.clearTimeout(timeId)
//       timeId = window.setTimeout(() => {
//         resolve(fn.apply(this, args))
//       }, wait)
//     })
//   }
// }

export function requestDelay<T>(p: Promise<T>, delay = 300): Promise<T> {
  const t = new Date().getTime()
  return new Promise((resolve, reject) => {
    p.then((res) => {
      const dt = new Date().getTime() - t
      if (dt < delay) {
        setTimeout(() => {
          resolve(res)
        }, delay - dt)
      } else resolve(res)
    }).catch((err) => reject(err))
  })
}

/** base64 => arrayBuffer */
// export function base64ToArraybuffer(base64: string): ArrayBuffer {
//   const binaryString = window.atob(base64)
//   const len = binaryString.length
//   const bytes = new Uint8Array(len)
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i)
//   }
//   return bytes.buffer
// }

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
// Use a lookup table to find the index.
const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256)
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i
}

/** base64 => arraybuffer  without atob */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  let bufferLength = base64.length * 0.75
  const len = base64.length
  let i
  let p = 0
  let encoded1
  let encoded2
  let encoded3
  let encoded4

  if (base64[base64.length - 1] === '=') {
    bufferLength--
    if (base64[base64.length - 2] === '=') {
      bufferLength--
    }
  }

  const arraybuffer = new ArrayBuffer(bufferLength)
  const bytes = new Uint8Array(arraybuffer)

  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)]
    encoded2 = lookup[base64.charCodeAt(i + 1)]
    encoded3 = lookup[base64.charCodeAt(i + 2)]
    encoded4 = lookup[base64.charCodeAt(i + 3)]

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4)
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
  }
  return arraybuffer
}

const REG_EXP = /Digit|Key/
const SPEC_MAP: { [key: string]: string } = {
  Minus: '-',
  Equal: '=',
  Backspace: 'Back',
  Backquote: '`',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: "'",
  Enter: 'Enter',
  Comma: ',',
  Period: '.',
  Slash: '/'
}

/** 按键显示 物理按键 -> 显示按键 */
export const toggleKeycode = (code: string): string => {
  if (REG_EXP.test(code)) {
    return code.slice(-1)
  }
  return SPEC_MAP[code] || code
}

const addZero = (n: number) => {
  return n > 9 ? n : `0${n}`
}

/** 日期显示 */
export const parseDate = (t: number) => {
  const d = new Date(t)
  return `${d.getFullYear()}-${addZero(d.getMonth() + 1)}-${addZero(
    d.getDate()
  )} ${addZero(d.getHours())}:${addZero(d.getMinutes())}`
}

/** 判断是否是移动端 */
export const isMobile = /(iPhone|iOS|Android)/i.test(window.navigator.userAgent)
