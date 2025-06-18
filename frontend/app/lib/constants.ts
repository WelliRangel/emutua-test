export const API_CONFIG = {
  BASE_URL: "https://lemonchiffon-chimpanzee-679612.hostingersite.com",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const

export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_PRICE: 0,
  MAX_PRICE: 999999999,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const

export const UI = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  MODAL_ANIMATION_DURATION: 200,
} as const

export const MESSAGES = {
  ERRORS: {
    GENERIC: "Algo deu errado. Tente novamente.",
    NETWORK: "Erro de conexão. Verifique sua internet.",
    NOT_FOUND: "Recurso não encontrado.",
    VALIDATION: "Dados inválidos fornecidos.",
  },
  SUCCESS: {
    PRODUCT_CREATED: "Produto criado com sucesso!",
    PRODUCT_UPDATED: "Produto atualizado com sucesso!",
    PRODUCT_DELETED: "Produto excluído com sucesso!",
  },
} as const
