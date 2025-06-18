"use client"

import type { Product } from "../../types/product"
import { Eye, Edit, Trash2 } from "lucide-react"
import Button from "../atoms/Button"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductCard({ product, onView, onEdit, onDelete }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100)
  }

  return (
    <div className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden p-0">
      <div className="flex flex-col h-full">
        {/* Product Image - Prominently Featured */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden group">
          {product.image ? (
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              crossOrigin="anonymous"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center p-6">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-gray-500 font-medium">Sem imagem</p>
              </div>
            </div>
          )}

          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(product)}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 shadow-lg"
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver Detalhes
            </Button>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full shadow-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">{product.name}</h3>
            {product.description && (
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onEdit(product)} className="flex-1">
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(product)} className="px-3">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
