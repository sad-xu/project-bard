import { configureStore } from '@reduxjs/toolkit'
import appSlice from './app'
import bardSlice from './bardSlice'
import userSlice from './userSlice'

const store = configureStore({
  reducer: {
    app: appSlice,
    user: userSlice,
    bard: bardSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export default store
