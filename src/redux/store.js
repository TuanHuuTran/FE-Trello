import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReduce } from '~/redux/user/userSlice'
export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer,
    user: userReduce
  }
})
