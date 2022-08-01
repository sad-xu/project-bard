import { Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentBgIndex, setCurrentBgIndex } from '../../store/app'

/** bg list */
export const BG_LIST = [
  {
    name: '6.0',
    avatar: require('../../assets/bg-s/bg-preview-6.0.png'),
    url: require('../../assets/video/20220210vid.mp4').default
  },
  {
    name: '5.5',
    avatar: require('../../assets/bg-s/bg-preview-5.5.png'),
    url: require('../../assets/video/20210809vid.mp4').default
  },
  {
    name: '5.4',
    avatar: require('../../assets/bg-s/bg-preview-5.4.png'),
    url: require('../../assets/video/20210401vid.mp4').default
  },
  {
    name: '5.2',
    avatar: require('../../assets/bg-s/bg-preview-5.2.png'),
    url: require('../../assets/video/5.2.mp4').default
  },
  {
    name: '4.5',
    avatar: require('../../assets/bg-s/bg-preview-4.5.png'),
    url: require('../../assets/video/4.5.mp4').default
  },
  {
    name: '4.x',
    avatar: require('../../assets/bg-s/bg-preview-4.x.png'),
    url: require('../../assets/video/4.x.mp4').default
  },
  {
    name: 'ladiesday',
    avatar: require('../../assets/bg-s/bg-preview-ladiesday.png'),
    url: require('../../assets/video/ffladiesday.mp4').default
  },
  {
    name: 'none',
    avatar: '',
    url: ''
  }
]

/** 背景设置 */
const BgSetting = () => {
  const dispatch = useDispatch()
  const currentBgIndex = useSelector(selectCurrentBgIndex)

  /** 设置当前背景 */
  const handleSetBgIndex = (i: number) => {
    if (i !== currentBgIndex) {
      dispatch(setCurrentBgIndex(i))
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        mt: 2
      }}>
      {BG_LIST.map((item, i) => (
        <Box
          key={item.url}
          sx={{
            flexShrink: 0,
            width: 120,
            height: 80,
            ml: '8px',
            mr: '8px',
            mb: '12px',
            backgroundColor: '#ff0',
            backgroundImage: `url(${item.avatar})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            cursor: 'pointer',
            borderRadius: '4px',
            boxShadow:
              i === currentBgIndex ? '0 0 8px #fff' : '0 0 2px #575757',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 0 8px #fff'
            }
          }}
          onClick={() => handleSetBgIndex(i)}></Box>
      ))}
    </Box>
  )
}

export default BgSetting
