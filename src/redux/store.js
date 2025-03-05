import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReduce } from '~/redux/user/userSlice'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // default la local storage
import { activeCardReducer } from './activeCard/activeCardSlide'

// Config persist
const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user'] // định nghĩa các slice ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
  // blacklist: ['user'] // định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
}

// Combine các reduces trong dự án của chúng ta ở đây
const reduces = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReduce,
  activeCard: activeCardReducer
})

// Thực hiện persist reducer
const persistedReducer = persistReducer(rootPersistConfig, reduces)

export const store = configureStore({
  reducer: persistedReducer,
  // Fix warning error when implement redux-persist
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
