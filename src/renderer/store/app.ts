import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './index'
import { CURRENT_BG_INDEX } from '../utils'

/** 应用本地状态，不保存 */
export const appSlice = createSlice({
  name: 'app',
  initialState: {
    // 当前的曲谱id
    currentScoreId: '',
    // 是否展开详情
    isDetailOpen: false,
    // 是否是编辑模式
    isEditMode: false,
    // 是否展开query-msenu
    isQueryMenuOpen: false,
    // 当前背景index
    currentBgIndex: +(window.localStorage.getItem(CURRENT_BG_INDEX) || '0')
  },
  reducers: {
    setCurrentScoreId: (state, { payload }) => {
      state.currentScoreId = payload as string
    },
    setIsDetailOpen: (state, { payload }) => {
      state.isDetailOpen = payload as boolean
    },
    setIsEditMode: (state, { payload }) => {
      state.isEditMode = payload as boolean
    },
    setIsQueryMenuOpen: (state, { payload }) => {
      state.isQueryMenuOpen = payload as boolean
    },
    setCurrentBgIndex: (state, { payload }) => {
      state.currentBgIndex = payload as number
      window.localStorage.setItem(CURRENT_BG_INDEX, payload + '')
    }
  }
})

export const {
  setCurrentScoreId,
  setIsDetailOpen,
  setIsEditMode,
  setIsQueryMenuOpen,
  setCurrentBgIndex
} = appSlice.actions

export const selectCurrentScoreId = (state: RootState) =>
  state.app.currentScoreId
export const selectIsDetailOpen = (state: RootState) => state.app.isDetailOpen
export const selectIsEditMode = (state: RootState) => state.app.isEditMode
export const selectIsQueryMenuOpen = (state: RootState) =>
  state.app.isQueryMenuOpen
export const selectCurrentBgIndex = (state: RootState) =>
  state.app.currentBgIndex

export default appSlice.reducer
