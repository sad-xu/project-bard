import { Box } from '@mui/material'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectCanPlay, selectKeyConfig } from '../../store/bardSlice'
import Sound from '../../utils/Sound'
import Indicator from './Indicator'
import styles from './KeyboardContent.module.scss'
import { toggleKeycode } from '../../utils'
// import { endDrawNote, startDrawNote } from '../utils/scene1'

export interface KeyItem {
  note: number
  label: string
  code: string
  type?: number
}

const sound = new Sound({ canMock: true })

let isPressed = false

const partKeyboard: KeyItem[] = [
  { note: 60, label: '1', code: '' },
  { note: 61, label: '1 ♯', code: '', type: 1 },
  { note: 62, label: '2', code: '' },
  { note: 63, label: '3 ♭', code: '', type: 2 },
  { note: 64, label: '3', code: '' },
  { note: 65, label: '4', code: '' },
  { note: 66, label: '4 ♯', code: '', type: 4 },
  { note: 67, label: '5', code: '' },
  { note: 68, label: '5 ♯', code: '', type: 5 },
  { note: 69, label: '6', code: '' },
  { note: 70, label: '7 ♭', code: '', type: 6 },
  { note: 71, label: '7', code: '' },
  { note: 72, label: 'i', code: '' }
]

const fullKeyboard: KeyItem[] = [
  { note: 48, label: '1', code: '' },
  { note: 49, label: '1 ♯', code: '', type: 1 },
  { note: 50, label: '2', code: '' },
  { note: 51, label: '3 ♭', code: '', type: 2 },
  { note: 52, label: '3', code: '' },
  { note: 53, label: '4', code: '' },
  { note: 54, label: '4 ♯', code: '', type: 4 },
  { note: 55, label: '5', code: '' },
  { note: 56, label: '5 ♯', code: '', type: 5 },
  { note: 57, label: '6', code: '' },
  { note: 58, label: '7 ♭', code: '', type: 6 },
  { note: 59, label: '7', code: '' },

  { note: 60, label: '1', code: '' },
  { note: 61, label: '1 ♯', code: '', type: 8 },
  { note: 62, label: '2', code: '' },
  { note: 63, label: '3 ♭', code: '', type: 9 },
  { note: 64, label: '3', code: '' },
  { note: 65, label: '4', code: '' },
  { note: 66, label: '4 ♯', code: '', type: 11 },
  { note: 67, label: '5', code: '' },
  { note: 68, label: '5 ♯', code: '', type: 12 },
  { note: 69, label: '6', code: '' },
  { note: 70, label: '7 ♭', code: '', type: 13 },
  { note: 71, label: '7', code: '' },

  { note: 72, label: '1', code: '' },
  { note: 73, label: '1 ♯', code: '', type: 15 },
  { note: 74, label: '2', code: '' },
  { note: 75, label: '3 ♭', code: '', type: 16 },
  { note: 76, label: '3', code: '' },
  { note: 77, label: '4', code: '' },
  { note: 78, label: '4 ♯', code: '', type: 18 },
  { note: 79, label: '5', code: '' },
  { note: 80, label: '5 ♯', code: '', type: 19 },
  { note: 81, label: '6', code: '' },
  { note: 82, label: '7 ♭', code: '', type: 20 },
  { note: 83, label: '7', code: '' },
  { note: 84, label: 'i', code: '' }
]

// 已按下的键
const pressedCodes: { [k: string]: string | false } = {}
// 音符对应的按键
let noteCodeMap: { [k: string]: string } = {}

const Keyboard = () => {
  const keyConfig = useSelector(selectKeyConfig)
  const canPlay = useSelector(selectCanPlay)

  const [keyList, setKeyList] = useState<KeyItem[]>([])
  // 音调偏移 八度\半音
  const offset = useRef(0)
  // 所有按键dom
  const keyDomObj = useRef<{ [k: string]: HTMLElement }>({})
  // 指示器dom [low, high]
  const indiLeftDom = useRef<HTMLElement[]>([])
  const indiRightDom = useRef<HTMLElement[]>([])

  /** 键位设置改变后，重新设置 */
  useEffect(() => {
    const originData = keyConfig.isFullScale ? fullKeyboard : partKeyboard
    const newKeyList: KeyItem[] = []
    originData.forEach((item) => {
      newKeyList.push(item)
    })

    noteCodeMap = {}
    for (let key in keyConfig.common) {
      const note = keyConfig.common[key]
      noteCodeMap[note] = key
    }
    // part 特殊处理
    if (!keyConfig.isFullScale) {
      for (let key in keyConfig.common) {
        const note = keyConfig.common[key]
        if (note !== 72 && note !== 60) {
          noteCodeMap[note + 12] = key
          noteCodeMap[note - 12] = key
        }
      }
    }
    newKeyList.forEach((item) => {
      item.code = noteCodeMap[item.note] || ''
    })
    setKeyList(newKeyList)
  }, [keyConfig])

  /** 绑定按键事件 */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    // 无法禁止的事件 [Shift] Ctrl (Q|N|W|T|Tab)
    window.addEventListener('beforeunload', (e) => {
      // e.preventDefault()
      // e.returnValue = null
      return true
    })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canPlay])

  // 绑定所有按键dom ref映射 手动改变按下样式
  const measuredRef = useCallback((node: HTMLElement) => {
    const code = node?.dataset.code
    if (code !== undefined) {
      keyDomObj.current[code] = node
    }
  }, [])

  // 指示器样式变化
  const handleIndicatorStyleChange = (
    type: 'higher' | 'lower',
    show: boolean = false
  ) => {
    ;[
      indiLeftDom.current[type === 'higher' ? 1 : 0],
      indiRightDom.current[type === 'higher' ? 1 : 0]
    ].forEach((dom) => {
      if (dom) {
        dom.style.opacity = show ? '1' : ''
        dom.style.transform = show ? 'scaleY(1)' : ''
      }
    })
  }

  // 按键样式变化
  const handleKeyStyleChange = (
    code: string,
    show: boolean = false,
    truthNote: number
  ) => {
    if (keyDomObj.current[code]) {
      const cName =
        truthNote <= 59
          ? styles.keyboardLow
          : truthNote >= 72
          ? styles.keyboardHigh
          : styles.keyboardMiddle
      if (show) {
        keyDomObj.current[code].classList.add(cName)
      } else {
        keyDomObj.current[code].classList.remove(cName)
      }
    }
  }

  // 清空当前所有按键样式
  const clearAllKeyStyle = () => {
    for (let code in pressedCodes) {
      const truthCode = pressedCodes[code]
      if (truthCode) {
        const dom = keyDomObj.current[truthCode]
        if (dom) {
          if (dom.classList.contains(styles.keyboardLow))
            dom.classList.remove(styles.keyboardLow)
          else if (dom.classList.contains(styles.keyboardHigh))
            dom.classList.remove(styles.keyboardHigh)
          else if (dom.classList.contains(styles.keyboardMiddle))
            dom.classList.remove(styles.keyboardMiddle)
        }
      }
    }
  }

  const singStart = (code: string, key: string = '') => {
    // 已按下
    if (pressedCodes[code] !== false && pressedCodes[code] !== undefined)
      return false
    // 指示器
    let flag = false
    if (key === keyConfig.higher) {
      handleIndicatorStyleChange('higher', true)
      offset.current = 12
      flag = true
    } else if (key === keyConfig.lower) {
      handleIndicatorStyleChange('lower', true)
      offset.current = -12
      flag = true
    } else if (code === keyConfig.highSemitone) {
      offset.current = 1
      flag = true
    } else if (code === keyConfig.lowSemitone) {
      offset.current = -1
      flag = true
    }
    if (flag) {
      clearAllKeyStyle()
      sound.silentAll()
    }
    const note = keyConfig.common[code]
    if (note) {
      const truthNote = note + offset.current
      const truthCode = keyConfig.isFullScale ? noteCodeMap[truthNote] : code
      sound.sing(truthNote)
      pressedCodes[code] = truthCode || ''
      handleKeyStyleChange(truthCode, true, truthNote)
    } else {
      pressedCodes[code] = code || ''
    }
  }

  const singEnd = (code: string, key: string = '') => {
    let flag = false
    if (key === keyConfig.higher) {
      flag = true
      handleIndicatorStyleChange('higher', false)
    } else if (key === keyConfig.lower) {
      flag = true
      handleIndicatorStyleChange('lower', false)
    } else if (code === keyConfig.highSemitone) {
      flag = true
    } else if (code === keyConfig.lowSemitone) {
      flag = true
    }
    // 清空所有
    if (flag) {
      clearAllKeyStyle()
      offset.current = 0
      sound.silentAll()
    } else {
      const note = keyConfig.common[code]
      if (note) {
        const truthNote = note + offset.current
        const truthCode = keyConfig.isFullScale ? noteCodeMap[truthNote] : code
        sound.silent(truthNote)
        pressedCodes[code] = truthCode || ''
        handleKeyStyleChange(truthCode, false, truthNote)
      } else {
        pressedCodes[code] = ''
      }
    }
    pressedCodes[code] = false
  }

  // 键盘按下
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!canPlay) return
    e.preventDefault()
    e.returnValue = false
    const { code, key } = e
    singStart(code, key)
    return false
  }

  // 键盘收起
  const handleKeyUp = (e: KeyboardEvent) => {
    if (!canPlay) return
    if (e.code === 'F12') return
    e.preventDefault()
    e.returnValue = false
    const { code, key } = e
    singEnd(code, key)
    return false
  }

  // 鼠标按下
  const handleMouseDown = (code: string) => {
    singStart(code)
    isPressed = true
  }

  // 鼠标松开
  const handleMouseUp = (code: string) => {
    singEnd(code)
    isPressed = false
  }

  // 鼠标移入
  const handleMopuseEnter = (code: string) => {
    if (isPressed) {
      singStart(code)
    }
  }

  // 鼠标移出
  const handleMopuseLeave = (code: string) => {
    singEnd(code)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        userSelect: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()}>
      {/* 指示灯 左 */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '10px'
        }}>
        <Indicator ref={indiLeftDom} />
      </Box>
      {/* 键盘主体 */}
      <Box
        id="KeyboardContent"
        sx={{
          position: 'absolute',
          left: '20px',
          right: '20px',
          height: '100%',
          display: 'flex'
          // overflow: 'hidden'
        }}
        onMouseLeave={() => (isPressed = false)}>
        {keyList.map((item: KeyItem) => (
          <Box
            key={item.note}
            data-code={item.code}
            ref={measuredRef}
            sx={{
              left:
                item.type &&
                `${(100 / (keyList.length === 37 ? 22 : 8)) * item.type}%`
            }}
            className={`${styles.key} ${item.type ? styles.blackKey : ''} ${
              item.type && keyList.length === 37 ? styles.fullBlackKey : ''
            }`}
            onMouseDown={() => handleMouseDown(item.code)}
            onMouseUp={() => handleMouseUp(item.code)}
            onMouseEnter={() => handleMopuseEnter(item.code)}
            onMouseLeave={() => handleMopuseLeave(item.code)}>
            <span className={styles.code}>
              {toggleKeycode(item.code) || '--'}
            </span>
            <span className={styles.label}>{item.label}</span>
          </Box>
        ))}
      </Box>
      {/* 指示灯 右 */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '10px'
        }}>
        <Indicator ref={indiRightDom} />
      </Box>
    </Box>
  )
}

export default Keyboard
