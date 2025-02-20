import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { DndContext, useSensor, useSensors, PointerSensor, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

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

  useEffect( () => {
    setOrderedColumns( mapOrder( board?.columns, board?.columnOrderIds, '_id' ) )
  }, [ board ] )


  const handleDragEnd = ( event ) => {
    const { active, over } = event
    console.log( "haha", event )
    //kiểm tra nếu kéo thả ra ngoài khác với vị trí ban đầu
    if ( !over ) return

    if ( active.id !== over.id ) {
      //lấy vị trí cũ (từ thằng active)
      const oldIndex = orderedColumns.findIndex( ( c ) => c._id === active.id )
      //lấy vị trí mới (từ thằng over)
      const newIndex = orderedColumns.findIndex( ( c ) => c._id === over.id )

      //Dùng arrayMove của dnd-kit để sắp xếp lại các mảng Columns ban đầu
      // Code https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove( orderedColumns, oldIndex, newIndex )

      //cập nhật lại status
      setOrderedColumns( dndOrderedColumns )
      // const dndOrderedColumnsIds = dndOrderedColumns.map( ( c ) => c._id )
      // console.log( "dndOrder", dndOrderedColumns )
      // console.log( "dndOrderedColumnsIds", dndOrderedColumnsIds )
    }
  }
  return (
    <DndContext onDragEnd={ handleDragEnd } sensors={ sensors }>
      <Box sx={ {
        bgcolor: ( theme ) => ( theme.palette.mode === 'dark' ? '#34495e' : '#1976d2' ),
        width: '100%',
        height: ( theme ) => theme.trelloCustom.boardContentHeight,
        p: '10px 0'
      } }>
        <ListColumns columns={ orderedColumns } />
      </Box>
    </DndContext>
  )
}

export default BoardContent
