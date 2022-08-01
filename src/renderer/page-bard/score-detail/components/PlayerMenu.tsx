import { PlayArrowRounded, PauseRounded } from '@mui/icons-material'
import { Box, IconButton, Slider } from '@mui/material'
import { useEffect, useState } from 'react'
import Sound from '../../../utils/Sound'
import Timer from '../../../utils/Timer'
import { Note } from './NumberScore'

/** 播放器进度时间 s */
let t = 0
/** 第x个音符 */
let tickIndex = 0
/** 总时间 s */
let totalTime = 0
/** 进度定时器 */
let timeId = 0
/**  正在发声的列表 [code, duration] */
let singing: Map<number, number> = new Map()

const sound = new Sound()

/** 播放、暂停 进度条 */
const PlayerMenu = ({ allNotes }: { allNotes: Note[] }) => {
  const [position, setPosition] = useState(0)

  const [isPlaying, setIsPlaying] = useState(false) // 播放器状态

  useEffect(() => {
    t = 0
    tickIndex = 0
    setPosition(0)
    if (allNotes.length) {
      const lastNote = allNotes[allNotes.length - 1]
      totalTime = lastNote.t + lastNote.duration
    }
  }, [allNotes])

  /* 播放状态切换  */
  useEffect(() => {
    if (isPlaying) {
      const interval = () => {
        timeId = window.setTimeout(() => {
          setPosition(Math.floor((t / totalTime) * 100))
          interval()
        }, 100)
      }
      interval()
    } else {
      setTimeout(() => {
        singing.clear()
        sound.silentAll()
      }, 100)
      clearTimeout(timeId)
    }
    // 清除计时器
    return () => {
      clearTimeout(timeId)
    }
  }, [isPlaying])

  /* 卸载前*/
  useEffect(() => {
    return () => {
      sound.silentAll()
    }
  }, [])

  /** 初始化播放器 */
  const initPlayer = (allNotes: Note[]) => {
    singing.clear()
    Timer.end()
    Timer.init(function () {
      t += 20
      const item = allNotes[tickIndex]
      // 停止一个音
      singing.forEach((duration, code) => {
        const d = duration - 20
        if (d <= 0) {
          singing.delete(code)
          sound.silent(code)
        } else {
          singing.set(code, d)
        }
      })

      // end
      if (!item && !singing.size) {
        Timer.end()
        window.setTimeout(() => {
          t = 0
          tickIndex = 0
          setIsPlaying(false)
        }, 20)
        return
      }
      if (item && t >= item.t) {
        tickIndex++
        if (t < item.t + item.duration) {
          singing.set(item.code, item.duration)
          sound.sing(item.code)
        }
      }
    }, 20)
  }

  /** 切换播放状态 */
  const togglePlayerStatus = () => {
    if (isPlaying) {
      Timer.stop()
      setIsPlaying(false)
    } else {
      initPlayer(allNotes)
      Timer.start()
      setIsPlaying(true)
    }
  }

  /** 设置进度 */
  const handleSetPlayerProgress = (val: number) => {
    t = (val / 100) * totalTime
    tickIndex = allNotes.findIndex((note) => note.t >= t) - 1
    setPosition(val)
    sound.silentAll()
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
      {/*  */}
      <IconButton
        aria-label={isPlaying ? 'play' : 'pause'}
        onClick={togglePlayerStatus}>
        {isPlaying ? (
          <PauseRounded sx={{ fontSize: '3rem' }} htmlColor="#000" />
        ) : (
          <PlayArrowRounded sx={{ fontSize: '3rem' }} htmlColor="#000" />
        )}
      </IconButton>
      {/*  */}
      <Slider
        aria-label="time-indicator"
        size="small"
        value={position}
        min={0}
        step={1}
        max={100}
        onChange={(_, val) => handleSetPlayerProgress(val as number)}
        sx={{
          color: 'rgba(0,0,0,0.87)',
          height: 4,
          '& .MuiSlider-thumb': {
            width: 8,
            height: 8,
            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
            '&:before': {
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)'
            },
            '&:hover, &.Mui-focusVisible': {
              boxShadow: `0px 0px 0px 8px rgba(0,0,0,0.16)`
            },
            '&.Mui-active': {
              width: 20,
              height: 20
            }
          },
          '& .MuiSlider-rail': {
            opacity: 0.28
          }
        }}
      />
    </Box>
  )
}

export default PlayerMenu
