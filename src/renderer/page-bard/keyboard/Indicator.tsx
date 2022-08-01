import { Box, styled } from '@mui/material'
import { forwardRef, useCallback, MutableRefObject } from 'react'

const IndicatorMask = styled(Box)({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  borderRadius: '10px',
  opacity: 0,
  transform: 'scaleY(0)',
  transition: 'transform 0.15s,opacity 0.3s'
})

const Indicator = forwardRef<HTMLElement[]>((props, ref) => {
  // 回调Ref
  const measuredRef = useCallback(
    (node: HTMLElement) => {
      const index = node?.dataset.index
      if (index !== undefined) {
        ;(ref as MutableRefObject<HTMLElement[]>).current[Number(index)] = node
      }
    },
    [ref]
  )

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        borderRadius: '10px',
        backgroundColor: '#b2b2b2',
        overflow: 'hidden',
        boxShadow: '0 0 10px 0 #b2b2b2'
      }}>
      <IndicatorMask
        data-index="1"
        ref={measuredRef}
        sx={{
          transformOrigin: 'bottom',
          backgroundImage: 'linear-gradient(#f3ea91, #e0651d)'
        }}
      />
      <IndicatorMask
        data-index="0"
        ref={measuredRef}
        sx={{
          transformOrigin: 'top',
          backgroundImage: 'linear-gradient(#7a82be, #85e9e1)'
        }}
      />
    </Box>
  )
})
export default Indicator
