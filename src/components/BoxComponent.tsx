import { Box, Chip, Typography } from '@mui/material'

type DocumentInterfaceProps = {
  text: string
  data: string
}

export default function BoxComponent({ text, data }: DocumentInterfaceProps) {
  return (
    <Box>
      <Typography color="text.secondary" fontSize={14}>
        {text}
      </Typography>
      <Typography>{data}</Typography>
    </Box>
  )
}
