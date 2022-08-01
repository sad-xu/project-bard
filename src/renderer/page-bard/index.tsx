import { Box, styled, IconButton, Tooltip } from '@mui/material'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleCanPlay } from '../store/bardSlice'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import { selectCurrentBgIndex, selectIsDetailOpen } from '../store/app'
import AboutDialog from './about-dialog'
import InstrumentMenu from './instrument-menu'
import Keyboard from './keyboard'
import KeyboardMenu from './keyboard-menu'
// import ScoreDetail from './score-detail'
// import Mug from './mug'
import Metronome from './metronome'
import { BG_LIST } from './instrument-menu/BgSetting'
import GuideDialog from './guide'
import FileSelector from './file-selector'

const BgVideo = styled('video')({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  opacity: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'opacity 1.5s, filter 0.5s',
  pointerEvents: 'none'
})

const BardPage = () => {
  const dispatch = useDispatch()
  const isDetailOpen = useSelector(selectIsDetailOpen)
  const currentBgIndex = useSelector(selectCurrentBgIndex)

  const videoRef = useRef<HTMLVideoElement>(null)

  const [bgUrl, setBgUrl] = useState('')

  useEffect(() => {
    setBgUrl(BG_LIST[currentBgIndex]?.url)
    videoRef.current?.load()
  }, [currentBgIndex])

  // 演奏设置
  const [keyboardMenuOpen, setKeyboardMenuOpen] = useState(false)
  const toggleKeyboardMenu = useCallback((flag: boolean) => {
    dispatch(toggleCanPlay(!flag))
    setKeyboardMenuOpen(flag)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 乐器设置
  const [instrumentMenuOpen, setInstrumentMenuOpen] = useState(false)
  const toggleInstrumentMenu = useCallback((flag: boolean) => {
    setInstrumentMenuOpen(flag)
  }, [])

  // 视频加载结束
  const handleLoadedData = () => {
    videoRef.current && (videoRef.current.style.opacity = '1')
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        userSelect: 'none'
      }}>
      {/* bg */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          right: 0,
          bottom: 180,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(${require('../assets/bg-1.jpeg')})`
        }}>
        <Box
          sx={{
            position: 'absolute',
            width: '60%',
            transform: 'translateX(-50%)',
            left: '50%',
            top: 0,
            bottom: 0,
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(${require('../assets/bg-2.png')})`
          }}
        />
      </Box>

      {/* video */}
      {bgUrl && (
        <BgVideo
          ref={videoRef}
          onLoadedData={handleLoadedData}
          autoPlay
          loop
          muted
          style={{
            filter: isDetailOpen ? 'blur(5px)' : 'unset'
          }}
          src={bgUrl}></BgVideo>
      )}

      {/*  */}
      <FileSelector></FileSelector>

      {/* 按键设置 */}
      {useMemo(
        () => (
          <KeyboardMenu
            keyboardMenuOpen={keyboardMenuOpen}
            toggleKeyboardMenu={toggleKeyboardMenu}
          />
        ),
        [keyboardMenuOpen, toggleKeyboardMenu]
      )}
      {/* 乐器设置 */}
      {useMemo(
        () => (
          <InstrumentMenu
            instrumentMenuOpen={instrumentMenuOpen}
            toggleInstrumentMenu={toggleInstrumentMenu}
          />
        ),
        [instrumentMenuOpen, toggleInstrumentMenu]
      )}

      {/* 乐谱详情 */}
      {/* {useMemo(
        () => (
          <ScoreDetail />
        ),
        []
      )} */}

      {/* 个人空间 */}
      {/* {useMemo(
        () => (
          <UserSpace />
        ),
        []
      )} */}

      {/* 键盘 */}
      <Box
        sx={{
          position: 'fixed',
          left: '50%',
          width: '80%',
          minWidth: {
            xs: 'initial',
            sm: '600px'
          },
          height: 155,
          bottom: 24,
          transform: 'translateX(-50%)',
          backgroundColor: 'transparent'
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}>
          {/* left */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              transform: {
                xs: 'translateX(-80%)',
                sm: 'translateX(-110%)'
              },
              display: 'flex',
              flexDirection: 'column'
            }}>
            {/* 乐谱查询 v2 */}
            {/* {useMemo(
              () => (
                <ScoreSearcher />
              ),
              []
            )} */}

            {/* 打开键位设置 */}
            <Tooltip title="键位设置" placement="left" arrow>
              <IconButton onClick={() => toggleKeyboardMenu(true)}>
                <KeyboardIcon />
              </IconButton>
            </Tooltip>

            {/* 关于开发 */}
            <AboutDialog />

            {/* 使用说明 */}
            <GuideDialog />
          </Box>

          {/* 键盘 */}
          {<Keyboard />}

          {/* 节拍器 */}
          {<Metronome />}

          {/* right */}
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              top: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transform: 'translateX(110%)'
            }}>
            {/* 音游按钮 */}
            {/* {!isMobile && <Mug />} */}
          </Box>
        </Box>
      </Box>
      {/*  */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          padding: '0 4px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          color: '#d8d8d8',
          fontSize: '12px',
          pointerEvents: 'none'
        }}>
        <span style={{ pointerEvents: 'auto' }}>
          光之演奏家 v2.1
          {/* <a
            style={{ color: '#ff9800', marginLeft: 20 }}
            target="_blank"
            href="https://ff14-3gaz7i4cedb8328b-1304999371.tcloudbaseapp.com"
            rel="noreferrer">
            1.0传送门
          </a> */}
        </span>

        <span>
          Made with <span style={{ color: '#e91e63' }}>❤</span>
        </span>
      </Box>
    </Box>
  )
}

export default BardPage
