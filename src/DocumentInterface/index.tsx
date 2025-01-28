import { Button, Stack } from '@mui/material'
import Dropzone from 'react-dropzone'
import { AnnotationViewer } from 'react-mindee-js'

import { Shape } from '../interface'
import AnnotationPlaceholder from './AnnotationPlaceholder'

type DocumentInterfaceProps = {
  document: File | null
  shapes: Shape[]
  onClickUpload: (file: File) => void
  onClickPredict: () => void
  onShapeMouseEnter: (shape: Shape) => void
}

export default function DocumentInterface({
  document,
  shapes,
  onClickUpload,
  onClickPredict,
  onShapeMouseEnter,
}: DocumentInterfaceProps) {
  return (
    <Stack sx={{ height: '100%' }}>
      <Dropzone onDrop={(files) => onClickUpload(files[0])} multiple={false}>
        {({ getRootProps, getInputProps, open }) => (
          <>
            <Stack sx={{ flexGrow: 1 }}>
              {document ? (
                <AnnotationViewer
                  data={{ image: URL.createObjectURL(document), shapes }}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 4,
                  }}
                  onShapeMouseEnter={onShapeMouseEnter}
                />
              ) : (
                <Stack
                  sx={{ position: 'relative', flexGrow: 1 }}
                  {...getRootProps()}
                >
                  <AnnotationPlaceholder />
                </Stack>
              )}

              <input {...getInputProps()} />
            </Stack>

            <Stack
              direction="row"
              columnGap={2}
              sx={{ marginTop: 2, justifyContent: 'center' }}
            >
              <Button
                variant="outlined"
                onClick={() => open()}
                sx={{ paddingInline: 2, textTransform: 'none' }}
              >
                Upload document
              </Button>

              <Button
                variant="contained"
                onClick={() => onClickPredict()}
                sx={{ paddingInline: 2, textTransform: 'none' }}
              >
                Make prediction
              </Button>
            </Stack>
          </>
        )}
      </Dropzone>
    </Stack>
  )
}
