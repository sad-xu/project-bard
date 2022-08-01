import { Box, SxProps } from '@mui/material'
import TataRuLoading from '../assets/tataru-loading-4.gif'

const Loading = ({ sx, width }: { sx?: SxProps; width?: string }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', ...sx }}>
      <img
        style={{
          width: width || '20%',
          // minWidth: '200px',
          userSelect: 'none'
        }}
        alt="loading"
        src={TataRuLoading}
      />
    </Box>
  )
}

export default Loading
