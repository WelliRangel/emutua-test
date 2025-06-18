"use client"

import Select from "../atoms/Select"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  loading?: boolean
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  loading = false,
}: CategoryFilterProps) {
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }))

  return (
    <div className="w-full max-w-xs">
      <Select
        label="Filtrar por categoria"
        value={selectedCategory}
        onValueChange={onCategoryChange}
        options={categoryOptions}
        disabled={loading}
      />
    </div>
  )
}
