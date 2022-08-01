import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './index'
import { NAME_KEY, TOKEN_KEY, AVATAR_KEY, USER_ID_KEY } from '../utils'

export interface MIDIItem {
  _id: string
  name: string
}

const initialState: {
  _id: string
  name: string
  avatar: string
  token: string
  collection: MIDIItem[]
  creation: MIDIItem[]
} = {
  _id: localStorage.getItem(USER_ID_KEY) || '',
  name: localStorage.getItem(NAME_KEY) || '',
  avatar: localStorage.getItem(AVATAR_KEY) || '',
  token: localStorage.getItem(TOKEN_KEY) || '',
  // 已收藏列表
  collection: [],
  // 已创建列表
  creation: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /** 扫码登陆 | 使用token获取账号信息 */
    setUserInfo: (state, { payload }) => {
      const { _id, name, avatar, token, collection, creation } = payload
      if (token) {
        // axiosInstance.defaults.headers[TOKEN_KEY] = token
        localStorage.setItem(TOKEN_KEY, token)
      }
      localStorage.setItem(USER_ID_KEY, _id)
      localStorage.setItem(NAME_KEY, name)
      localStorage.setItem(AVATAR_KEY, avatar)
      return {
        _id,
        name,
        avatar,
        token: token || state.token,
        collection,
        creation
      }
    },
    /** 退出账号，清除用户数据 */
    clearUserInfo: () => {
      localStorage.removeItem(USER_ID_KEY)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(NAME_KEY)
      localStorage.removeItem(AVATAR_KEY)
      return {
        _id: '',
        name: '',
        avatar: '',
        token: '',
        collection: [],
        creation: []
      }
    },
    /** 修改名字 */
    setNewName: (state, { payload }: { payload: string }) => {
      state.name = payload
    },
    /** 新增已发布 */
    addCreation: (state, { payload }: { payload: MIDIItem }) => {
      const { name, _id } = payload
      state.creation.push({
        _id: _id,
        name: name as string
      })
    },
    /** 删除已发布 */
    removeCreation: (state, { payload }: { payload: string }) => {
      const i = state.creation.findIndex((item) => item._id === payload)
      if (i >= 0) {
        state.creation.splice(i, 1)
      }
    },
    /** 新增已收藏 */
    addCollection: (state, { payload }: { payload: MIDIItem }) => {
      const { name, _id } = payload
      state.collection.push({
        _id: _id,
        name: name as string
      })
    },
    /** 删除已收藏 */
    removeCollection: (state, { payload }: { payload: string }) => {
      const i = state.collection.findIndex((item) => item._id === payload)
      if (i >= 0) {
        state.collection.splice(i, 1)
      }
    }
  }
})

export const {
  clearUserInfo,
  setUserInfo,
  setNewName,
  addCreation,
  removeCreation,
  addCollection,
  removeCollection
} = userSlice.actions

// thunk 处理异步
// export const asyncIncrement = (payload) => dispatch => {
//   setTimeout(() => {
//    dispatch(increment(payload))
//   }, 2000)
// }

// 外部取值
export const selectUserInfo = (state: RootState) => state.user

export default userSlice.reducer
