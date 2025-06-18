"use client"

import type React from "react"
import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react"
import type { Product, PaginationData } from "../types/product"

interface ProductState {
  products: Product[]
  categories: string[]
  currentProduct: Product | null
  loading: boolean
  error: string | null
  pagination: PaginationData | null
  filters: {
    search: string
    category: string
    page: number
  }
}

type ProductAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PRODUCTS"; payload: { products: Product[]; pagination?: PaginationData } }
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "SET_CURRENT_PRODUCT"; payload: Product | null }
  | { type: "SET_FILTERS"; payload: Partial<ProductState["filters"]> }
  | { type: "RESET_FILTERS" }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: number }
  | { type: "RESET_STATE" }

const initialState: ProductState = {
  products: [],
  categories: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {
    search: "",
    category: "",
    page: 1,
  },
}

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload, error: action.payload ? null : state.error }

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }

    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination || null,
        loading: false,
        error: null,
      }

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload }

    case "SET_CURRENT_PRODUCT":
      return { ...state, currentProduct: action.payload }

    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }

    case "RESET_FILTERS":
      return {
        ...state,
        filters: initialState.filters,
      }

    case "ADD_PRODUCT":
      return {
        ...state,
        products: [action.payload, ...state.products],
        pagination: state.pagination
          ? {
              ...state.pagination,
              total: state.pagination.total + 1,
            }
          : null,
      }

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) => (product.id === action.payload.id ? action.payload : product)),
        currentProduct: state.currentProduct?.id === action.payload.id ? action.payload : state.currentProduct,
      }

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
        currentProduct: state.currentProduct?.id === action.payload ? null : state.currentProduct,
        pagination: state.pagination
          ? {
              ...state.pagination,
              total: Math.max(0, state.pagination.total - 1),
            }
          : null,
      }

    case "RESET_STATE":
      return initialState

    default:
      return state
  }
}

interface ProductContextValue {
  state: ProductState
  dispatch: React.Dispatch<ProductAction>
}

const ProductContext = createContext<ProductContextValue | null>(null)

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productReducer, initialState)

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  )

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>
}

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider")
  }
  return context
}
