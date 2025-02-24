import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect, useState } from 'react'


import { createColumnAPI, fetchBoardDetailAPI, createCardAPI } from '~/apis'
import { toast } from 'react-toastify'
import { generatePlaceholderCard } from '~/utils/formaters'
import { isEmpty } from 'lodash'
function Board() {
  const [ board, setBoard ] = useState( null )

  useEffect( () => {
    const boardId = '67bad895f32682458041b898'
    fetchBoardDetailAPI( boardId ).then( board => {
      board.columns.find( column => {
        if ( isEmpty( column.cards ) )
          column.cards = [ generatePlaceholderCard( column ) ]
        column.cardOrderIds = [ generatePlaceholderCard( column )._id ]
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
    if ( card ) {
      const newBoard = { ...board }
      const columnToUpdate = newBoard.columns.find( column => card.columnId === column._id )
      if ( columnToUpdate ) {
        columnToUpdate.cards.push( card )
        columnToUpdate.cardOrderIds.push( card._id )
      }
      setBoard( newBoard )
      toast.success( ' Created Card Success!' )
    }
  }// Call APIs
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
      />
    </Container>
  )
}

export default Board
