import { useState } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'


import { mapOrder } from '~/utils/sort'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


function Column( { column } ) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable( {
    id: column._id,
    data: { ...column }
  } )

  const dndKitColumnStyle = {
    // touchAction: 'none', // Dành cho PointerSensor default
    transform: CSS.Translate.toString( transform ),
    transition,
    //Chiều cao phải luôn 100% vì nếu không lúc kéo column ngắn sang column dài thì phải kéo ở giữa mới được
    // lưu ý phải để { ...listeners } ở box chứ k phải div
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const orderCards = mapOrder( column?.cards, column?.cardOrderIds, '_id' )

  const [ openNewCardForm, setOpenNewCardForm ] = useState( false )
  const toggleOpenNewCardForm = () => setOpenNewCardForm( !openNewCardForm )
  const [ newCardTitle, setNewCardTitle ] = useState( '' )

  const addNewCard = () => {
    if ( !newCardTitle ) {
      console.error( 'please Card title' )
    }
    console.log( newCardTitle )

    // Gọi APIs
    //Đóng trạng thái thêm Card mới & clear input
    toggleOpenNewCardForm()
    setNewCardTitle( '' )
  }

  const [ anchorEl, setAnchorEl ] = useState( null )
  const open = Boolean( anchorEl )
  const handleClick = ( event ) => { setAnchorEl( event.currentTarget ) }
  const handleClose = () => { setAnchorEl( null ) }

  return (
    // Phải bọc div vì vấn đề chiều cao của column khi kéo sẽ có kiểu flickering 
    <div ref={ setNodeRef } style={ dndKitColumnStyle } { ...attributes }>
      < Box
        { ...listeners }
        sx={ {
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: ( theme ) => ( theme.palette.mode === 'dark' ? '#333643' : '#ebecf0' ),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: ( theme ) => `calc(${ theme.trelloCustom.boardContentHeight } - ${ theme.spacing( 5 ) })`
        }
        }
      >
        {/* Box Column header */ }
        < Box
          sx={ {
            height: ( theme ) => theme.trelloCustom.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          } }
        >
          <Typography sx={ {
            fontSize: '1rem !important',
            fontWeight: 'bold',
            cursor: 'pointer'
          } }>
            { column?.title }
          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={ { color: 'text.primary', cursor: 'pointer' } }
                id="basic-column-dropdown"
                aria-controls={ open ? 'basic-menu-column-dropdown' : undefined }
                aria-haspopup="true"
                aria-expanded={ open ? 'true' : undefined }
                onClick={ handleClick }
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={ anchorEl }
              open={ open }
              onClose={ handleClose }
              MenuListProps={ {
                'aria-labelledby': 'basic-column-dropdown'
              } }
            >
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Add New Cart</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem>
                <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>

            </Menu>
          </Box>
        </Box >

        {/* list card */ }
        <ListCards cards={ orderCards } />

        {/* Box Column footer */ }
        < Box
          sx={ {
            height: ( theme ) => theme.trelloCustom.columnFooterHeight,
            p: 2
          } }
        >
          { !openNewCardForm ?
            <Box sx={ {
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            } } >
              <Button startIcon={ <AddCardIcon /> } onClick={ toggleOpenNewCardForm }>Add New Cart</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={ { cursor: 'pointer' } } />
              </Tooltip>
            </Box>
            :
            <Box sx={ {
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            } }>

              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                autoFocus
                data-no-dnd="true"
                value={ newCardTitle }
                onChange={ ( e ) => setNewCardTitle( e.target.value ) }
                sx={ {
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: ( theme ) => theme.palette.primary.main,
                    bgcolor: ( theme ) => ( theme.palette.mode === 'dark' ? '#333643' : 'white' )
                  },
                  '& label.Mui-focused': { color: ( theme ) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: ( theme ) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: ( theme ) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: ( theme ) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                } }
              />
              <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                <Button variant="contained" color="success" size="small"
                  sx={ {
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: ( theme ) => theme.palette.success.main,
                    '&:hover': { bgcolor: ( theme ) => theme.palette.success.main }
                  } }
                  onClick={ addNewCard }
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={ {
                    color: ( theme ) => theme.palette.warning.light,
                    cursor: 'pointer'
                  } }
                  onClick={ toggleOpenNewCardForm }
                />
              </Box>
            </Box>
          }
        </Box >

      </Box >
    </div>
  )
}

export default Column
