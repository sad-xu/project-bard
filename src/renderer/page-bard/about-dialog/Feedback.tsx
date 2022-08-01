import SendIcon from '@mui/icons-material/Send'
import { Box, Button, TextField } from '@mui/material'
// import { uploadFeedback } from 'api/base'
// import { message } from 'components/Message'
import { useRef } from 'react'
// import { useSelector } from 'react-redux'
// import { selectUserInfo } from '../../store/userSlice'

const FeedbackDialog = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  // const userInfo = useSelector(selectUserInfo)

  const handleSendFeedback = () => {
    const content = inputRef?.current?.value.trim()
    if (content && content.length) {
      // send
      // uploadFeedback(content, userInfo.name)
      //   .then((res) => {
      //     message.success('您的反馈已发送')
      //     if (inputRef.current && inputRef.current.value) {
      //       inputRef.current.value = ''
      //     }
      //   })
      //   .catch((err) => {
      //     message.error('您的反馈收不到了，直接QQ联系吧😢')
      //   })
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 4,
          pt: 0,
          pb: 0,
          mb: 2
        }}>
        <Box
          sx={{
            fontSize: 14,
            color: '#999',
            lineHeight: 2
          }}>
          <li>个人开发，不懂音乐，用爱发电，难免有许多不足</li>
          <li>希望能告诉我你的使用感受、反馈意见</li>
          <li>如果能提供一些有用的帮助，如界面美化、插图等，就再好不过了</li>
          <li>任何做出贡献的小伙伴，都会被添加到 `关于我们` 里</li>
        </Box>
        <TextField
          sx={{
            mt: 2
          }}
          inputRef={inputRef}
          label="您的反馈"
          multiline
          rows={4}
        />
      </Box>
      <Box
        sx={{
          mt: 4,
          textAlign: 'center'
        }}>
        <Button
          size="large"
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSendFeedback}>
          发送
        </Button>
      </Box>
    </Box>
  )
}

export default FeedbackDialog
