"use client"

import { useForm, type SubmitHandler } from "react-hook-form"
import { useMemo, useEffect } from "react"
import type { Product, CreateProductData } from "../../types/product"
import { validateProductForm } from "../../lib/validation"
import Input from "../atoms/Input"
import Select from "../atoms/Select"
import Button from "../atoms/Button"

interface ProductFormProps {
  product?: Product
  categories: string[]
  onSubmit: (data: CreateProductData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function ProductForm({ product, categories, onSubmit, onCancel, loading = false }: ProductFormProps) {
  const defaultValues = useMemo(
    () => ({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || undefined,
      category: product?.category || "",
    }),
    [product],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateProductData>({
    defaultValues,
    mode: "onBlur",
  })

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category,
        label: category,
      })),
    [categories],
  )

  const watchedCategory = watch("category")

  useEffect(() => {
    // Reload categories when the form is successfully submitted
    // This ensures new categories are available in the dropdown
    if (!loading && !isSubmitting) {
      // Categories will be refreshed by the parent component
    }
  }, [loading, isSubmitting])

  const handleFormSubmit: SubmitHandler<CreateProductData> = async (data) => {
    // Client-side validation
    const validationErrors = validateProductForm(data)
    if (Object.keys(validationErrors).length > 0) {
      // Handle validation errors if needed
      return
    }

    try {
      await onSubmit(data)
      // After successful submission, the parent component should refresh categories
      // This ensures that any new categories created are available in future forms
    } catch (error) {
      // Error handling is done in the hook
      console.error("Form submission error:", error)
    }
  }

  const isFormLoading = loading || isSubmitting

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Nome do Produto *"
        {...register("name", {
          required: "Nome é obrigatório",
          minLength: { value: 2, message: "Nome deve ter pelo menos 2 caracteres" },
          maxLength: { value: 100, message: "Nome deve ter no máximo 100 caracteres" },
        })}
        error={errors.name?.message}
        disabled={isFormLoading}
        autoComplete="off"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          {...register("description", {
            maxLength: { value: 1000, message: "Descrição deve ter no máximo 1000 caracteres" },
          })}
          rows={3}
          className="input-field resize-none"
          placeholder="Descrição do produto (opcional)"
          disabled={isFormLoading}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <Input
        label="Preço (em centavos) *"
        type="number"
        min="0"
        step="1"
        {...register("price", {
          required: "Preço é obrigatório",
          min: { value: 0, message: "Preço deve ser maior ou igual a 0" },
          max: { value: 999999999, message: "Preço muito alto" },
          valueAsNumber: true,
        })}
        error={errors.price?.message}
        disabled={isFormLoading}
        placeholder="Ex: 2999 para R$ 29,99"
        autoComplete="off"
      />

      <Select
        label="Categoria *"
        value={watchedCategory}
        onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
        options={categoryOptions}
        allowCustom={true}
        error={errors.category?.message}
        disabled={isFormLoading}
      />

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isFormLoading}>
          Cancelar
        </Button>
        <Button type="submit" loading={isFormLoading} disabled={isFormLoading}>
          {product ? "Atualizar" : "Criar"} Produto
        </Button>
      </div>
    </form>
  )
}
