import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import { mapOrder } from '~/utils/sort'
import {
  createColumnAPI,
  fetchBoardDetailAPI,
  createCardAPI,
  updateBoardDetailAPI,
  updateColumnDetailAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailAPI
} from '~/apis'
import { toast } from 'react-toastify'
import { generatePlaceholderCard } from '~/utils/formaters'
import { isEmpty } from 'lodash'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


function Board() {
  const [ board, setBoard ] = useState( null )

  useEffect( () => {
    const boardId = '67bad895f32682458041b898'
    fetchBoardDetailAPI( boardId ).then( board => {
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
      setBoard( board )
    } )
  }, [] )

  const createColumn = async ( newColumn ) => {
    const column = await createColumnAPI( {
      ...newColumn,
      boardId: board._id
    } )
    if ( column ) {
      const newBoard = { ...board }
      newBoard.columns.push( column )
      newBoard.columnOrderIds.push( column._id )
      setBoard( newBoard )
      toast.success( ' Created Column Success!' )
    }
  }

  const createCard = async ( newCard ) => {
    const card = await createCardAPI( {
      ...newCard,
      boardId: board._id
    } )

    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find( column => card.columnId === column._id )
    if ( columnToUpdate ) {
      if ( columnToUpdate.cards.some( card => card.FE_PlaceholderCard ) ) {
        columnToUpdate.cards = [ card ]
        columnToUpdate.cardOrderIds = [ card._id ]
      } else {
        columnToUpdate.cards.push( card )
        columnToUpdate.cardOrderIds.push( card._id )
      }
      setBoard( newBoard )
      toast.success( ' Created Card Success!' )
    }
  }

  const moveColumn = ( dndOrderedColumns ) => {
    // Update chuan du lieu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map( ( c ) => c._id )
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard( newBoard )
    // Call API
    updateBoardDetailAPI( newBoard._id, { columnOrderIds: dndOrderedColumnsIds } )
  }

  // Khi di chuyển card trong cùng 1 column chỉ cần gọi API
  // để cập nhật mảng cardOrderIds của column đó
  const moveCardInTheSameColumn = ( dndOrderedCards, dndOrderedCardIds, columnId ) => {
    // Update chuẩn dữ liệu board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find( column => column._id === columnId )
    if ( columnToUpdate ) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard( newBoard )
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
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard( newBoard )

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

  const deleteColumn = ( columnId ) => {
    // Update chuan du lieu state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter( c => c._id !== columnId )
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter( _id => _id !== columnId )
    setBoard( newBoard )

    // Call API
    deleteColumnDetailAPI( columnId ).then( res => {
      toast.success( res?.deleteResult )
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
  // Call APIs
  // useEffect( () => {
  //   listBoard()
  // }, [] )

  // const listBoard = () => {
  //   const boardId = '67bad895f32682458041b898'
  //   fetchBoardDetailAPI( boardId ).then( board => {
  //     board.columns.find( column => {
  //       if ( isEmpty( column.cards ) )
  //         column.cards = [ generatePlaceholderCard( column ) ]
  //       column.cardOrderIds = [ generatePlaceholderCard( column )._id ]
  //     } )
  //     setBoard( board )
  //   } )
  // }

  // const createColumn = async ( newColumn ) => {
  //   const column = await createColumnAPI( {
  //     ...newColumn,
  //     boardId: board._id
  //   } )
  //   if ( column ) {
  //     toast.success( ' Created Column Success!' )
  //     listBoard()
  //   }
  // }

  // const createCard = async ( newCard ) => {
  //   const card = await createCardAPI( {
  //     ...newCard,
  //     boardId: board._id
  //   } )
  //   if ( card ) {
  //     toast.success( ' Created Card Success!' )
  //     listBoard()
  //   }
  // }

  return (
    <Container disableGutters maxWidth={ false } sx={ { height: '100vh' } }>
      < AppBar />
      <BoardBar board={ board } />
      <BoardContent
        board={ board }
        createColumn={ createColumn }
        createCard={ createCard }
        moveColumn={ moveColumn }
        moveCardInTheSameColumn={ moveCardInTheSameColumn }
        moveCardToDifferentColumn={ moveCardToDifferentColumn }
        deleteColumn={ deleteColumn }
      />
    </Container>
  )
}

export default Board
