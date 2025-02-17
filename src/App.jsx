import Button from '@mui/material/Button'
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms'
import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'

import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'


function ModelSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = ( event ) => {
    const selectMode = event.target.value
    setMode( selectMode )
  }
  return (
    <FormControl sx={ { m: 1, minWidth: 120 } } size="small">
      <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={ mode }
        label="Mode"
        onChange={ handleChange }
      >
        <MenuItem value={ 'light' }>
          <div style={ { display: 'flex', alignItems: 'center', gap: '8px' } }>
            <LightModeIcon />
            Light
          </div>
        </MenuItem>
        <MenuItem value={ 'dark' }>
          <Box sx={ {
            display: 'flex',
            alignItems: 'center',
            gap: 1
          } }>
            <DarkModeIcon fontSize='small' />
            Dark
          </Box>
        </MenuItem>
        <MenuItem value={ 'system' }>
          <Box sx={ {
            display: 'flex',
            alignItems: 'center',
            gap: 1
          } }>
            <SettingsSuggestIcon />
            System
          </Box>
        </MenuItem>
      </Select>
    </FormControl >
  )
}


function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  // const prefersDarkMode = useMediaQuery( '(prefers-color-scheme: dark)' )
  // const prefersLightMode = useMediaQuery( '(prefers-color-scheme: light)' )
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
      <ModelSelect />
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
