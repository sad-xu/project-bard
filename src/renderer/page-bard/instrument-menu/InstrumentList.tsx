import { Avatar, Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectInstrumentConfig,
  setInstrumentName
} from '../../store/bardSlice'
import { InstrumentItem, INSTRUMENT_LIST } from '.'

/** 乐器列表 */
const InstrumentList = () => {
  const dispatch = useDispatch()
  const instrumentConfig = useSelector(selectInstrumentConfig)

  /** 设置乐器种类 */
  const handleChooseInstrument = (item: InstrumentItem) => {
    if (item.fileName !== instrumentConfig.name) {
      dispatch(setInstrumentName(item.fileName))
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        fontSize: '14px'
        // maxWidth: '40vw'
      }}>
      {INSTRUMENT_LIST.map((list, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            borderBottom: '1px dashed #575757',
            mb: 1,
            pb: 0.5,
            justifyContent: {
              xs: 'center',
              sm: 'initial'
            },
            '&:last-of-type': {
              borderBottom: 0
            }
          }}>
          {list.map((item) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
                flexGrow: 0,
                cursor: 'pointer',
                ml: 0.5,
                mr: 0.5,
                mb: 1,
                p: 1,
                minWidth: '92px',
                borderRadius: '8px',
                transition: 'all 0.2s',
                boxShadow:
                  instrumentConfig.name === item.fileName
                    ? 'inset 0 1px 9px 2px #b1b1b1, 2px 3px 5px 0 #151515'
                    : '',
                ':hover': {
                  backgroundColor: '#303030'
                }
              }}
              key={item.name}
              onClick={() => handleChooseInstrument(item)}>
              <Avatar
                sx={{ mb: 1 }}
                alt="乐器"
                variant="square"
                src={item.icon}
              />
              <span>{item.name}</span>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default InstrumentList
