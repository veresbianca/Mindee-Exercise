
interface Shape {
  id: string
  coordinates: [number, number][]
}

interface Data {
  api_request: object;
  document: Document;
  job: object;
}

interface Document {
  id: string;
  inference: Inference;
  n_pages: number;
  name: string;
}
interface Inference {
  extras: object;
  finished_at: string;
  is_rotation_applied: boolean;
  pages?: object;
  prediction: object;
  processing_time: number;
  product: object;
  started_at: string;
}

interface Orientation {
  value: number;
}
interface Category {
  confidence: number;
  value: string;
}

interface LineItemsEntity {
  confidence: number;
  description: string;
  polygon?: ((number)[] | null)[] | null;
  product_code?: null;
  quantity: number;
  tax_amount?: null;
  tax_rate?: null;
  total_amount: number;
  unit_measure?: string | null;
  unit_price: number;
}

interface Job {
  available_at: string;
  error: object;
  id: string;
  issued_at: string;
  status: string;
}

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
    inference: Inference
  }
}


export type { JobResponse, Shape, Data }