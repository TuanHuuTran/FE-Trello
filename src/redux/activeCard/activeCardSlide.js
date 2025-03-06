import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo giá trị State của một slice trong redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

// Các hành động gọi API ( bất đồng bộ ) và cập nhật dữ liệu vào Redux, dùng middleware createAsyncThunk đi kèm với extraReducers
// Khởi tạo một slice trong kho lưu trữ Redux.


export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  //Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {

    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },
    clearAndHideCurrentActiveCard: (state) => {
      // update lại cái dữ liệu của currentActiveCard
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload
      state.currentActiveCard = fullCard
    }
  },

  extraReducers: (build) => {}

})


// Action: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu
// thông qua reducer ( chạy đồng bộ)
// Để ý ở trên không thấy properties actions đâu cả bởi vì những actions này đơn giản là được thằng redux
// tạo tự động theo tên của reducer
export const { showModalActiveCard, clearAndHideCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}
// export default activeCardSlice.reducer

export const activeCardReducer = activeCardSlice.reducer
