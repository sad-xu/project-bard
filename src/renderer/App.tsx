import { Suspense } from 'react'
import { CssBaseline, responsiveFontSizes } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter as Router } from 'react-router-dom'
import Loading from './components/Loading'
import Message from './components/Message'
import GlobalLoading from './components/GlobalLoading'

import BardPage from './page-bard'

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark'
    }
  })
)

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Message />
        <GlobalLoading />
        <Suspense fallback={<Loading sx={{ pt: '10vh' }} />}>
          {/* <Routes> */}
          <BardPage />
          {/* <Route path="/" element={<BardPage />} /> */}
          {/* </Routes> */}
        </Suspense>
      </Router>
    </ThemeProvider>
  )
}

export default App
