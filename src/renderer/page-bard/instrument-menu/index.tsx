import { Avatar, Box, Divider, Drawer } from '@mui/material'
import { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  selectInstrumentConfig
  // setInstrumentIsMock,
  // toggleCanPlay
} from '../../store/bardSlice'
import InstrumentList from './InstrumentList'
import ClarinetIcon from '../../assets/clarinet.png'
import CymbalIcon from '../../assets/cymbal.png'
import FluteIcon from '../../assets/flute.png'
import HarpIcon from '../../assets/harp.png'
import SteelguitarIcon from '../../assets/steelguitar.png'
import HornIcon from '../../assets/horn.png'
import OboeIcon from '../../assets/oboe.png'
import PianoIcon from '../../assets/piano.png'
import TimpaniIcon from '../../assets/timpani.png'
import TromboneIcon from '../../assets/trombone.png'
import TrumpetIcon from '../../assets/trumpet.png'
import TubaIcon from '../../assets/tuba.png'
import ViolinIcon from '../../assets/violin.png'
import OverdrivenGuitarIcon from '../../assets/overdriven-guitar.png'
import CleanGuitarIcon from '../../assets/clean-guitar.png'
import MutedGuitarIcon from '../../assets/muted-guitar.png'
import PizzicatoIcon from '../../assets/pizzicato.png'
import ViolaIcon from '../../assets/viola.png'
import CelloIcon from '../../assets/cello.png'
import ContrabassIcon from '../../assets/contrabass.png'
import PowerchordGuitarIcon from '../../assets/powerchord-guitar.png'
import SpecialGuitarIcon from '../../assets/special-guitar.png'
import PiccoloIcon from '../../assets/piccolo.png'
import PanfluteIcon from '../../assets/panflute.png'
import AltosaxIcon from '../../assets/altosax.png'
import BongoIcon from '../../assets/bongo.png'
import BdIcon from '../../assets/bd.png'
import SnareIcon from '../../assets/snare.png'
// import Sound from '../utils/Sound'
import MetroSetting from './MetroSetting'
import InstrumentSetting from './InstrumentSetting'
import BgSetting from './BgSetting'
import { isMobile } from '../../utils'

interface InstrumentMenuProps {
  instrumentMenuOpen: boolean
  toggleInstrumentMenu: (flag: boolean) => void
}

/** 单个乐器属性 */
export interface InstrumentItem {
  name: string
  fileName: string
  icon: string
}

/** 乐器列表  */
export const INSTRUMENT_LIST: InstrumentItem[][] = [
  [
    { name: '竖琴', fileName: 'ff-harp', icon: HarpIcon },
    { name: '钢琴', fileName: 'ff-grandpiano', icon: PianoIcon },
    { name: '鲁特琴', fileName: 'ff-steelguitar', icon: SteelguitarIcon },
    { name: '拨弦提琴', fileName: 'ff-pizzicato', icon: PizzicatoIcon }
  ],
  [
    { name: '小提琴', fileName: 'ff-violin', icon: ViolinIcon },
    { name: '中提琴', fileName: 'ff-viola', icon: ViolaIcon },
    { name: '大提琴', fileName: 'ff-cello', icon: CelloIcon },
    { name: '低音提琴', fileName: 'ff-contrabass', icon: ContrabassIcon }
  ],
  [
    {
      name: '过载吉他',
      fileName: 'ff-ele-overdriven',
      icon: OverdrivenGuitarIcon
    },
    { name: '清音吉他', fileName: 'ff-ele-clean', icon: CleanGuitarIcon },
    { name: '闷音吉他', fileName: 'ff-ele-mute', icon: MutedGuitarIcon },
    {
      name: '重力和弦',
      fileName: 'ff-ele-powerchord',
      icon: PowerchordGuitarIcon
    },
    { name: '特殊奏法', fileName: 'ff-ele-special', icon: SpecialGuitarIcon }
  ],
  [
    { name: '长笛', fileName: 'ff-flute', icon: FluteIcon },
    { name: '双簧管', fileName: 'ff-oboe', icon: OboeIcon },
    { name: '单簧管', fileName: 'ff-clarinet', icon: ClarinetIcon },
    { name: '横笛', fileName: 'ff-piccolo', icon: PiccoloIcon },
    { name: '排箫', fileName: 'ff-panflute', icon: PanfluteIcon }
  ],
  [
    { name: '小号', fileName: 'ff-trumpet', icon: TrumpetIcon },
    { name: '长号', fileName: 'ff-trombone', icon: TromboneIcon },
    { name: '大号', fileName: 'ff-tuba', icon: TubaIcon },
    { name: '圆号', fileName: 'ff-horn', icon: HornIcon },
    { name: '萨克斯', fileName: 'ff-altosax', icon: AltosaxIcon }
  ],
  [
    { name: '定音鼓', fileName: 'ff-timpani', icon: TimpaniIcon },
    { name: '邦戈鼓', fileName: 'ff-bongo', icon: BongoIcon },
    { name: '低音鼓', fileName: 'ff-bd', icon: BdIcon },
    { name: '小军鼓', fileName: 'ff-snare', icon: SnareIcon },
    { name: '镲', fileName: 'ff-cymbal', icon: CymbalIcon }
  ]
]

const getIconByName = (name: string) => {
  for (let i = 0; i < INSTRUMENT_LIST.length; i++) {
    for (let j = 0; j < INSTRUMENT_LIST[i].length; j++) {
      if (INSTRUMENT_LIST[i][j].fileName === name) {
        return INSTRUMENT_LIST[i][j].icon
      }
    }
  }
  return ''
}

/** 乐器设置 */
const InstrumentMenu = ({
  instrumentMenuOpen,
  toggleInstrumentMenu
}: InstrumentMenuProps) => {
  const instrumentConfig = useSelector(selectInstrumentConfig)

  const [icon, setIcon] = useState(HarpIcon)

  // 切换乐器，更换icon
  useEffect(() => {
    setIcon(getIconByName(instrumentConfig.name))
  }, [instrumentConfig.name])

  const handleClose = () => {
    toggleInstrumentMenu(false)
  }

  const handleOpen = () => {
    toggleInstrumentMenu(true)
  }

  // 不需要确认，本地即时生效
  return (
    <Box>
      <Avatar
        sx={{
          position: 'fixed',
          right: 0,
          bottom: '100px',
          width: 50,
          height: 50,
          transition: 'all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          borderRadius: '6px',
          backgroundColor: '#9e9e9e',
          cursor: 'pointer'
        }}
        onClick={handleOpen}
        alt="乐器"
        variant="square"
        src={icon}
      />
      <Drawer
        anchor="right"
        open={instrumentMenuOpen}
        ModalProps={{
          keepMounted: true
        }}
        onClose={handleClose}>
        {useMemo(() => {
          return <InstrumentMenuContent />
        }, [])}
      </Drawer>
    </Box>
  )
}

const InstrumentMenuContent = () => {
  // const [defaultIsMock] = useState(instrumentConfigCloned.isMock)

  /** 切换是否模拟 */
  // const handleToggleMock = (e: ChangeEvent<HTMLInputElement>) => {
  //   const val = e.target.checked ? '1' : '0'
  //   handleSetInstrumentConfigCloned({
  //     isMock: val
  //   })
  //   dispatch(setInstrumentIsMock(val))
  // }

  return (
    <Box
      sx={{
        pl: 2,
        pr: 2,
        overflowY: 'auto',
        width: '40vw',
        minWidth: {
          xs: 300,
          sm: 408
        }
      }}>
      {/*  */}
      <InstrumentSetting />
      {/*  */}
      {!isMobile && (
        <>
          <Divider light></Divider>
          <BgSetting />
        </>
      )}
      {/*  */}
      {/* <Box>
          <Divider textAlign="left" light>
            特性
          </Divider>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={Boolean(+defaultIsMock)}
                onChange={handleToggleMock}
              />
            }
            label="模拟FF14的演奏缺陷 - 未完成"
          />
          <TextSoundInput />
        </Box> */}

      <MetroSetting />
      {/*  */}
      <Divider sx={{ mb: 2 }} light>
        乐器
      </Divider>
      {/*  */}
      <InstrumentList />
    </Box>
  )
}

/*
const TextSoundInput = () => {
  const delayRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  const handleSetVal = () => {
    const delay = delayRef?.current?.value || '0'
    const interval = intervalRef?.current?.value || '0'
    console.log(delay, interval)
    Sound.setMockParams(+delay, +interval)
  }

  const handleFocus = () => {
    dispatch(toggleCanPlay(false))
  }

  const handleBlur = () => {
    dispatch(toggleCanPlay(true))
  }

  return (
    <Box sx={{ border: '1px dashed #eee', p: 1 }}>
      调试用：
      <TextField
        inputRef={delayRef}
        sx={{ width: 100, mr: 1 }}
        type="number"
        label="按下延迟/毫秒"
        defaultValue="300"
        size="small"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <TextField
        inputRef={intervalRef}
        sx={{ width: 100, mr: 1 }}
        type="number"
        label="最短间隔/毫秒"
        defaultValue="500"
        size="small"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Button variant="contained" onClick={handleSetVal}>
        应用
      </Button>
    </Box>
  )
}
 */

export default InstrumentMenu
