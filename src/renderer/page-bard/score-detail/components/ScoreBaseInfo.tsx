import { Box } from '@mui/material'
import MIDI from 'types/midi'
import AlbumIcon from '@mui/icons-material/Album'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import { parseDate } from 'utils'

const InfoItem = ({
  children,
  text
}: {
  children?: any
  text: string | number
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mr: 2
      }}>
      {children}
      {text}
    </Box>
  )
}

const ScoreBaseInfo = ({ scoreInfo }: { scoreInfo: MIDI }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: '1.5em',
        left: 0,
        right: 0,
        pl: 4,
        pr: 1,
        transform: 'translateY(100%)',
        transition: 'transform 0.3s',
        backdropFilter: 'blur(10px)',
        backgroundColor: '#0c1d288f',
        boxShadow: '0 0 10px 0 #000',
        zIndex: 2,
        '&:hover': {
          transform: 'translateY(1.5em)'
        }
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
          <InfoItem text={scoreInfo.name}>
            <AlbumIcon fontSize="small" sx={{ mr: 1 }} />
          </InfoItem>
          <InfoItem text={scoreInfo.authName}>
            <FaceRetouchingNaturalIcon fontSize="small" sx={{ mr: 1 }} />
          </InfoItem>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
          <InfoItem text={scoreInfo.watchNum}>
            <StarBorderIcon fontSize="small" sx={{ mr: 1 }} />
          </InfoItem>
          <InfoItem text={scoreInfo.collectedNum}>
            <FavoriteIcon fontSize="small" sx={{ mr: 1 }} />
          </InfoItem>
          <InfoItem text={scoreInfo.notesNum}>
            <AudiotrackIcon fontSize="small" sx={{ mr: 1 }} />
          </InfoItem>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
        <InfoItem text={scoreInfo.desc}>
          <MessageOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        </InfoItem>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
        <InfoItem text={'上传人: ' + scoreInfo.uploaderName}></InfoItem>
        <InfoItem text={parseDate(scoreInfo.uploadTime)}></InfoItem>
        {/* <InfoItem
          text={
            '最后修改时间: ' + parseDate(scoreInfo.lastModified)
          }></InfoItem> */}
      </Box>
    </Box>
  )
}

export default ScoreBaseInfo
