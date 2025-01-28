import { useEffect, useState } from 'react'
import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material'

import { BoxComponent } from './components'
import DocumentInterface from './DocumentInterface'
import usePrediction from './hooks/usePrediction'
import { Data, Shape } from './interface'

function App() {
  const [document, setDocument] = useState<File | null>(null)
  const [shapes, setShapes] = useState<Shape[]>([])

  const { submitDocument, isLoading, data } = usePrediction()

  // Log state for debugging
  useEffect(() => {
    console.log('Current data:', data)

    const shapesExtracted = extractShapes(data)
    setShapes(shapesExtracted)
  }, [data])

  const handlePredict = () => {
    if (document) {
      submitDocument.mutate(document)
    }
  }

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount)
  }

  const extractShapes = (data: Data) => {
    const shapes = []

    if (data?.document?.inference?.prediction) {
      const prediction = data.document.inference.prediction

      // Loop through all properties in prediction
      for (const [key, value] of Object.entries(prediction)) {
        // Check if the property has a polygon array
        if (
          value &&
          typeof value === 'object' &&
          'polygon' in value &&
          Array.isArray(value.polygon)
        ) {
          shapes.push({
            id: key, // Use the key as the id
            coordinates: value.polygon,
          })
        }
      }
    }

    return shapes
  }

  return (
    <Grid container rowGap={2} sx={{ height: '100vh', background: '#FCFCFC' }}>
      <Grid item xs={6} sx={{ padding: 8 }}>
        <DocumentInterface
          document={document}
          onClickUpload={(file: File) => setDocument(file)}
          onClickPredict={handlePredict}
          shapes={shapes}
        />
      </Grid>

      <Grid item xs={12} md={6} sx={{ p: 2, height: '100%' }}>
        {isLoading ? (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: 'center',
              height: '100%',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>Processing document...</Typography>
          </Paper>
        ) : data?.document?.inference ? (
          <Paper
            elevation={3}
            sx={{ p: 3, height: '100%', minHeight: '400px', overflow: 'auto' }}
          >
            <Stack spacing={3}>
              {/* Document Info */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Document Information
                </Typography>
                <Stack spacing={2}>
                  <BoxComponent
                    text="Type"
                    data={
                      data.document.inference.prediction.document_type.value
                    }
                  />

                  <BoxComponent
                    text="Due Date"
                    data={new Date(
                      data.document.inference.prediction.due_date.value,
                    ).toLocaleDateString()}
                  />

                  <BoxComponent
                    text="Total Amount"
                    data={formatCurrency(
                      data.document.inference.prediction.total_amount.value,
                    )}
                  />

                  <BoxComponent
                    text="Locale"
                    data={data.document.inference.prediction.locale.value}
                  />

                  <BoxComponent
                    text="Orientation"
                    data={`${data.document.inference.pages[0].orientation.value}°`}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Line Items */}
              {data.document.inference.prediction.line_items?.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Line Items
                  </Typography>
                  <Stack spacing={2}>
                    {data.document.inference.prediction.line_items.map(
                      (item, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: 'grey.50',
                          }}
                        >
                          <Typography fontWeight={500} gutterBottom>
                            {item.description}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Typography color="text.secondary" fontSize={14}>
                                Quantity
                              </Typography>
                              <Typography>{item.quantity}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography color="text.secondary" fontSize={14}>
                                Unit Price
                              </Typography>
                              <Typography>
                                {formatCurrency(item.unit_price)}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography color="text.secondary" fontSize={14}>
                                Total
                              </Typography>
                              <Typography>
                                {formatCurrency(item.total_amount)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      ),
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        ) : (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: '100%',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="textSecondary">
              Upload and process a document to see the results
            </Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  )
}

export default App
