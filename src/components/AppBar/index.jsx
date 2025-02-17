import Box from '@mui/material/Box'
import ModelSelect from '../ModeSelect'

function AppBar() {
  return (
    <>
      <Box sx={ {
        backgroundColor: 'primary.light',
        width: '100%',
        height: ( them ) => them.trelloCustom.appBarHeight,
        display: 'flex',
        alignItems: 'center'
      } }>
        <ModelSelect />
      </Box>
    </>
  )
}

export default AppBar
