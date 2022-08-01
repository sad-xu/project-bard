import { Box, styled, SxProps } from '@mui/material'
import { useRef, useState, KeyboardEvent, MouseEvent } from 'react'
import { toggleKeycode } from '../../../utils'

const HiddenInput = styled('input')({
  border: 0,
  margin: 0,
  padding: 0,
  width: 0,
  height: 0,
  opacity: 0,
  zIndex: -1
})

/** 禁止使用的按键 */
const DISABLED_KEYS = {
  ShiftLeft: true,
  ControlLeft: true,
  AltLeft: true,
  ShiftRight: true,
  ControlRight: true,
  AltRight: true
}

const KeyBind = ({
  label,
  changeBind,
  sx
}: {
  label: string
  changeBind: (code: string) => void
  sx?: SxProps
}) => {
  // console.log('bind')
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSelected, setIsSelected] = useState(false)
  // 防止按住不放持续触发 keyDown
  const [isLock, setIsLock] = useState(false)

  const handleLeftClick = () => {
    if (!isSelected) {
      inputRef.current?.focus()
      setIsSelected(true)
    }
  }

  const handleRightClick = (e: MouseEvent) => {
    changeBind('')
    e.preventDefault()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isSelected && !isLock) {
      if (!(DISABLED_KEYS as any)[e.code]) {
        changeBind(e.code)
      }
      setIsLock(true)
      e.preventDefault()
    }
  }

  const handleKeyUp = () => {
    setIsLock(false)
  }

  const handleBlur = () => {
    setIsSelected(false)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1,
        ...sx
      }}>
      <Box
        sx={{
          lineHeight: '20px',
          textAlign: 'center',
          width: '50px',
          height: '20px',
          margin: '0 6px 0',
          color: '#000',
          borderRadius: '6px',
          backgroundColor: '#c7c7c7',
          boxShadow: isSelected
            ? 'inset 0 0 10px 4px #f3f3f3'
            : 'inset 0 0 4px 0 #171717',
          transition: 'box-shadow 0.3s',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={handleLeftClick}
        onContextMenu={handleRightClick}>
        <span>{toggleKeycode(label)}</span>
        <HiddenInput
          ref={inputRef}
          type="password"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
      </Box>
    </Box>
  )
}

export default KeyBind
