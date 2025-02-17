import Button from '@mui/material/Button'
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms'

import {
  useColorScheme
} from '@mui/material/styles'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={ () => {
        setMode( mode === 'light' ? 'dark' : 'light' )
      } }
    >
      { mode === 'light' ? 'Turn dark' : 'Turn light' }
    </Button>
  )
}

function App() {
  return (
    <>
      <ModeToggle />
      <div>tuantran</div>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <br />
      < AccessAlarmsIcon />
    </>
  )
}

export default App
