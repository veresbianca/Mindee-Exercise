import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import { JobResponse } from '../interface'

const API_KEY = import.meta.env.VITE_MINDEE_API_KEY

const mindee = axios.create({ baseURL: 'https://api.mindee.net/v1/products/' })

const usePrediction = () => {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)

  // debugging logs for state
  console.log('State:', { currentJobId })

  const submitDocument = useMutation({
    mutationFn: async (document: File) => {
      console.log('Submitting document...')

      const formData = new FormData()
      formData.append('document', document)

      const response = await mindee.post<JobResponse>(
        'mindee/financial_document/v1/predict_async',
        formData,
        {
          headers: {
            Authorization: `Token ${API_KEY}`,
          },
        },
      )

      return response.data
    },
    onSuccess: (data) => {
      setCurrentJobId(data.job.id)
    },
  })

  return {
    submitDocument,
    isLoading: submitDocument.isLoading,
    data: submitDocument.data,
    error: submitDocument.error,
  }
}
export default usePrediction
