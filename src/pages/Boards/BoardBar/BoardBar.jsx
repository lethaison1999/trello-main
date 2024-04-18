import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar({ board }) {
  return (
    <Box
      sx={{
        // backgroundColor: 'primary.dark',
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        // borderBottom: '1px solid #00bfa5',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#46536A' : '#115BA7')
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip icon={<DashboardIcon />} label={board?.title} clickable sx={MENU_STYLES} />
        </Tooltip>
        <Chip
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
          sx={MENU_STYLES}
        />
        <Chip icon={<AddToDriveIcon />} label="Add to Drive Icons" clickable sx={MENU_STYLES} />
        <Chip icon={<ElectricBoltIcon />} label="Automations" clickable sx={MENU_STYLES} />
        <Chip icon={<FilterListIcon />} label="Filters" clickable sx={MENU_STYLES} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: '#ccc',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="thaisondev">
            <Avatar
              alt="thaisondev"
              src="https://lethaison1999.github.io/mycv.lethaison/assets/img/profiles-3.jpg"
            />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar
              alt="thaisondev"
              src="https://lh3.googleusercontent.com/ogw/AF2bZyjS9v4cuwKiAQ273duXa96Vr_FaZTfyYRze78YyBQ=s32-c-mo"
            />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar
              alt="thaisondev"
              src="https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045-2.jpg"
            />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar
              alt="thaisondev"
              src="https://img.pikbest.com/ai/illus_our/20230418/64e0e89c52dec903ce07bb1821b4bcc8.jpg!w700wp"
            />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar alt="thaisondev" src="https://mui.com/static/images/avatar/3.jpg" />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar alt="thaisondev" src="https://mui.com/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar
              alt="thaisondev"
              src="https://lethaison1999.github.io/mycv.lethaison/assets/img/profiles-3.jpg"
            />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar
              alt="thaisondev"
              src="https://lh3.googleusercontent.com/ogw/AF2bZyjS9v4cuwKiAQ273duXa96Vr_FaZTfyYRze78YyBQ=s32-c-mo"
            />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar
              alt="thaisondev"
              src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/431652158_3709737245970057_4251614013962816805_n.jpg?stp=dst-jpg_p843x403&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=XHmh-jAYRUkAX_LUOKn&_nc_ht=scontent.fdad1-2.fna&oh=00_AfDx7lcSC2UKyohPzxXhM0kiv4spRpvNz-kVs90aMI4onw&oe=65F2AAD6"
            />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar
              alt="thaisondev"
              src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/417570068_3740550429604686_8459759150354680524_n.jpg?stp=dst-jpg_p720x720&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=_LZBVAGNqTAAX8TuxGj&_nc_ht=scontent.fdad1-3.fna&oh=00_AfC9mpgyjKbiuNQTXEk6QBOzG1gQhgp1Up_dEcg-QTbQhA&oe=65F25931"
            />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar alt="thaisondev" src="https://mui.com/static/images/avatar/3.jpg" />
          </Tooltip>
          <Tooltip title="thaisondev">
            <Avatar alt="thaisondev" src="https://mui.com/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
