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

/** ?????????????????? */
export interface InstrumentItem {
  name: string
  fileName: string
  icon: string
}

/** ????????????  */
export const INSTRUMENT_LIST: InstrumentItem[][] = [
  [
    { name: '??????', fileName: 'ff-harp', icon: HarpIcon },
    { name: '??????', fileName: 'ff-grandpiano', icon: PianoIcon },
    { name: '?????????', fileName: 'ff-steelguitar', icon: SteelguitarIcon },
    { name: '????????????', fileName: 'ff-pizzicato', icon: PizzicatoIcon }
  ],
  [
    { name: '?????????', fileName: 'ff-violin', icon: ViolinIcon },
    { name: '?????????', fileName: 'ff-viola', icon: ViolaIcon },
    { name: '?????????', fileName: 'ff-cello', icon: CelloIcon },
    { name: '????????????', fileName: 'ff-contrabass', icon: ContrabassIcon }
  ],
  [
    {
      name: '????????????',
      fileName: 'ff-ele-overdriven',
      icon: OverdrivenGuitarIcon
    },
    { name: '????????????', fileName: 'ff-ele-clean', icon: CleanGuitarIcon },
    { name: '????????????', fileName: 'ff-ele-mute', icon: MutedGuitarIcon },
    {
      name: '????????????',
      fileName: 'ff-ele-powerchord',
      icon: PowerchordGuitarIcon
    },
    { name: '????????????', fileName: 'ff-ele-special', icon: SpecialGuitarIcon }
  ],
  [
    { name: '??????', fileName: 'ff-flute', icon: FluteIcon },
    { name: '?????????', fileName: 'ff-oboe', icon: OboeIcon },
    { name: '?????????', fileName: 'ff-clarinet', icon: ClarinetIcon },
    { name: '??????', fileName: 'ff-piccolo', icon: PiccoloIcon },
    { name: '??????', fileName: 'ff-panflute', icon: PanfluteIcon }
  ],
  [
    { name: '??????', fileName: 'ff-trumpet', icon: TrumpetIcon },
    { name: '??????', fileName: 'ff-trombone', icon: TromboneIcon },
    { name: '??????', fileName: 'ff-tuba', icon: TubaIcon },
    { name: '??????', fileName: 'ff-horn', icon: HornIcon },
    { name: '?????????', fileName: 'ff-altosax', icon: AltosaxIcon }
  ],
  [
    { name: '?????????', fileName: 'ff-timpani', icon: TimpaniIcon },
    { name: '?????????', fileName: 'ff-bongo', icon: BongoIcon },
    { name: '?????????', fileName: 'ff-bd', icon: BdIcon },
    { name: '?????????', fileName: 'ff-snare', icon: SnareIcon },
    { name: '???', fileName: 'ff-cymbal', icon: CymbalIcon }
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

/** ???????????? */
const InstrumentMenu = ({
  instrumentMenuOpen,
  toggleInstrumentMenu
}: InstrumentMenuProps) => {
  const instrumentConfig = useSelector(selectInstrumentConfig)

  const [icon, setIcon] = useState(HarpIcon)

  // ?????????????????????icon
  useEffect(() => {
    setIcon(getIconByName(instrumentConfig.name))
  }, [instrumentConfig.name])

  const handleClose = () => {
    toggleInstrumentMenu(false)
  }

  const handleOpen = () => {
    toggleInstrumentMenu(true)
  }

  // ????????????????????????????????????
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
        alt="??????"
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

  /** ?????????????????? */
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
            ??????
          </Divider>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={Boolean(+defaultIsMock)}
                onChange={handleToggleMock}
              />
            }
            label="??????FF14??????????????? - ?????????"
          />
          <TextSoundInput />
        </Box> */}

      <MetroSetting />
      {/*  */}
      <Divider sx={{ mb: 2 }} light>
        ??????
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
      ????????????
      <TextField
        inputRef={delayRef}
        sx={{ width: 100, mr: 1 }}
        type="number"
        label="????????????/??????"
        defaultValue="300"
        size="small"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <TextField
        inputRef={intervalRef}
        sx={{ width: 100, mr: 1 }}
        type="number"
        label="????????????/??????"
        defaultValue="500"
        size="small"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Button variant="contained" onClick={handleSetVal}>
        ??????
      </Button>
    </Box>
  )
}
 */

export default InstrumentMenu
