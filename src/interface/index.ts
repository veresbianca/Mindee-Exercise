interface JobResponse {
  api_request?: {
    status: string
    status_code: number
  }
  job: {
    available_at: string | null
    id: string
    issued_at: string
    status: 'waiting' | 'processing' | 'completed'
    error: Record<string, unknown>
  }
  document?: {
    id: string
    inference: {
      finished_at: string
      started_at: string
      processing_time: number
    }
  }
}

export type { JobResponse }