import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward'
import {
  Box,
  Dialog,
  IconButton,
  Collapse,
  Tab,
  Tabs,
  Tooltip
} from '@mui/material'
import { forwardRef, Ref, useEffect, useState } from 'react'
import { TransitionProps } from 'react-transition-group/Transition'
import ContributorText from './ContributorText'
import IntroduceText from './IntroduceText'
import FeedbackPart from './Feedback'
import { toggleCanPlay } from '../../store/bardSlice'
import { useDispatch } from 'react-redux'

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>
    },
    ref: Ref<unknown>
  ) => {
    return <Collapse ref={ref} {...props} />
  }
)

const AboutDialog = () => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatch(toggleCanPlay(!open))
  }, [dispatch, open])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip title="开发计划" placement="left" arrow>
        <IconButton onClick={() => setOpen(true)}>
          <AccessibleForwardIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        scroll="paper"
        fullWidth>
        <TabsContent />
      </Dialog>
    </>
  )
}

const TabsContent = () => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          <Tab label="开发计划" id="tab-0" />
          <Tab label="关于我们" id="tab-1" />
          <Tab label="用户反馈" id="tab-2" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <IntroduceText />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ContributorText />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <FeedbackPart />
      </TabPanel>
      <Box
        sx={{
          textAlign: 'right',
          p: 2,
          fontSize: 14,
          color: '#999'
        }}>
        QQ: 1031568754
      </Box>
    </Box>
  )
}

function TabPanel(props: {
  children?: React.ReactNode
  index: number
  value: number
}) {
  const { children, value, index } = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{
        overflowY: 'auto',
        height: 'calc(100vh - 150px)'
      }}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  )
}

export default AboutDialog
