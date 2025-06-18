import axios, { type AxiosInstance, type AxiosError } from "axios"
import type {
  ProductResponse,
  SingleProductResponse,
  CategoryResponse,
  CreateProductData,
  UpdateProductData,
  ProductFilters,
  ApiError,
} from "../types/product"
import { API_CONFIG, MESSAGES } from "./constants"

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp to prevent caching
        if (config.method === "get") {
          config.params = { ...config.params, _t: Date.now() }
        }
        return config
      },
      (error) => Promise.reject(this.handleError(error)),
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(this.handleError(error)),
    )
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || MESSAGES.ERRORS.GENERIC,
        status: error.response.status,
        code: error.code,
      }
    } else if (error.request) {
      // Network error
      return {
        message: MESSAGES.ERRORS.NETWORK,
        code: error.code,
      }
    } else {
      // Other error
      return {
        message: error.message || MESSAGES.ERRORS.GENERIC,
        code: error.code,
      }
    }
  }

  private buildQueryString(filters: ProductFilters): string {
    const params = new URLSearchParams()

    if (filters.search) params.append("q", filters.search)
    if (filters.category) params.append("category", filters.category)
    if (filters.page) params.append("page", filters.page.toString())
    if (filters.limit) params.append("limit", filters.limit.toString())

    return params.toString()
  }

  async getProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
    const queryString = this.buildQueryString(filters)
    const url = queryString ? `/api/produtos?${queryString}` : "/api/produtos"
    const response = await this.client.get<ProductResponse>(url)
    return response.data
  }

  async searchProducts(query: string, page = 1): Promise<ProductResponse> {
    const response = await this.client.get<ProductResponse>(
      `/api/produtos/search?q=${encodeURIComponent(query)}&page=${page}`,
    )
    return response.data
  }

  async getCategories(): Promise<CategoryResponse> {
    const response = await this.client.get<CategoryResponse>("/api/produtos/categorias")
    return response.data
  }

  async getProductsByCategory(category: string, page = 1): Promise<ProductResponse> {
    const response = await this.client.get<ProductResponse>(
      `/api/produtos/categorias/${encodeURIComponent(category)}?page=${page}`,
    )
    return response.data
  }

  async getProduct(id: number): Promise<SingleProductResponse> {
    const response = await this.client.get<SingleProductResponse>(`/api/produtos/${id}`)
    return response.data
  }

  async createProduct(data: CreateProductData): Promise<SingleProductResponse> {
    const response = await this.client.post<SingleProductResponse>("/api/produtos", data)
    return response.data
  }

  async updateProduct(id: number, data: UpdateProductData): Promise<SingleProductResponse> {
    const response = await this.client.put<SingleProductResponse>(`/api/produtos/${id}`, data)
    return response.data
  }

  async deleteProduct(id: number): Promise<{ status: boolean; message: string }> {
    const response = await this.client.delete<{ status: boolean; message: string }>(`/api/produtos/${id}`)
    return response.data
  }
}

export const productApi = new ApiClient()
