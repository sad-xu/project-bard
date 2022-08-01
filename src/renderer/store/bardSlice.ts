import { createSlice } from '@reduxjs/toolkit'
import { INSTRUMENT_LIST } from '../page-bard/instrument-menu'
import metronomeSound from '../page-bard/metronome/metronomeSound'
import Sound from '../utils/Sound'
import { RootState } from './index'
import {
  DURATION,
  INSTRUMENT,
  IS_MOCK,
  KEY_CONFIG_KEY,
  METRO_BEAT,
  METRO_BPM,
  METRO_IS_DING,
  METRO_VLOUME,
  VOLUME
} from '../utils'

/** 组合键 八度 半音 */
export interface CompositeConfig {
  higher: string
  lower: string
  highSemitone: string
  lowSemitone: string
}
/** 按键设置 */
export interface KeyConfig extends CompositeConfig {
  isFullScale: boolean
  common: { [key: string]: number }
}
/** 乐器设置 */
export interface InstrumentConfig {
  name: string
  volume: number
  duration: number
  isMock: string // '0' | '1'
}

/** 节拍器设置 */
export interface MetroConfig {
  bpm: number
  beat: number
  volume: number
  isDing: string
}

// 乐器名 兜底
const INSTRUMENT_MAP: { [k: string]: string } = {}
INSTRUMENT_LIST.forEach((arr) => {
  arr.forEach((item) => {
    INSTRUMENT_MAP[item.fileName] = item.fileName
  })
})

const localInstrument = localStorage.getItem(INSTRUMENT)
if (localInstrument && !INSTRUMENT_MAP[localInstrument]) {
  // 不存在的乐器
  window.localStorage.setItem(INSTRUMENT, 'ff-grandpiano')
}

// 本地配置 初始值
const localKeyConfig = localStorage.getItem(KEY_CONFIG_KEY)
const defaultInstrumentConfig = {
  name:
    INSTRUMENT_MAP[localStorage.getItem(INSTRUMENT) || ''] || 'ff-grandpiano',
  volume: Number(localStorage.getItem(VOLUME)) || 0.5,
  duration: Number(localStorage.getItem(DURATION)) || 0.5,
  isMock: localStorage.getItem(IS_MOCK) || '0'
}

const defaultMetroConfig = {
  bpm: Number(localStorage.getItem(METRO_BPM)) || 60,
  beat: Number(localStorage.getItem(METRO_BEAT)) || 4,
  volume: Number(localStorage.getItem(METRO_VLOUME)) || 0.5,
  isDing: localStorage.getItem(METRO_IS_DING) || '1'
}

Sound.setAllZone(defaultInstrumentConfig.name)
Sound.setAllDuration(defaultInstrumentConfig.duration)
Sound.setAllVolume(defaultInstrumentConfig.volume)
Sound.setIsMock(defaultInstrumentConfig.isMock)

metronomeSound.setVolume(defaultMetroConfig.volume)

const initialState: {
  canPlay: boolean
  instrumentConfig: InstrumentConfig
  metroConfig: MetroConfig
  keyConfig: KeyConfig
} = {
  // 是否可以演奏
  canPlay: true,
  instrumentConfig: defaultInstrumentConfig,
  metroConfig: defaultMetroConfig,
  keyConfig: localKeyConfig
    ? JSON.parse(localKeyConfig)
    : {
        isFullScale: true,
        higher: 'Shift',
        lower: 'Alt',
        highSemitone: '',
        lowSemitone: '',
        common: {
          Backslash: 82,
          BracketLeft: 78,
          BracketRight: 80,
          Digit0: 70,
          Digit1: 49,
          Digit2: 51,
          Digit3: 54,
          Digit4: 56,
          Digit5: 58,
          Digit6: 61,
          Digit7: 63,
          Digit8: 66,
          Digit9: 68,
          KeyA: 60,
          KeyB: 55,
          KeyC: 52,
          KeyD: 64,
          KeyE: 76,
          KeyF: 65,
          KeyG: 67,
          KeyH: 69,
          KeyI: 84,
          KeyJ: 71,
          KeyM: 59,
          KeyN: 57,
          KeyO: 73,
          KeyP: 75,
          KeyQ: 72,
          KeyR: 77,
          KeyS: 62,
          KeyT: 79,
          KeyU: 83,
          KeyV: 53,
          KeyW: 74,
          KeyX: 50,
          KeyY: 81,
          KeyZ: 48
        }
      }
}

export const keyboardSlice = createSlice({
  name: 'bard',
  initialState,
  reducers: {
    setInstrumentName: (state, { payload }: { payload: string }) => {
      state.instrumentConfig.name = payload
      Sound.setAllZone(payload)
      window.localStorage.setItem(INSTRUMENT, payload)
    },
    setInstrumentDuration: (state, { payload }: { payload: number }) => {
      state.instrumentConfig.duration = payload
      Sound.setAllDuration(payload)
      window.localStorage.setItem(DURATION, payload + '')
    },
    setInstrumentVolume: (state, { payload }: { payload: number }) => {
      state.instrumentConfig.volume = payload
      Sound.setAllVolume(payload)
      window.localStorage.setItem(VOLUME, payload + '')
    },
    setInstrumentIsMock: (state, { payload }: { payload: string }) => {
      state.instrumentConfig.isMock = payload
      Sound.setIsMock(payload)
      window.localStorage.setItem(IS_MOCK, payload)
    },
    // 节拍器
    setMetroVolume: (state, { payload }: { payload: number }) => {
      localStorage.setItem(METRO_VLOUME, payload + '')
      state.metroConfig.volume = payload
      metronomeSound.setVolume(payload)
    },
    setMetroBpm: (state, { payload }: { payload: number }) => {
      localStorage.setItem(METRO_BPM, payload + '')
      state.metroConfig.bpm = payload
    },
    setMetroBeat: (state, { payload }: { payload: number }) => {
      localStorage.setItem(METRO_BEAT, payload + '')
      state.metroConfig.beat = payload
    },
    setMetroIsDing: (state, { payload }: { payload: string }) => {
      localStorage.setItem(METRO_IS_DING, payload)
      state.metroConfig.isDing = payload
    },
    //
    setKeyConfig: (state, { payload }: { payload: KeyConfig }) => {
      localStorage.setItem(KEY_CONFIG_KEY, JSON.stringify(payload))
      state.keyConfig = payload
    },
    toggleCanPlay: (state, { payload }) => {
      state.canPlay = payload as boolean
    }
  }
})

export const {
  setInstrumentName,
  setInstrumentDuration,
  setInstrumentVolume,
  setInstrumentIsMock,
  setMetroVolume,
  setMetroBpm,
  setMetroBeat,
  setMetroIsDing,
  setKeyConfig,
  toggleCanPlay
} = keyboardSlice.actions

export const selectCanPlay = (state: RootState) => state.bard.canPlay
export const selectInstrumentConfig = (state: RootState) =>
  state.bard.instrumentConfig
export const selectMetroConfig = (state: RootState) => state.bard.metroConfig
export const selectKeyConfig = (state: RootState) => state.bard.keyConfig

export default keyboardSlice.reducer
