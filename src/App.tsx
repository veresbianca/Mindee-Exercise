import { useEffect, useRef, useState } from 'react'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { drawLayer, drawShape, setShapeConfig, Stage } from 'react-mindee-js'

import DocumentInterface from './DocumentInterface'
import usePrediction from './hooks/usePrediction'
import { Data, Shape } from './interface'

function App() {
  const [document, setDocument] = useState<File | null>(null)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [activeShape, setActiveShape] = useState<{
    id: string
    type: string
    coordinates: [number, number][]
  }>({ id: '', type: '', coordinates: [] })

  const { submitDocument, isLoading, data } = usePrediction()

  // Log state for debugging
  useEffect(() => {
    const shapesExtracted = extractShapes(data)
    setShapes(shapesExtracted)
  }, [data, activeShape])

  const handlePredict = () => {
    if (document) {
      submitDocument.mutate(document)
    }
  }

  const extractShapes = (data: Data) => {
    const shapes: Shape[] = []

    if (data?.document?.inference?.prediction) {
      const prediction = data.document.inference.prediction

      // Process the top-level properties in prediction
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

      // Process the line_items array
      if (Array.isArray(prediction.line_items)) {
        for (const item of prediction.line_items) {
          if (
            item &&
            typeof item === 'object' &&
            'polygon' in item &&
            Array.isArray(item.polygon)
          ) {
            shapes.push({
              id: 'line_items',
              coordinates: item.polygon,
            })
          }
        }
      }
    }

    return shapes
  }

  const handleOnShapeMouseEnter = (shape: Shape) => {
    setActiveShape({
      id: shape.id,
      coordinates: shape.coordinates,
      type: 'mouse-enter',
    })
  }

  const isActive = (id: string, coordinates: [number, number][]) =>
    id === activeShape.id && coordinates === activeShape.coordinates

  const annotationViewerStageRef = useRef<null | Stage>(null)

  const handleSetAnnotationViewerStage = (stage: Stage) => {
    annotationViewerStageRef.current = stage
  }

  const handleOnFieldMouseEnter = (shape: Shape) => {
    drawShape(annotationViewerStageRef.current!, shape.id, {
      fill: '#64cff2',
    })
  }

  const handleOnFieldMouseLeave = (shape: Shape) => {
    setShapeConfig(annotationViewerStageRef.current!, shape.id, {
      fill: 'transparent',
    })
    drawLayer(annotationViewerStageRef.current!)
  }

  const prediction = data?.document?.inference?.prediction ?? {}

  return (
    <Grid container rowGap={2} sx={{ height: '100vh', background: '#FCFCFC' }}>
      <Grid item xs={6} sx={{ padding: 8 }}>
        <DocumentInterface
          document={document}
          onClickUpload={(file: File) => setDocument(file)}
          onClickPredict={handlePredict}
          onShapeMouseEnter={handleOnShapeMouseEnter}
          shapes={shapes}
          setAnnotationViewerStage={handleSetAnnotationViewerStage}
        />
      </Grid>

      {isLoading ? (
        <Grid
          item
          xs={6}
          sx={{ padding: 8, display: 'flex', alignItems: 'center' }}
        >
          <Typography>Processing document...</Typography>
        </Grid>
      ) : data?.document?.inference ? (
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: 2,
            height: '100%',
            overflowY: 'auto', // Enables vertical scrolling
          }}
        >
          {shapes
            .filter((shape) => shape.id !== 'line_items')
            .map((shape, key) => (
              <Box
                key={key}
                data-id={shape.id}
                onMouseEnter={() => handleOnFieldMouseEnter(shape)}
                onMouseLeave={() => handleOnFieldMouseLeave(shape)}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  border: isActive(shape.id, shape.coordinates)
                    ? '1px solid #fc031c'
                    : '1px solid grey.100',
                  cursor: 'pointer',
                  ':hover': {
                    border: '2px solid #64cff2', // Blue border on hover
                    bgcolor: '#64cff2', // Background color remains the same
                  },
                  '&:hover *': {
                    color: '#fff', // Change text color on hover
                  },
                }}
              >
                {prediction[shape.id] ? (
                  <>
                    <Typography variant="h6" gutterBottom>
                      ID: {shape.id}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem' }} gutterBottom>
                      Value: {prediction[shape.id].value}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem' }} gutterBottom>
                      Confidence: {prediction[shape.id].confidence}
                    </Typography>
                  </>
                ) : null}
              </Box>
            ))}

          {prediction['line_items']
            ? prediction['line_items'].map((item, key) => (
                <Box
                  key={key}
                  onMouseEnter={() =>
                    handleOnFieldMouseEnter({
                      id: 'line_items',
                      coordinates: item.polygon,
                    })
                  }
                  onMouseLeave={() =>
                    handleOnFieldMouseLeave({
                      id: 'line_items',
                      coordinates: item.polygon,
                    })
                  }
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    border: isActive('line_items', item.polygon)
                      ? '1px solid #fc031c'
                      : '1px solid grey.100',
                    cursor: 'pointer',
                    ':hover': {
                      border: '2px solid #64cff2', // Blue border on hover
                      bgcolor: '#64cff2', // Background color remains the same
                    },
                    '&:hover *': {
                      color: '#fff', // Change text color on hover
                    },
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Description: {item.description}
                  </Typography>
                  <Typography sx={{ fontSize: '1rem' }} gutterBottom>
                    Confidence: {item.confidence}
                  </Typography>
                </Box>
              ))
            : null}
        </Grid>
      ) : (
        <Grid
          item
          xs={6}
          sx={{ padding: 8, display: 'flex', alignItems: 'center' }}
        >
          <Typography color="textSecondary">
            Upload and process a document to see the results
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

export default App
