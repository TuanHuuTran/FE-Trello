import Box from '@mui/material/Box'
function BoardContent() {
  return (
    <Box sx={ {
      backgroundColor: 'primary.main',
      width: '100%',
      height: ( them ) => `calc(100vh - ${ them.trelloCustom.appBarHeight } - ${ them.trelloCustom.boardBarHeight })`,
      display: 'flex',
      alignItems: 'center'
    } }>
      Board content
    </Box>
  )
}

export default BoardContent
