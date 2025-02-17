import Box from '@mui/material/Box'
function BoardBar() {
  return (
    <Box sx={ {
      backgroundColor: 'primary.dark',
      width: '100%',
      height: ( them ) => them.trelloCustom.boardBarHeight,
      display: 'flex',
      alignItems: 'center'
    } }>
      Board
    </Box>
  )
}

export default BoardBar
