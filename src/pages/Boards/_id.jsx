import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import {
  updateBoardDetailAPI,
  updateColumnDetailAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import {
  fetchBoardDetailAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'


function Board() {
  const dispatch = useDispatch()
  // Không dùng state của components nữa mà dùng của Redux
  // const [ board, setBoard ] = useState( null )
  const board = useSelector( selectCurrentActiveBoard )

  useEffect( () => {
    const boardId = '67bad895f32682458041b898'
    // Call API
    dispatch( fetchBoardDetailAPI( boardId ) )
  }, [ dispatch ] )

  const moveColumn = ( dndOrderedColumns ) => {
    // Update chuan du lieu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map( ( c ) => c._id )
    /**
     *Trường hợp dùng Spread Operator này thì lại không sao bởi vì đây chúng ta không dùng push như ở trên
     làm thay đổi trực tiếp giá trị của mảng, mà chỉ gán lại giá trị bẳng mảng mới.
     */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch( updateCurrentActiveBoard( newBoard ) )
    // Call API
    updateBoardDetailAPI( newBoard._id, { columnOrderIds: dndOrderedColumnsIds } )
  }

  // Khi di chuyển card trong cùng 1 column chỉ cần gọi API
  // để cập nhật mảng cardOrderIds của column đó
  const moveCardInTheSameColumn = ( dndOrderedCards, dndOrderedCardIds, columnId ) => {
    // Update chuẩn dữ liệu board
    const newBoard = cloneDeep( board )
    const columnToUpdate = newBoard.columns.find( column => column._id === columnId )
    if ( columnToUpdate ) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch( updateCurrentActiveBoard( newBoard ) )
    // Gọi API
    updateColumnDetailAPI( columnId, { cardOrderIds: dndOrderedCardIds } )
  }

  /**
   * B1: Cập nhật bảng cardOrderIds của column chứa nó ( xóa khỏi column )
   * B2: Cập nhật bảng cardOrderIds của column tiếp theo ( thêm mới vào column )
   * B3: Cập nhật lại trường columnId mới
   * => Tạo API riêng
   */
  const moveCardToDifferentColumn = ( currentCardId, prevColumnId, nextColumnId, dndOrderedColumns ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map( ( c ) => c._id )

    // Tương tự đoạn sử lý moveColumn
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch( updateCurrentActiveBoard( newBoard ) )
    // Goi API
    let prevCardOrderIds = dndOrderedColumns.find( c => c._id === prevColumnId ).cardOrderIds
    if ( prevCardOrderIds[ 0 ].includes( 'placeholder-card' ) ) prevCardOrderIds = []
    moveCardToDifferentColumnAPI( {
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find( c => c._id === nextColumnId ).cardOrderIds
    } )
  }

  if ( !board ) {
    return (
      <Box sx={ {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        width: '100vw',
        height: '100vh'
      } }>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={ false } sx={ { height: '100vh' } }>
      < AppBar />
      <BoardBar board={ board } />
      <BoardContent
        board={ board }

        moveColumn={ moveColumn }
        moveCardInTheSameColumn={ moveCardInTheSameColumn }
        moveCardToDifferentColumn={ moveCardToDifferentColumn }

      />
    </Container>
  )
}

export default Board
