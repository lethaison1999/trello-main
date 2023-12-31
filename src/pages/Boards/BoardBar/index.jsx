import Box from '@mui/material/Box'

function BoardBar() {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.dark',
        width: '100%',
        height: (theme) => theme.trello.broadBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      Board bar
    </Box>
  )
}

export default BoardBar
