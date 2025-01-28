import { Box, Chip, Typography } from '@mui/material'

type DocumentInterfaceProps = {
  text: string
  data: string
  isActive: boolean
}

export default function BoxComponent({
  text,
  data,
  isActive,
}: DocumentInterfaceProps) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: isActive ? 'primary.light' : 'grey.100',
      }}
    >
      <Typography color="text.secondary" fontSize={14}>
        {text}
      </Typography>
      <Typography>{data}</Typography>
    </Box>
  )
}
