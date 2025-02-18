import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'primary.main',
  bgcolor: 'white',
  border: 'none',
  borderRadius: '4px',
  paddingX: '5px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar() {
  return (
    <Box sx={ {
      width: '100%',
      height: ( them ) => them.trelloCustom.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingX: 2,
      gap: 2,
      overflowX: 'auto',
      borderTop: '1px solid #00bfa5'
    } }>
      <Box sx={ { display: 'flex', alignItems: 'center', gap: 2 } }>
        <Chip
          icon={ <DashboardIcon /> }
          label="DashBoard"
          clickable
          sx={ MENU_STYLES }
        />
        <Chip
          icon={ <VpnLockIcon /> }
          label="Public/Private WorkSpace"
          clickable
          sx={ MENU_STYLES }
        />
        <Chip
          icon={ <AddToDriveIcon /> }
          label="Add To Google Drive"
          clickable
          sx={ MENU_STYLES }
        />
        <Chip
          icon={ <BoltIcon /> }
          label="Automation"
          clickable
          sx={ MENU_STYLES }
        />
        <Chip
          icon={ <FilterListIcon /> }
          label="Filters"
          clickable
          sx={ MENU_STYLES }
        />
      </Box>

      <Box sx={ { display: 'flex', alignItems: 'center', gap: 2 } }>
        <Button variant="outlined" startIcon={ <PersonAddIcon /> }>Invite</Button>
        <AvatarGroup
          max={ 3 }
          sx={ {
            '& .MuiAvatar-root': {
              width: '34px',
              height: '34px',
              fontSize: '16px'
            }
          } }
        >
          <Tooltip title="Avatar">
            <Avatar alt="Avatar" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Avatar">
            <Avatar alt="Avatar" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Avatar">
            <Avatar alt="Avatar" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Avatar">
            <Avatar alt="Avatar" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Avatar">
            <Avatar alt="Avatar" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Avatar">
            <Avatar alt="Avatar" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Avatar">
            <Avatar alt="Avatar" src="/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
