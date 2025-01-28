import { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'

import DocumentInterface from './DocumentInterface'
import usePrediction from './hooks/usePrediction'

function App() {
  const [document, setDocument] = useState<File | null>(null)
  const { submitDocument, isLoading, data } = usePrediction()

  // Log state for debugging
  useEffect(() => {
    console.log('Current data:', data)
  }, [data])

  const handlePredict = () => {
    if (document) {
      submitDocument.mutate(document)
    }
  }

  return (
    <Grid container rowGap={2} sx={{ height: '100vh', background: '#FCFCFC' }}>
      <Grid item xs={6} sx={{ padding: 8 }}>
        <DocumentInterface
          document={document}
          onClickUpload={(file: File) => setDocument(file)}
          onClickPredict={handlePredict}
        />
      </Grid>

      <Grid item xs={6} sx={{ display: 'grid', placeItems: 'center' }}>
        <Typography>Add the result of the inference here</Typography>
      </Grid>
    </Grid>
  )
}

export default App
