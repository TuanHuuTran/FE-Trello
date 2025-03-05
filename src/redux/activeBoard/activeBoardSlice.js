import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sort'
// Khởi tạo giá trị State của một slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi API ( bất đồng bộ ) và cập nhật dữ liệu vào Redux, dùng middleware createAsyncThunk đi kèm với extraReducers
// Khởi tạo một slice trong kho lưu trữ Redux.

export const fetchBoardDetailAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  //Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const board = action.payload
      // Xử lý dữ liệu nếu cần thiết...
      // update lại cái dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    },
    updateCardInboard: (state, action) => {
      // Update nested data: https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const inComingCard = action.payload
      // Find board to column to card
      const column = state.currentActiveBoard.columns.find(i => i._id === inComingCard.columnId )
      if (column) {
        const card = column.cards.find(i => i._id === inComingCard._id)
        if ( card ) {
          // card.title = inComingCard.title
          // card['title'] = inComingCard['title']

          /**
           * Object.keys để lấy toàn bộ properties (keys) của inComingCard về một array rồi forEach nó ra.
           * Sau đó tùy vào trường hợp cần thì kiểm tra thêm còn không thì cập nhật ngược lại giá trị card luôn như bên dưới.
           */
          Object.keys(inComingCard).forEach(key => {
            card[key] = inComingCard[key]
          })
        }
      }
    }
  },

  // ExtraReducers: nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là res.data trả về ở trên
      let board = action.payload

      //  Thành viên trong cái board sẽ là gộp lại của 2 mảng owners và members
      board.FE_allUsers = board.owners.concat(board.members)

      // Xử lý dữ liệu nếu cần thiết...
      board.columns = mapOrder( board.columns, board.columnOrderIds, '_id' )
      board.columns.find( column => {
        // Khi  F5 trang web thì cần xử lý vấn đề kẻo thả một column rỗng
        if ( isEmpty( column.cards ) ) {
          column.cards = [ generatePlaceholderCard( column ) ]
          column.cardOrderIds = [ generatePlaceholderCard( column )._id ]
        } else {
          // Xắp xếp cards luôn ở đây
          column.cards = mapOrder( column.cards, column.cardOrderIds, '_id' )
        }
      } )

      // update lại cái dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})


// Action: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu
// thông qua reducer ( chạy đồng bộ)
// Để ý ở trên không thấy properties actions đâu cả bởi vì những actions này đơn giản là được thằng redux
// tạo tự động theo tên của reducer
export const { updateCurrentActiveBoard, updateCardInboard } = activeBoardSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer

export const activeBoardReducer = activeBoardSlice.reducer
