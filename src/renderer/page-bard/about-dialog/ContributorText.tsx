import { Avatar, Box } from '@mui/material'
import useMouseSkew from '../../hooks/useMouseSkew'

const contributerList = [
  {
    avatar:
      'https://event-5gdjtgwpc8ae552d-1304999371.tcloudbaseapp.com/cdn/contributer-1-2.png',
    name: '妙蛤种子@琥珀原',
    intro: '光之演奏家Ⅰ&Ⅱ站长',
    job: '前端 & 后端 开发'
  },
  {
    avatar:
      'https://event-5gdjtgwpc8ae552d-1304999371.tcloudbaseapp.com/cdn/contributer-2-2.jpg',
    name: '黑涡@延夏',
    intro: '帧动画咸鱼',
    job: 'loading动画提供'
  },
  {
    avatar:
      'https://event-5gdjtgwpc8ae552d-1304999371.tcloudbaseapp.com/cdn/contributer-4-2.jpg',
    name: 'Yuio@海猫茶屋',
    intro: '--',
    job: '使用指南制作'
  },
  {
    avatar:
      'https://event-5gdjtgwpc8ae552d-1304999371.tcloudbaseapp.com/cdn/contributer-3-2.jpg',
    name: 'Arya',
    intro: '不知名UI体验选手',
    job: '设计指导'
  }
]

const ContributorText = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
      }}>
      {contributerList.map((item) => (
        <ContributeItem key={item.name} contributer={item} />
      ))}
    </Box>
  )
}

const ContributeItem = ({
  contributer
}: {
  contributer: {
    avatar: string
    name: string
    intro: string
    job: string
  }
}) => {
  const { targetDom } = useMouseSkew()

  return (
    <Box
      ref={targetDom}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #626262',
        borderRadius: '8px',
        p: 2,
        pl: 1,
        pr: 1,
        m: 2,
        minWidth: '180px',
        boxShadow: '2px 2px 5px #626262',
        backgroundColor: '#333',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2
        }
      }}>
      <Avatar sx={{ width: 100, height: 100 }} src={contributer.avatar} />
      <Box sx={{ mb: 1, mt: 1.5, fontWeight: 'bold', fontSize: 18 }}>
        {contributer.name}
      </Box>
      <Box sx={{ fontSize: 16, mb: 0.5 }}>{contributer.intro}</Box>
      <Box sx={{ fontSize: 14 }}>{contributer.job}</Box>
    </Box>
  )
}

export default ContributorText
