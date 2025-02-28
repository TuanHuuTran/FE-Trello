import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return response.data
  }
)
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// export const {} = userSlice.actions

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReduce = userSlice.reducer
