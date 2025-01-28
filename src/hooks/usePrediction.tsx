import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { JobResponse } from '../interface'

const API_KEY = import.meta.env.VITE_MINDEE_API_KEY

const mindee = axios.create({ baseURL: 'https://api.mindee.net/v1/products/' })

const usePrediction = () => {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState<boolean>(false)

  // debugging logs for state
  console.log('State:', { currentJobId, isPolling })

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
      console.log('Document submitted successfully, starting poll')

      setCurrentJobId(data.job.id)
      setIsPolling(true)
    },
  })

  const pollStatus = useQuery({
    queryKey: ['pollStatus', currentJobId],
    queryFn: async () => {
      if (!currentJobId || !isPolling) return null

      console.log('Executing poll for job:', currentJobId)

      const response = await mindee.get<JobResponse>(
        `mindee/financial_document/v1/documents/queue/${currentJobId}`,
        {
          headers: {
            Authorization: `Token ${API_KEY}`,
          },
        },
      )

      if (response.data.document) {
        console.log('Got final document data, stopping poll')

        setIsPolling(false)
      }

      return response.data
    },
    enabled: !!currentJobId && isPolling,
    refetchInterval: (data) => {
      if (!currentJobId || !isPolling) return false

      if (data?.document) {
        console.log('Have document data, stopping poll')

        return false
      }
      return 2000
    },
    retry: 3,
  })

  return {
    submitDocument,
    isLoading: submitDocument.isLoading || pollStatus.isLoading,
    data: pollStatus.data || submitDocument.data,
    error: submitDocument.error || pollStatus.error,
  }
}
export default usePrediction
