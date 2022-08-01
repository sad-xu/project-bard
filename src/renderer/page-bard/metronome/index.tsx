import { Box } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectMetroConfig } from '../../store/bardSlice'
import metronomeSound from './metronomeSound'

const DotStyle = {
  width: 12,
  height: 12,
  m: 1,
  mt: '6px',
  mb: '6px',
  borderRadius: '100%',
  backgroundColor: '#fff',
  boxShadow: '0 0 6px #cfcfcf',
  transition: 'background-color 0.3s'
}

let timeId = 0

/**
 *
 * 间隔时间，每小节节拍数，是否震铃，当前是第几个节拍，回调
 */
const singInterval = (
  intervalTime: number,
  beat: number,
  isDing: Boolean,
  n: number,
  cb: (n: number) => void
) => {
  timeId = window.setTimeout(() => {
    if (n === 0 && isDing) {
      metronomeSound.singDing()
    } else {
      metronomeSound.singDa()
    }
    cb(n)
    singInterval(intervalTime, beat, isDing, (n + 1) % beat, cb)
  }, intervalTime)
}

/** 节拍器 */
const Metronome = () => {
  const metroConfig = useSelector(selectMetroConfig)
  // 所有标志dom
  const dotDomList = useRef<HTMLElement[]>([])

  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    window.clearTimeout(timeId)
    // 清空颜色
    for (let i = 0; i < dotDomList.current.length; i++) {
      if (dotDomList.current[i]) {
        dotDomList.current[i].style.backgroundColor = ''
      }
    }

    if (isPlaying) {
      singInterval(
        60000 / metroConfig.bpm,
        metroConfig.beat,
        Boolean(+metroConfig.isDing),
        0,
        (n: number) => {
          dotDomList.current[n] &&
            (dotDomList.current[n].style.backgroundColor =
              n === 0 ? '#ffc107' : '#4dd0e1')
          const lastN = n === 0 ? metroConfig.beat - 1 : n - 1
          dotDomList.current[lastN] &&
            (dotDomList.current[lastN].style.backgroundColor = '')
        }
      )
    }
    return () => {
      window.clearTimeout(timeId)
    }
  }, [metroConfig.bpm, metroConfig.beat, metroConfig.isDing, isPlaying])

  // 回调 ref
  const measuredRef = useCallback((node: HTMLElement) => {
    dotDomList.current.push(node)
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: '100%',
          display: 'flex',
          mr: -1,
          cursor: 'pointer'
        }}
        onClick={togglePlay}>
        {Array.from({ length: metroConfig.beat }).map((item, i) => (
          <Box ref={measuredRef} key={i} sx={DotStyle}></Box>
        ))}
      </Box>
    </>
  )
}

export default Metronome
