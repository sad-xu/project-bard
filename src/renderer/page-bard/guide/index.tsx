import { Box, Grow, IconButton, Portal, Tooltip } from '@mui/material'
import { useState } from 'react'
import HelpIcon from '@mui/icons-material/Help'

const GuideDialog = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Tooltip title="使用说明" placement="left" arrow>
        <IconButton onClick={() => setOpen(!open)}>
          <HelpIcon />
        </IconButton>
      </Tooltip>
      <Portal>
        <Grow in={open}>
          <Box
            sx={{
              position: 'fixed',
              top: '5%',
              left: '7%',
              width: '86%'
            }}
            onClick={() => setOpen(false)}
            component="img"
            alt="guide"
            src="https://event-5gdjtgwpc8ae552d-1304999371.tcloudbaseapp.com/cdn/guide.jpg"></Box>
        </Grow>
      </Portal>
    </>
  )
}

export default GuideDialog
