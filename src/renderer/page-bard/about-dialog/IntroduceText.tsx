import { Box } from '@mui/material'

const BoxStyle = {
  m: 1,
  color: '#d3d3d3'
}

const IntroduceText = () => {
  return (
    <Box
      sx={{
        pl: 2,
        mb: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
      <Box sx={{ color: '#00bcd4', mb: 1 }}>🎨 新增了多个动态背景！</Box>
      <Box sx={{ color: '#ffeb3b', mb: 1 }}>
        🎹 高亮按键的匹配修改成和游戏里一致了
      </Box>
      <Box sx={{ color: '#ffeb3b', mb: 1 }}>
        🎉 音质大升级😎！还原度 Up Up ↑↑↑ 乐器种类补全！
      </Box>
      <Box sx={{ color: '#ffeb3b', mb: 1 }}>
        🎉 节拍器，在键盘右下角！右侧栏可以设置！
      </Box>

      <Box sx={{ mb: 1, mt: 2 }}>
        以下是最近的开发计划，将在之后的更新中跟大家见面
      </Box>

      <Box sx={BoxStyle}>
        😴 模拟 FF14 的<s>演奏缺陷</s>手感
      </Box>

      <Box sx={BoxStyle}>😴 midi 解析增加亿点细节</Box>

      <Box sx={BoxStyle}>😴 音游模式加强 或是模仿游戏里的模式？</Box>

      <Box sx={BoxStyle}>😴 UI 细节增加 FF14 元素</Box>

      <Box sx={BoxStyle}>😴 增加操作音效</Box>
    </Box>
  )
}

export default IntroduceText
