export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  image?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface ProductResponse {
  status: boolean
  message: string
  data: Product[]
  pagination?: PaginationData
}

export interface SingleProductResponse {
  status: boolean
  message: string
  data: Product
}

export interface CategoryResponse {
  status: boolean
  message: string
  data: string[]
}

export interface PaginationData {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from?: number
  to?: number
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  category: string
}

export interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  category?: string
}

export interface ProductFilters {
  search?: string
  category?: string
  page?: number
  limit?: number
}

// Form validation schemas
export interface ProductFormData extends CreateProductData {}

export interface ProductFormErrors {
  name?: string
  description?: string
  price?: string
  category?: string
}

// API Error types
export interface ApiError {
  message: string
  status?: number
  code?: string
}
