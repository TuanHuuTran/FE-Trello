import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent( { board } ) {

  // const pointerSensor = useSensor( PointerSensor, { activationConstraint: { distance: 10 } } )

  // Yêu cầu chuột di chuyển 10px thì mới kisck hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor( MouseSensor, { activationConstraint: { distance: 10 } } )

  // Nhấn giữ 250ms và dung sai ( di chuyển/ chênh lệch 5px) thì mới kích hoạt event
  const touchSensor = useSensor( TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } } )

  // const sensors = useSensors( pointerSensor )

  // Ưu tiên sử dụng cả 2 loại sensors là mouse và touch để có trải nhiệm tốt nhất, không bị bug
  const sensors = useSensors( mouseSensor, touchSensor )

  const [ orderedColumns, setOrderedColumns ] = useState( [] )

  // Cùng 1 thời điểm chỉ có một phần tử đang được kéo ( column hoặc card  )
  const [ activeDragItemId, setActiveDragItemId ] = useState( null )
  const [ activeDragItemType, setActiveDragItemType ] = useState( null )
  const [ activeDragItemData, setActiveDragItemData ] = useState( null )

  // Lưu trữ giữ liệu gốc
  const [ oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard ] = useState( null )



  useEffect( () => {
    setOrderedColumns( mapOrder( board?.columns, board?.columnOrderIds, '_id' ) )
  }, [ board ] )

  // Tìm một cái Column theo CardId
  const findColumnByCardId = ( cardId ) => {
    return orderedColumns.find( column => column?.cards?.map( card => card._id )?.includes( cardId ) )
  }

  //Trigger khi bắt đầu drag một phần tử
  const handleDragStart = ( event ) => {
    console.log( 'handleDragStart', event )
    setActiveDragItemId( event?.active?.id )
    setActiveDragItemType( event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN )
    setActiveDragItemData( event?.active?.data?.current )

    // Nếu hành động kéo card thì mới thực hiện hành động set giá trị oldColumn
    if ( event?.active?.data?.current?.columnId ) {
      setOldColumnWhenDraggingCard( findColumnByCardId( event?.active?.id ) )
    }
  }

  //Quá trình kéo (drag) của một phần tử
  const handleDragOver = ( event ) => {
    // Kéo column thì return
    if ( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) return

    //Kéo card thì xử lý thêm
    const { active, over } = event
    if ( !active || !over ) return

    //activeDraggingCardId: là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active

    // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
    const { id: overCardId } = over

    // Tìm 2 cái column của active và over
    const activeColumn = findColumnByCardId( activeDraggingCardId )
    const overColumn = findColumnByCardId( overCardId )

    // Nếu không tồn tại 1 trong 2 column active hoặc over thì k làm gì hết
    if ( !activeColumn || !overColumn ) return

    // Nếu column active khác với column over thì code.
    if ( activeColumn._id !== overColumn._id ) {
      setOrderedColumns( prevColumn => {
        //Tìm vị trí (index) của cái overCard trong column đích (nơi card sắp được thả (over))
        const overCardIndex = overColumn?.cards?.findIndex( card => card._id === overCardId )

        //Logic tính toán cardIndex mới của column over
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return  - cập nhật lại OrderedColumnsState mới
        const nextColumn = cloneDeep( prevColumn )
        const nextActiveColumn = nextColumn.find( column => column._id === activeColumn._id )
        const nextOverColumn = nextColumn.find( column => column._id === overColumn._id )
        if ( nextActiveColumn ) {
          // Xóa card ở active column
          nextActiveColumn.cards = nextActiveColumn.cards.filter( card => card._id !== activeDraggingCardId )

          // Cập nhật lại mảng cardOrderIds cho đúng giữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map( card => card._id )
        }

        if ( nextOverColumn ) {
          // kiểm tra xem card đang kéo nó có tồn tại trong overColumn chưa, nếu có thì xóa trước khi thêm
          nextOverColumn.cards = nextOverColumn.cards.filter( card => card._id !== activeDraggingCardId )

          // Thêm cái card đang kéo vào overColumn theo vị trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced( newCardIndex, 0, activeDraggingCardData )

          // Cập nhật lại mảng cardOrderIds cho đúng giữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map( card => card._id )
        }

        return nextColumn
      } )
    }
  }

  // Trigger khi kết thúc hành động kéo (drag) một phần tử
  const handleDragEnd = ( event ) => {
    const { active, over } = event
    //kiểm tra nếu kéo thả ra ngoài khác với vị trí ban đầu
    if ( !over || !active ) return


    // Xử lý kéo thả cards
    if ( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD ) {
      //activeDraggingCardId: là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active

      // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
      const { id: overCardId } = over

      // Tìm 2 cái column của active và over
      const activeColumn = findColumnByCardId( activeDraggingCardId )
      const overColumn = findColumnByCardId( overCardId )

      // Nếu không tồn tại 1 trong 2 column active hoặc over thì k làm gì hết
      if ( !activeColumn || !overColumn ) return

      //Hành động kéo thả card giữa 2 column khác nhau
      //Phải dùng tới activeDragItemData.columnId hoặc oldColumn ( set vào state  từ bước handleDragStart ) chứ không phải activeData trong
      // scope handleDragEnd này vì sau khi đi qua DragOver state đã được cập nhật.
      if ( oldColumnWhenDraggingCard._id !== overColumn._id ) {
        //Hành động kéo thả card giữa 2 column
      } else {
        //Hành động kéo thả card trong cùng 1 column

        //lấy vị trí cũ (từ thằng oldColumn)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex( ( c ) => c._id === activeDragItemId )
        //lấy vị trí mới (từ thằng over)
        const newCardIndex = overColumn?.cards?.findIndex( ( c ) => c._id === overCardId )

        //Dùng arrayMove gì kéo card trong column giống kéo column trong board
        const dndOrderedCards = arrayMove( oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex )

        setOrderedColumns( prevColumn => {
          const nextColumn = cloneDeep( prevColumn )

          // Tìm tới cái column mà chúng ta thả
          const targetColumn = nextColumn.find( column => column._id === overColumn._id )

          // Cập nhật lại giá trị cho card và cardOrderIds trong các targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map( card => card._id )

          //Trả về giá trị state mới chuẩn vị trí
          return nextColumn
        } )
      }
    }

    // Xử lý kéo thả columns
    if ( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) {
      if ( active.id !== over.id ) {
        //lấy vị trí cũ (từ thằng active)
        const oldColumnIndex = orderedColumns.findIndex( ( c ) => c._id === active.id )
        //lấy vị trí mới (từ thằng over)
        const newColumnIndex = orderedColumns.findIndex( ( c ) => c._id === over.id )
        //Dùng arrayMove của dnd-kit để sắp xếp lại các mảng Columns ban đầu
        // Code https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove( orderedColumns, oldColumnIndex, newColumnIndex )
        //cập nhật lại status
        setOrderedColumns( dndOrderedColumns )
        // const dndOrderedColumnsIds = dndOrderedColumns.map( ( c ) => c._id )
        // console.log( "dndOrder", dndOrderedColumns )
        // console.log( "dndOrderedColumnsIds", dndOrderedColumnsIds )
      }
    }

    //Những giữ liệu sau khi kéo thả phải luôn đưa về giá trị null mặc định ban đầu
    setActiveDragItemId( null )
    setActiveDragItemType( null )
    setActiveDragItemData( null )
    setOldColumnWhenDraggingCard( null )
  }
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects( { styles: { active: { opacity: '0.5' } } } )
  }
  return (
    <DndContext
      sensors={ sensors }
      // Thuật toán phát hiện va chạm
      collisionDetection={ closestCorners }
      onDragStart={ handleDragStart }
      onDragOver={ handleDragOver }
      onDragEnd={ handleDragEnd }
    >
      <Box sx={ {
        bgcolor: ( theme ) => ( theme.palette.mode === 'dark' ? '#34495e' : '#1976d2' ),
        width: '100%',
        height: ( theme ) => theme.trelloCustom.boardContentHeight,
        p: '10px 0'
      } }>
        <ListColumns columns={ orderedColumns } />
        <DragOverlay dropAnimation={ dropAnimation }>
          { !activeDragItemType && null }
          { ( activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) && <Column column={ activeDragItemData } /> }
          { ( activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD ) && <Card card={ activeDragItemData } /> }

        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
