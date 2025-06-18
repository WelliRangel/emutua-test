"use client"

import { useCallback } from "react"
import { useProductContext } from "../context/ProductContext"
import { productApi } from "../lib/api"
import type { CreateProductData, UpdateProductData, ProductFilters, ApiError } from "../types/product"
import toast from "react-hot-toast"
import { MESSAGES, PAGINATION } from "../lib/constants"

export const useProducts = () => {
  const { state, dispatch } = useProductContext()

  const handleApiError = useCallback(
    (error: unknown, defaultMessage: string) => {
      const apiError = error as ApiError
      const message = apiError?.message || defaultMessage
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
    },
    [dispatch],
  )

  const loadProducts = useCallback(
    async (page = PAGINATION.DEFAULT_PAGE, resetProducts = true) => {
      if (resetProducts) {
        dispatch({ type: "SET_LOADING", payload: true })
      }

      try {
        const filters: ProductFilters = {
          page,
          limit: PAGINATION.DEFAULT_LIMIT,
        }

        const response = await productApi.getProducts(filters)
        dispatch({
          type: "SET_PRODUCTS",
          payload: {
            products: response.data,
            pagination: response.pagination,
          },
        })

        dispatch({ type: "SET_FILTERS", payload: { page } })
      } catch (error) {
        handleApiError(error, "Erro ao carregar produtos")
      }
    },
    [dispatch, handleApiError],
  )

  const searchProducts = useCallback(
    async (query: string, page = PAGINATION.DEFAULT_PAGE) => {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_FILTERS", payload: { search: query, page } })

      try {
        if (!query.trim()) {
          // If query is empty, load all products
          await loadProducts(page)
          return
        }

        const response = await productApi.searchProducts(query, page)
        dispatch({
          type: "SET_PRODUCTS",
          payload: {
            products: response.data,
            pagination: response.pagination,
          },
        })
      } catch (error) {
        handleApiError(error, "Erro ao buscar produtos")
      }
    },
    [dispatch, handleApiError, loadProducts],
  )

  const loadCategories = useCallback(async () => {
    try {
      const response = await productApi.getCategories()
      dispatch({ type: "SET_CATEGORIES", payload: response.data })
    } catch (error) {
      console.warn("Erro ao carregar categorias:", error)
      // Don't show toast for categories as it's not critical
    }
  }, [dispatch])

  const filterByCategory = useCallback(
    async (category: string, page = PAGINATION.DEFAULT_PAGE) => {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_FILTERS", payload: { category, page } })

      try {
        if (!category.trim()) {
          // If category is empty, load all products
          await loadProducts(page)
          return
        }

        const response = await productApi.getProductsByCategory(category, page)
        dispatch({
          type: "SET_PRODUCTS",
          payload: {
            products: response.data,
            pagination: response.pagination,
          },
        })
      } catch (error) {
        handleApiError(error, "Erro ao filtrar produtos")
      }
    },
    [dispatch, handleApiError, loadProducts],
  )

  const loadProduct = useCallback(
    async (id: number) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const response = await productApi.getProduct(id)
        dispatch({ type: "SET_CURRENT_PRODUCT", payload: response.data })
      } catch (error) {
        handleApiError(error, "Erro ao carregar produto")
      }
    },
    [dispatch, handleApiError],
  )

  const createProduct = useCallback(
    async (data: CreateProductData) => {
      try {
        const response = await productApi.createProduct(data)
        dispatch({ type: "ADD_PRODUCT", payload: response.data })

        // Refresh categories to include any new category that was created
        await loadCategories()

        toast.success(MESSAGES.SUCCESS.PRODUCT_CREATED)
        return response.data
      } catch (error) {
        handleApiError(error, "Erro ao criar produto")
        throw error
      }
    },
    [dispatch, handleApiError, loadCategories],
  )

  const updateProduct = useCallback(
    async (id: number, data: UpdateProductData) => {
      try {
        const response = await productApi.updateProduct(id, data)
        dispatch({ type: "UPDATE_PRODUCT", payload: response.data })
        toast.success(MESSAGES.SUCCESS.PRODUCT_UPDATED)
        return response.data
      } catch (error) {
        handleApiError(error, "Erro ao atualizar produto")
        throw error
      }
    },
    [dispatch, handleApiError],
  )

  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        await productApi.deleteProduct(id)
        dispatch({ type: "DELETE_PRODUCT", payload: id })
        toast.success(MESSAGES.SUCCESS.PRODUCT_DELETED)
      } catch (error) {
        handleApiError(error, "Erro ao excluir produto")
        throw error
      }
    },
    [dispatch, handleApiError],
  )

  const clearFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" })
    loadProducts(1)
  }, [dispatch, loadProducts])

  const setFilters = useCallback(
    (filters: Partial<typeof state.filters>) => {
      dispatch({ type: "SET_FILTERS", payload: filters })
    },
    [dispatch],
  )

  return {
    // State
    ...state,

    // Actions
    loadProducts,
    searchProducts,
    loadCategories,
    filterByCategory,
    loadProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    clearFilters,
    setFilters,

    // Computed values
    hasProducts: state.products.length > 0,
    hasFilters: Boolean(state.filters.search || state.filters.category),
    isFirstPage: state.pagination?.current_page === 1,
    isLastPage: state.pagination ? state.pagination.current_page >= state.pagination.last_page : true,
  }
}
