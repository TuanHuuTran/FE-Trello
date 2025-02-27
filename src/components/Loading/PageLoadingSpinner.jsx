import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

import Box from '@mui/material/Box'

function PageLoadingSpinner( { caption } ) {
  return (
    <Box sx={ {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      width: '100vw',
      height: '100vh'
    } }>
      <CircularProgress />
      <Typography>{ caption }</Typography>
    </Box>
  )
}

export default PageLoadingSpinner
