import { VALIDATION } from "./constants"
import type { CreateProductData, ProductFormErrors } from "../types/product"

export const validateProductForm = (data: CreateProductData): ProductFormErrors => {
  const errors: ProductFormErrors = {}

  // Name validation
  if (!data.name?.trim()) {
    errors.name = "Nome é obrigatório"
  } else if (data.name.trim().length < VALIDATION.MIN_NAME_LENGTH) {
    errors.name = `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`
  } else if (data.name.trim().length > VALIDATION.MAX_NAME_LENGTH) {
    errors.name = `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`
  }

  // Price validation
  if (data.price === undefined || data.price === null) {
    errors.price = "Preço é obrigatório"
  } else if (data.price < VALIDATION.MIN_PRICE) {
    errors.price = "Preço deve ser maior ou igual a 0"
  } else if (data.price > VALIDATION.MAX_PRICE) {
    errors.price = "Preço muito alto"
  } else if (!Number.isInteger(data.price)) {
    errors.price = "Preço deve ser um número inteiro (em centavos)"
  }

  // Category validation
  if (!data.category?.trim()) {
    errors.category = "Categoria é obrigatória"
  }

  // Description validation (optional but has limits)
  if (data.description && data.description.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
    errors.description = `Descrição deve ter no máximo ${VALIDATION.MAX_DESCRIPTION_LENGTH} caracteres`
  }

  return errors
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price / 100)
}

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, " ")
}
