import { Box, Fade, IconButton, Portal, Tooltip } from '@mui/material'
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset'
import { useEffect, useRef, useState } from 'react'
import MUG from './MUG'
import { useSelector } from 'react-redux'
import { selectCurrentScoreId } from 'store/app'
import { CURRENT_NOTES, toggleKeycode } from 'utils'
import { Note } from '../score-detail/components/NumberScore'
import { selectKeyConfig } from 'store/bardSlice'

let mug: MUG | null = null

const Mug = () => {
  const currentScoreId = useSelector(selectCurrentScoreId)
  const keyConfig = useSelector(selectKeyConfig)

  const mugRef = useRef<HTMLDivElement>(null)
  const [isMug, setIsMug] = useState(false)
  const [keyMap, setKeyMap] = useState<{ [k: string]: string }>({})

  const handleToggleMug = () => {
    setIsMug(!isMug)
  }

  useEffect(() => {
    mug?.stop()
  }, [currentScoreId])

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
    if (isMug) {
      if (!mug && mugRef.current) {
        mug = new MUG(mugRef.current)
      }
      const notesStr = window.sessionStorage.getItem(CURRENT_NOTES)
      if (notesStr) {
        const notes = JSON.parse(notesStr)
        mug?.setScore(
          notes.map((item: Note) => [
            item.t + 3000,
            item.duration,
            item.code,
            keyMap[item.code]
          ]),
          keyConfig.isFullScale
        )
      }

      mug?.replay(() => {
        setIsMug(false)
      })
    } else {
      mug?.stop()
    }
  }, [isMug, keyConfig.isFullScale, keyMap])

  return (
    <>
      <Tooltip title="音游模式" placement="top" arrow>
        <Fade in={!!currentScoreId}>
          <IconButton onClick={handleToggleMug}>
            <VideogameAssetIcon />
          </IconButton>
        </Fade>
      </Tooltip>

      <Portal container={document.body}>
        <Box
          ref={mugRef}
          sx={{
            position: 'fixed',
            bottom: 179,
            left: 0,
            right: 0,
            top: 0,
            // backgroundColor: '#000',
            pointerEvents: 'none',
            opacity: isMug ? 1 : 0,
            visibility: isMug ? 'visible' : 'hidden'
          }}></Box>
      </Portal>
    </>
  )
}

export default Mug
