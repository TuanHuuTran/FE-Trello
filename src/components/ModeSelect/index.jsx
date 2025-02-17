import Box from '@mui/material/Box'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'


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

export default ModelSelect
