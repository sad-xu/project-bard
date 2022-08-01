import { Box, Checkbox, Divider, FormControlLabel, Slider } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectMetroConfig,
  setMetroBeat,
  setMetroBpm,
  setMetroIsDing,
  setMetroVolume
} from '../../store/bardSlice'

/** 节拍器设置 */
const MetroSetting = () => {
  const metroConfig = useSelector(selectMetroConfig)
  const dispatch = useDispatch()

  const [metroConfigCloned] = useState(metroConfig)

  const handleBpmChange = (
    e: React.SyntheticEvent | Event,
    val: number | Array<number>
  ) => {
    const bpm = val as number
    dispatch(setMetroBpm(bpm))
  }

  const handleBeatChange = (
    e: React.SyntheticEvent | Event,
    val: number | Array<number>
  ) => {
    const beat = val as number
    dispatch(setMetroBeat(beat))
  }

  const handleVolumeChange = (
    e: React.SyntheticEvent | Event,
    val: number | Array<number>
  ) => {
    const volume = val as number
    dispatch(setMetroVolume(volume))
  }

  const handleToggIsDing = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked ? '1' : '0'
    dispatch(setMetroIsDing(val))
  }

  return (
    <Box>
      <Divider textAlign="left" light>
        节拍器
      </Divider>
      <Box sx={{ pl: 2, pr: 2, pt: 2 }}>
        <Box>每分钟节拍数BPM (10 - 200)</Box>
        <Slider
          size="small"
          defaultValue={metroConfigCloned.bpm}
          valueLabelDisplay="auto"
          min={10}
          max={200}
          step={1}
          onChangeCommitted={handleBpmChange}
        />
        <Box>每小节节拍数BEAT (2 - 7)</Box>
        <Slider
          size="small"
          defaultValue={metroConfigCloned.beat}
          valueLabelDisplay="auto"
          marks
          min={2}
          max={7}
          step={1}
          onChangeCommitted={handleBeatChange}
        />
        <Box>节拍器音量</Box>
        <Slider
          size="small"
          defaultValue={metroConfigCloned.volume}
          valueLabelFormat={(v: number) => `${v * 100}%`}
          valueLabelDisplay="auto"
          marks
          min={0}
          max={1}
          step={0.1}
          onChangeCommitted={handleVolumeChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={Boolean(+metroConfigCloned.isDing)}
              onChange={handleToggIsDing}
            />
          }
          label="每小节敲响震铃"
        />
      </Box>
    </Box>
  )
}

export default MetroSetting
