import { Box, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectKeyConfig } from 'store/bardSlice'
import { SHOW_NOTE_LABEL, toggleKeycode } from 'utils'
import { MidiInfo } from '../../../utils/MIDI'

/** 单个音符 */
export interface Note {
  t: number
  code: number
  // numNote: string // 简谱音符
  label: string
  duration: number
  isLast: boolean // 是否是小节最后一个
}

const N_LIST = ['1', '1♯', '2', '3♭', '3', '4', '4♯', '5', '5♯', '6', '7♭', '7']

const NoteItem = styled(Box)({
  position: 'relative',
  flexShrink: 0,
  flexGrow: 0,
  display: 'inline-block',
  textAlign: 'center',
  backgroundColor: '#b6b6b6',
  height: '28px',
  lineHeight: '28px',
  borderRadius: '6px',
  boxShadow: '1px 2px 3px #505050'
})

/** 解析为音符 */
export const parseToNotes = (midiInfo: MidiInfo) => {
  let allNotes: Note[] = []
  const { tick, meter, tempo } = midiInfo.headerChunk
  // 取整处理 避免误差
  const tickTime = Math.round(tempo / tick / 1000)
  const meterTime = tickTime * tick * meter[0] // 每小节的时长

  midiInfo.trackChunk.forEach((arr) => {
    let list: Note[] = []
    const obj: { [k: number]: Note } = {}
    let isFirst = true
    let t = 0
    arr.forEach((item) => {
      const [dt, type] = item
      const code = item[2] as number
      t += dt * tickTime
      if (type === 144) {
        // down
        if (isFirst) {
          // 首个按键，强制t=0
          isFirst = false
          t = 0
        }
        const note: Note = {
          t,
          duration: 0,
          label: N_LIST[code % 12],
          code: code,
          isLast: false
        }
        obj[code] = note
        list.push(note)
      } else if (type === 128) {
        // up
        if (obj[code]) {
          obj[code].duration = t - obj[code].t
        }
      }
    })
    // 剔除持续时间为0的无效音符
    list = list.filter((item) => item.duration !== 0)
    // 分小节
    for (let i = 1; i < list.length; i++) {
      if (
        Math.floor(list[i].t / meterTime) -
          Math.floor(list[i - 1].t / meterTime) >=
        1
      ) {
        list[i - 1].isLast = true
      }
    }
    allNotes = allNotes.concat(list)
  })
  allNotes.sort((a, b) => a.t - b.t)
  // console.log(midiInfo, allNotes)
  return allNotes
}

/** 生成单个小节的排列 */
const calcMeter = (meter: Note[]) => {
  if (!meter.length) return []
  const list: Note[][] = [[meter[0]]]
  const emptyNote: Note = {
    code: 59.5,
    duration: 0,
    isLast: false,
    label: '',
    t: 0
  }
  for (let i = 1; i < meter.length; i++) {
    const note = meter[i]
    let noflag = true
    for (let j = 0; j < list.length; j++) {
      const row = list[j]
      if (row) {
        const lastTime = row[row.length - 1].t + row[row.length - 1].duration
        if (lastTime <= note.t) {
          if (j > 0) {
            // 已有行的 补空
            const dx = list[j - 1].length - row.length - 1
            if (dx > 0) {
              for (let k = 0; k < dx; k++) {
                row.push(emptyNote)
              }
            }
          }
          row.push(note)
          noflag = false
          break
        }
      }
    }
    if (noflag) {
      // 新行的补空
      const arr: Note[] = []
      arr.length = list[list.length - 1].length - 1
      arr.fill(emptyNote)
      arr.push(note)
      list.push(arr)
    }
  }
  // 竖向按照音调排序
  const maxCol = list.reduce((acc, item) => Math.max(acc, item.length), 0)
  for (let i = 0; i < maxCol; i++) {
    const col = list.map((row) => row[i] || emptyNote)
    col.sort((a, b) => b.code - a.code)
    col.forEach((item, j) => {
      list[j][i] = item
    })
  }
  return list
}

const NumberScore = ({
  allNotes,
  scale
}: {
  allNotes: Note[]
  scale: number
}) => {
  const keyConfig = useSelector(selectKeyConfig)
  const [keyMap, setKeyMap] = useState<{ [k: string]: string }>({})

  const [meterList, setMeterList] = useState<Note[][][]>([])

  const [showNoteLabel, setShowNoteLabel] = useState(
    !!Number(localStorage.getItem(SHOW_NOTE_LABEL))
  )

  useEffect(() => {
    const obj: any = {}
    const common = keyConfig.common
    const isFullScale = keyConfig.isFullScale
    for (let key in common) {
      const c = toggleKeycode(key)
      obj[common[key]] = c
      // 12键 高低音合一
      if (!isFullScale) {
        obj[common[key] - 12] = c
        obj[common[key] + 12] = c
      }
    }

    setKeyMap(obj)
  }, [keyConfig.common, keyConfig.isFullScale])

  useEffect(() => {
    const meterList: Note[][][] = [[[]]]
    allNotes.forEach((note) => {
      meterList[meterList.length - 1][0].push(note)
      if (note.isLast) {
        meterList[meterList.length - 1] = calcMeter(
          meterList[meterList.length - 1][0]
        )
        meterList.push([[]])
      }
    })
    // console.log(meterList)
    setMeterList(meterList)
  }, [allNotes])

  const handleBoxClick = () => {
    setShowNoteLabel(!showNoteLabel)
    localStorage.setItem(SHOW_NOTE_LABEL, showNoteLabel ? '0' : '1')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        position: 'relative',
        mt: '40px',
        mb: '40px'
      }}
      onClick={handleBoxClick}>
      {meterList.map((meter, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            height: '100%',
            backgroundColor: 'rgba(82,82,82,0.5)',
            p: 1,
            pb: 0,
            m: 1,
            borderRadius: '8px',
            boxShadow: '1px 2px 5px 0 #2d2d2d'
          }}>
          {meter.map((row: Note[], j) => (
            <Box key={j} sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {row.map((note, k) => (
                <NoteItem
                  key={k}
                  sx={{
                    visibility: note.duration === 0 ? 'hidden' : 'visible',
                    mb: 1,
                    marginRight: `${12 * scale}px`,
                    minWidth: `${22 * scale}px`,
                    backgroundImage:
                      note.code < 60
                        ? 'linear-gradient(#7a82be, #85e9e1)'
                        : note.code > 71
                        ? 'linear-gradient(#f3ea91, #e0651d)'
                        : ''
                  }}>
                  {showNoteLabel ? note.label : keyMap[note.code] || '--'}
                </NoteItem>
              ))}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default NumberScore
