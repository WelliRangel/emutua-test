"use client"

import { useState, useCallback, useEffect, type FormEvent } from "react"
import { Search, X } from "lucide-react"
import { useDebounce } from "../../lib/hooks/useDebounce"
import Input from "../atoms/Input"
import Button from "../atoms/Button"

interface SearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
  placeholder?: string
  value?: string
  disabled?: boolean
}

export default function SearchBar({
  onSearch,
  onClear,
  placeholder = "Buscar produtos...",
  value = "",
  disabled = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(value)
  const debouncedQuery = useDebounce(query, 300)

  // Update local state when external value changes
  useEffect(() => {
    if (value !== query) {
      setQuery(value)
    }
  }, [value]) // Only depend on value, not query to avoid loops

  // Auto-search when debounced query changes (but not on initial render)
  useEffect(() => {
    if (debouncedQuery !== value && debouncedQuery.length >= 0) {
      onSearch(debouncedQuery.trim())
    }
  }, [debouncedQuery, onSearch]) // Remove value from dependencies

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  const handleClear = useCallback(() => {
    setQuery("")
    onClear()
  }, [onClear])

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          disabled={disabled}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={disabled}
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit" disabled={disabled || !query.trim()}>
        Buscar
      </Button>
    </form>
  )
}
