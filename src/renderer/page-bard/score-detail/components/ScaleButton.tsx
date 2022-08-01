import { Button, ButtonGroup, Tooltip } from '@mui/material'
import TextIncreaseIcon from '@mui/icons-material/TextIncrease'
import TextDecreaseIcon from '@mui/icons-material/TextDecrease'
import { MAX_SCALE, MIN_SCALE } from '../'

/** 放大、缩小按钮 */
const ScaleButton = ({
  scale,
  handleScaleScore
}: {
  scale: number
  handleScaleScore: (zoom: -1 | 1) => void
}) => {
  return (
    <Tooltip title="尺寸调节" placement="bottom" arrow>
      <ButtonGroup sx={{ flexShrink: 0 }} variant="contained" size="small">
        <Button
          disabled={scale <= MIN_SCALE}
          onClick={() => handleScaleScore(-1)}>
          <TextDecreaseIcon fontSize="small" />
        </Button>
        <Button
          disabled={scale >= MAX_SCALE}
          onClick={() => handleScaleScore(1)}>
          <TextIncreaseIcon />
        </Button>
      </ButtonGroup>
    </Tooltip>
  )
}

export default ScaleButton
