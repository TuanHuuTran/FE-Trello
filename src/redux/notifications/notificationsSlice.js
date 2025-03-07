import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo giá trị State của một slice trong redux
const initialState = {
  currentNotifications: null
}

export const fetchInvitationAPI = createAsyncThunk(
  'notifications/fetchInvitationAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${ invitationId}`, { status })
    return response.data
  }
)

// Các hành động gọi API ( bất đồng bộ ) và cập nhật dữ liệu vào Redux, dùng middleware createAsyncThunk đi kèm với extraReducers
// Khởi tạo một slice trong kho lưu trữ Redux.


export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  //Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },

    addNotifications: (state, action) => {
      const inComingInvitation = action.payload
      // unshift  la them thanh phan vao dau mang, nguoc lai voi push
      state.currentNotifications.unshift(inComingInvitation)
    }
  },
  extraReducers: (build) => {
    build.addCase(fetchInvitationAPI.fulfilled, (state, action) => {
      let inComingInvitations = action.payload
      // Doan nay dao nguoc mang invitations nhan duoc, hien thi cai moi nhat len dau
      state.currentNotifications = Array.isArray(inComingInvitations) ? inComingInvitations.reverse() : []
    })
    build.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const inComingInvitations = action.payload
      // Cap nhat lai giu lieu BoardInvitation (ben trong no se co status moi sau khi update)
      const getInvitation = state.currentNotifications.find(i => i._id === inComingInvitations._id)
      getInvitation.boardInvitation = inComingInvitations.boardInvitation
    })
  }

})


// Action: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu
// thông qua reducer ( chạy đồng bộ)
// Để ý ở trên không thấy properties actions đâu cả bởi vì những actions này đơn giản là được thằng redux
// tạo tự động theo tên của reducer
export const { clearCurrentNotifications, updateCurrentNotifications, addNotifications } = notificationsSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}


// export default activeCardSlice.reducer

export const notificationsReduce = notificationsSlice.reducer
