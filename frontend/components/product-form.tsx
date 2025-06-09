"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ProductFormProps {
  product?: {
    id: string
    name: string
    description: string | null
    price: number
    category: string
    stock?: number
    image?: string
    status?: "active" | "inactive"
  }
  onSubmit: (data: Omit<ProductFormProps["product"], "id">) => void
  onCancel: () => void
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        category: product.category || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
      })
    }
    setErrors({})
  }, [product])

  function validate() {
    const errs: { [key: string]: string } = {}
    if (!formData.name) errs.name = "Name is required"
    if (!formData.category) errs.category = "Category is required"
    if (formData.price === undefined || isNaN(Number(formData.price))) errs.price = "Price is required"
    return errs
  }

  function handleChange(field: string, value: string | number) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    // price deve ser inteiro (centavos)
    onSubmit({
      name: formData.name,
      description: formData.description,
      price: Math.round(Number(formData.price)),
      category: formData.category,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Product name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder="Category"
          className={errors.category ? "border-red-500" : ""}
        />
        {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
      </div>
      <div>
        <Label htmlFor="price">Price (em centavos) *</Label>
        <Input
          id="price"
          type="number"
          min="0"
          value={formData.price}
          onChange={(e) => handleChange("price", e.target.value)}
          placeholder="0"
          className={errors.price ? "border-red-500" : ""}
        />
        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter product description"
          rows={4}
        />
      </div>
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          {product ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  )
}