import { Box, Divider, Slider, SliderThumb } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectInstrumentConfig,
  setInstrumentDuration,
  setInstrumentVolume
} from '../../store/bardSlice'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import TimelapseIcon from '@mui/icons-material/Timelapse'

const InstrumentSetting = () => {
  const dispatch = useDispatch()
  const instrumentConfig = useSelector(selectInstrumentConfig)

  const [instrumentConfigCloned] = useState(instrumentConfig)

  /** 设置音量 */
  const handleVolumnChange = (
    e: React.SyntheticEvent | Event,
    val: number | Array<number>
  ) => {
    const percent = val as number
    dispatch(setInstrumentVolume(percent))
  }

  /** 设置持续时间 */
  const handleDurationChange = (
    e: React.SyntheticEvent | Event,
    val: number | Array<number>
  ) => {
    dispatch(setInstrumentDuration(val as number))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        pt: 4
      }}>
      <Box>
        <Divider textAlign="left">音量</Divider>
        <Slider
          aria-label="音量"
          sx={{ color: '#cfeaff' }}
          defaultValue={instrumentConfigCloned.volume}
          valueLabelFormat={(v: number) => `${v * 100}%`}
          components={{
            Thumb: (props) => {
              const { children, ...other } = props
              return (
                <SliderThumb {...other}>
                  {children}
                  <VolumeUpIcon sx={{ color: '#1c4659' }} fontSize="small" />
                </SliderThumb>
              )
            }
          }}
          valueLabelDisplay="auto"
          marks
          min={0}
          max={1}
          step={0.1}
          onChangeCommitted={handleVolumnChange}
        />
      </Box>
      {/*  */}
      <Box>
        <Divider textAlign="left" light>
          音长
        </Divider>
        <Slider
          aria-label="音长"
          sx={{ color: '#cfeaff' }}
          defaultValue={instrumentConfigCloned.duration}
          valueLabelFormat={(v: number) => `${v}s`}
          components={{
            Thumb: (props) => {
              const { children, ...other } = props
              return (
                <SliderThumb {...other}>
                  {children}
                  <TimelapseIcon sx={{ color: '#1c4659' }} fontSize="small" />
                </SliderThumb>
              )
            }
          }}
          valueLabelDisplay="auto"
          marks
          min={0.1}
          max={1.5}
          step={0.1}
          onChangeCommitted={handleDurationChange}
        />
        <Box
          sx={{
            fontSize: 12,
            color: '#999',
            ml: 1,
            mt: -0.5,
            mb: 1
          }}
          style={{ fontSize: '12px', marginLeft: '8px' }}>
          <div>*&nbsp;&nbsp;指单个音从松开按键到彻底无声经过的时间</div>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;比如小提琴可设长一点，竖琴可设短一点
          </div>
        </Box>
      </Box>
    </Box>
  )
}

export default InstrumentSetting
