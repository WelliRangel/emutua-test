"use client"

import type React from "react"

import { type SelectHTMLAttributes, forwardRef, useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"
import { ChevronDown, Plus } from "lucide-react"

interface SelectProps extends Omit<SelectHTMLAttributes, "onChange"> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  allowCustom?: boolean
  onValueChange?: (value: string) => void
  value?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, allowCustom = false, onValueChange, value = "", className, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState(value)
    const [isCustomMode, setIsCustomMode] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      setInputValue(value)
      // Check if current value is not in options (custom value)
      const isCustomValue = value && !options.some((option) => option.value === value)
      setIsCustomMode(isCustomValue)
    }, [value, options])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      setIsCustomMode(true)
      onValueChange?.(newValue)
    }

    const handleOptionSelect = (optionValue: string) => {
      setInputValue(optionValue)
      setIsOpen(false)
      onValueChange?.(optionValue)
    }

    const handleCustomModeToggle = () => {
      setIsCustomMode(!isCustomMode)
      setIsOpen(false)
      if (!isCustomMode) {
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    }

    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

        <div ref={containerRef} className="relative">
          {isCustomMode ? (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className={cn("input-field pr-20", error && "border-red-500 focus:ring-red-500", className)}
                placeholder="Digite uma nova categoria..."
                {...props}
              />
              <button
                type="button"
                onClick={handleCustomModeToggle}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
              >
                Opções
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "input-field w-full text-left flex items-center justify-between",
                  error && "border-red-500 focus:ring-red-500",
                  className,
                )}
              >
                <span className={inputValue ? "text-gray-900" : "text-gray-500"}>
                  {inputValue || "Selecione uma opção"}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {allowCustom && (
                    <button
                      type="button"
                      onClick={handleCustomModeToggle}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-600 border-b"
                    >
                      <Plus className="h-4 w-4" />
                      Criar nova categoria
                    </button>
                  )}

                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleOptionSelect(option.value)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        {option.label}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-sm">Nenhuma opção encontrada</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Hidden select for form compatibility */}
          <select
            ref={ref}
            value={inputValue}
            onChange={() => {}} // Controlled by our custom logic
            className="sr-only"
            {...props}
          >
            <option value="">Selecione uma opção</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            {isCustomMode && inputValue && <option value={inputValue}>{inputValue}</option>}
          </select>
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)

Select.displayName = "Select"

export default Select
