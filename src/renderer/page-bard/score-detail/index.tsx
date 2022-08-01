import { Box, Collapse, Switch, Tooltip } from '@mui/material'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentScoreId,
  selectIsDetailOpen,
  setIsDetailOpen
} from 'store/app'
import MIDI from 'types/midi'
import { base64ToArrayBuffer, CURRENT_NOTES, SHOW_STAVE_SCORE } from 'utils'
import { MidiInfo, midiToStave, parseMIDI } from '../../utils/MIDI'
import NumberScore, { Note, parseToNotes } from './components/NumberScore'
import PlayerMenu from './components/PlayerMenu'
import ScaleButton from './components/ScaleButton'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import ScoreBaseInfo from './components/ScoreBaseInfo'
import { message } from 'components/Message'

// AlphaTabApi | null
let alphaTabApi: any = null
export const MAX_SCALE = 1.5
export const MIN_SCALE = 0.5

let base64Data = ''

const ScoreDetail = () => {
  const dispatch = useDispatch()
  const currentScoreId = useSelector(selectCurrentScoreId)
  const isDetailOpen = useSelector(selectIsDetailOpen)

  const stavePaperRef = useRef<HTMLDivElement>(null)
  const [isStave, setIsStave] = useState(
    !!Number(localStorage.getItem(SHOW_STAVE_SCORE))
  )
  const [scale, setScale] = useState(1) // 缩放比例
  const [scoreInfo, setScoreInfo] = useState<MIDI | null>(null)
  const [midiInfo, setMidiInfo] = useState<MidiInfo | null>(null)
  const [allNotes, setAllNotes] = useState<Note[]>([])
  // 菜单
  const menuWrapperRef = useRef<HTMLDivElement>(null)

  // id变化后获取新数据
  // useEffect(() => {
  //   if (!currentScoreId) return
  //   getMidiDetail(currentScoreId).then(() => {
  //     if (!isDetailOpen) {
  //       dispatch(setIsDetailOpen(true))
  //     }
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentScoreId])

  // 初始化 & 切换 画五线谱
  useEffect(() => {
    if (midiInfo) {
      if (isStave) {
        drawStave(midiInfo, scale)
      }
    }
  }, [midiInfo, isStave, scale])

  /** 获取曲谱详情 */
  const getMidiDetail = useCallback((id: string) => {
    // return fetchMIDIInfo(id).then((res) => {
    //   base64Data = res.file
    //   const arrayBuffer = base64ToArrayBuffer(res.file.slice(22))
    //   const parsedMidiInfo = parseMIDI(arrayBuffer)
    //   const notes = parseToNotes(parsedMidiInfo)
    //   setScoreInfo(res)
    //   setMidiInfo(parsedMidiInfo)
    //   setAllNotes(notes)
    //   window.sessionStorage.setItem(CURRENT_NOTES, JSON.stringify(notes))
    // })
  }, [])

  /** 切换展开|收起 */
  const toggleDetailOpen = () => {
    dispatch(setIsDetailOpen(!isDetailOpen))
  }

  /** 切换简谱|五线谱 */
  const handleToggleIsStave = () => {
    setIsStave(!isStave)
    localStorage.setItem(SHOW_STAVE_SCORE, !isStave ? '1' : '0')
  }

  /** 谱子缩放 */
  const handleScaleScore = (zoom: -1 | 1) => {
    const newScale = Number((scale + zoom * 0.1).toFixed(2))
    if (newScale <= MAX_SCALE && newScale >= MIN_SCALE) {
      setScale(newScale)
    }
  }

  /** 画五线谱 */
  const drawStave = (midiInfo: MidiInfo, scale: number = 1) => {
    if (alphaTabApi) alphaTabApi.destroy()
    const tex = midiToStave(midiInfo)
    // eslint-disable-next-line
    alphaTabApi = new window.alphaTab.AlphaTabApi(
      stavePaperRef.current as HTMLElement,
      {
        useWorkers: false,
        fontDirectory: '/soundfonts/',
        padding: [10, 0, 0, 0],
        scale,
        staveProfile: 'Score',
        stretchForce: 0.8,
        player: {
          enableUserInteraction: false
        },
        resources: {
          barNumberColor: '#e91e63',
          barSeparatorColor: '#9e9e9e',
          mainGlyphColor: '#fff',
          scoreInfoColor: '#fff',
          secondaryGlyphColor: '#fff',
          staffLineColor: '#9e9e9e'
        },
        notation: {
          notationMode: 'SongBook',
          // RhythmHeight: 20,
          elements: {
            EffectDynamics: false
          }
        }
      }
    )
    // alphaTabApi.error.on((err: any) => {
    //   console.log(err)
    // })
    // alphaTabApi.renderStarted.on(() => {
    //   console.log('start')
    // })
    alphaTabApi.renderFinished.on(() => {
      const wrapper = (stavePaperRef.current as HTMLElement).querySelector(
        '.at-surface'
      )
      if (wrapper) {
        const lastChild = wrapper.lastChild
        if (lastChild) wrapper.removeChild(lastChild)
      }
    })
    alphaTabApi.tex(tex)
  }

  /** 曲谱滚动 */
  const handleScroll = (e: any) => {
    if (e.target.scrollTop > 60) {
      menuWrapperRef.current && (menuWrapperRef.current.style.opacity = '0')
    } else {
      menuWrapperRef.current && (menuWrapperRef.current.style.opacity = '')
    }
  }

  /** 清空数据 */
  const clear = () => {
    setScoreInfo(null)
    setMidiInfo(null)
    setAllNotes([])
    alphaTabApi?.destroy()
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: '0 2px 10px 0 rgba(49,49,49,0.7)'
      }}>
      {currentScoreId && !isDetailOpen && (
        <Box
          sx={{
            position: 'absolute',
            wordBreak: 'keep-all',
            border: '1px solid #616161',
            borderRadius: '0 20px 20px 0',
            top: 16,
            left: 0,
            pl: 1,
            pr: 1.5,
            boxShadow: '0 1px 5px #7e7e7e',
            color: '#fff',
            fontWeight: 'bold',
            backgroundColor: 'rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}
          onClick={toggleDetailOpen}>
          <Box>{scoreInfo?.name}</Box>
        </Box>
      )}

      <Collapse in={isDetailOpen} orientation="horizontal">
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            width: '100vw',
            height: {
              xs: 'calc(100vh - 44px)',
              sm: 'calc(100vh - 179px)'
            },
            // backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(79,79,79,0.3)'
          }}>
          <Box
            sx={{
              position: 'relative',
              flexGrow: 1,
              height: '100%',
              overflow: 'hidden'
            }}>
            <Box
              ref={menuWrapperRef}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                pr: '70px',
                pl: 2,
                background: 'rgba(39, 39, 39, 0.35)',
                opacity: allNotes.length ? 1 : 0,
                transition: 'box-shadow 0.3s,opacity 0.3s',
                boxShadow: '0 0 10px 0 #434343',
                zIndex: allNotes.length ? 2 : -1,
                '&:hover': {
                  boxShadow: '0 0 10px 3px #434343',
                  opacity: '1 !important'
                }
              }}>
              {/* 收起 */}
              <KeyboardDoubleArrowLeftIcon
                sx={{
                  cursor: 'pointer',
                  mr: 1,
                  transition: 'color 0.3s',
                  '&:hover': {
                    color: '#cddc39'
                  }
                }}
                onClick={toggleDetailOpen}
              />
              {/* 切换曲谱展现方式 */}
              <CustomSwitch checked={isStave} onChange={handleToggleIsStave} />
              {/* 尺寸调节 */}
              <ScaleButton scale={scale} handleScaleScore={handleScaleScore} />
              {/* 播放器 */}
              <PlayerMenu allNotes={allNotes} />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                p: 2,
                pt: 4,
                width: '100%',
                height: '100%',
                overflowY: 'auto'
              }}
              onScroll={handleScroll}>
              {isStave && <Box ref={stavePaperRef}></Box>}
              {!isStave && !!allNotes.length && (
                <NumberScore scale={scale} allNotes={allNotes} />
              )}
            </Box>
            {/* 基本信息 */}
            {scoreInfo && <ScoreBaseInfo scoreInfo={scoreInfo} />}
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
}

const CustomSwitch = ({
  checked,
  onChange
}: {
  checked: boolean
  onChange: () => void
}) => {
  return (
    <Tooltip title="切换简谱/五线谱" placement="bottom" arrow>
      <Switch
        sx={{
          width: 58,
          height: 34,
          mr: 1,
          '& .MuiSwitch-switchBase': {
            m: 0,
            p: 0,
            transform: 'translate(4px,25%)',
            '&.Mui-checked': {
              color: '#fff',
              transform: 'translate(26px,25%)',
              '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 1024 1024"><path fill="%23fff" d="M455.17866667 288.59733333l336.48-78.944v-55.60533333l-336.48 79.18933333v55.36zM288.61866667 672.24533333c36.576 0 71.008 9.632 98.688 26.24V201.94133333l0.46933333-1.184v-0.49066666l0.24533334-0.46933334V198.592l0.24533333-0.49066667 0.24533333-0.46933333v-0.96h0.224l0.24533334-1.216v-0.49066667c0.71466667-1.67466667 1.696-3.59466667 2.66666666-5.04533333v-0.46933333l0.46933334-0.24533334v-0.49066666l0.49066666-0.224 0.224-0.98133334 0.49066667-0.46933333 0.96-0.96v-0.96h0.49066667l0.224-0.49066667 0.49066666-0.46933333 0.46933334-0.24533333v-0.24533334l0.49066666-0.46933333 1.92-1.45066667v-0.46933333h0.24533334l0.71466666-0.49066667 0.24533334-0.46933333h0.24533333l1.42933333-1.45066667 0.49066667-0.24533333 0.46933333-0.24533333v-0.224l0.49066667-0.24533334 1.42933333-0.71466666v-0.24533334l1.20533334-0.71466666h0.24533333c1.45066667-0.736 2.88-1.216 4.58666667-1.70666667 1.42933333-0.96 3.104-1.42933333 5.056-1.42933333l401.94133333-94.592c17.824-4.096 35.14666667 6.26133333 40.448 23.09333333v0.49066667c1.42933333 3.59466667 1.92 7.22133333 1.92 11.30666666v604.11733334c-0.49066667 38.77333333-20.21333333 73.664-51.97866667 98.21866666-29.84533333 23.584-70.29333333 37.536-114.58133333 37.536-44.288 0-84.96-13.952-114.80533333-37.06666666-32.02133333-25.26933333-51.75466667-60.40533333-51.75466667-100.11733334 0-39.488 19.744-74.63466667 51.75466667-99.648 29.84533333-23.33866667 70.272-37.55733333 114.80533333-37.55733333 36.59733333 0 70.76266667 9.888 98.688 26.70933333V251.27466667l-336.48 79.18933333V810.88c-0.49066667 38.528-20.45866667 73.184-52 98.21866667-29.84533333 23.09333333-70.272 37.312-114.56 37.312-44.288 0-84.96-14.21866667-114.58133333-37.312-32.23466667-25.51466667-52.224-60.40533333-52.224-100.13866667 0-38.99733333 19.98933333-74.60266667 52.224-99.648 29.62133333-23.09333333 70.28266667-37.06666667 114.58133333-37.06666667z m72.68266667 90.496c-17.824-14.19733333-43.79733333-23.09333333-72.68266667-23.09333333s-54.89066667 8.90666667-73.17333333 23.09333333c-15.40266667 12.52266667-25.504 28.88533333-25.504 46.208 0 17.824 10.10133333 34.18666667 25.504 46.70933334 18.29333333 14.19733333 44.288 22.624 73.17333333 22.624s54.85866667-8.42666667 72.68266667-22.624c16.11733333-12.52266667 26.00533333-28.88533333 26.00533333-46.70933334-0.01066667-17.32266667-9.888-33.68533333-26.00533333-46.208z m404.84266666-93.13066666c-18.28266667-14.19733333-44.288-22.88-73.17333333-22.88s-54.85866667 8.68266667-73.17333333 22.88c-15.40266667 12.27733333-25.504 28.88533333-25.504 46.464 0 17.32266667 10.10133333 33.93066667 25.504 46.208 18.31466667 14.44266667 44.288 23.09333333 73.17333333 23.09333333s54.89066667-8.65066667 73.17333333-23.09333333c15.40266667-11.808 25.04533333-28.416 25.504-45.248v-1.67466667c-0.24533333-17.35466667-10.10133333-33.472-25.504-45.49333333v-0.256z"></path></svg>')`
              },
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#8796A5'
              }
            }
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: '#03a9f4',
            width: 24,
            height: 24,
            '&:before': {
              content: "''",
              position: 'absolute',
              left: 4,
              top: 4,
              right: 4,
              bottom: 4,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill="%23fff" d="M307.7 546.2H230.75V214.1H170.9a265.05 265.05 0 0 1-94.95 34.2v49.95H152v247.95H62v65.7h245.7zM480.95 270.35a57.6 57.6 0 0 1 61.2 64.8c0 58.95-70.2 128.7-176.4 229.95v45h273.6V543.5h-90c-19.35 0-45 0-66.6 4.5C557 471.5 620 399.95 620 332a119.25 119.25 0 0 0-128.25-126 164.7 164.7 0 0 0-130.05 62.55l45 45a107.55 107.55 0 0 1 74.25-43.2zM810.8 553.4a129.6 129.6 0 0 1-90-41.85l-38.25 51.3a173.7 173.7 0 0 0 135 56.7c77.85 0 143.55-42.3 143.55-115.2a100.35 100.35 0 0 0-81-98.1v-3.15a94.5 94.5 0 0 0 67.95-90c0-68.4-53.55-107.1-132.3-107.1A180 180 0 0 0 692 256.85l45 49.95a111.6 111.6 0 0 1 77.4-36.45c34.65 0 54.45 18 54.45 49.05S842.75 377 767.6 377v58.5c90 0 112.5 23.85 112.5 62.55s-27.9 55.35-69.3 55.35zM917 728H107a45 45 0 0 0 0 90h810a45 45 0 0 0 0-90z"></path></svg>')`
            }
          },
          '& .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: '#8796A5',
            borderRadius: 10
          }
        }}
        checked={checked}
        onChange={onChange}></Switch>
    </Tooltip>
  )
}

export default ScoreDetail
