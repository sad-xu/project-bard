import { Backdrop } from '@mui/material'
import { useEffect, useState } from 'react'
import TataRuLoading from '../assets/tataru-loading-4.gif'

const globalLoading = {
  show: () => {},
  hide: () => {}
}

const GlobalLoading = () => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    globalLoading.show = () => {
      setOpen(true)
    }
    globalLoading.hide = () => {
      setOpen(false)
    }
  }, [])
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}>
      {open && (
        <img
          style={{
            width: '20vw',
            minWidth: '200px',
            userSelect: 'none'
          }}
          alt="loading"
          src={TataRuLoading}
        />
      )}
    </Backdrop>
  )
}

export default GlobalLoading
export { globalLoading }
