"use client"

import type { ReactNode } from "react"
import { Package, Plus } from "lucide-react"
import Button from "../atoms/Button"

interface DashboardLayoutProps {
  children: ReactNode
  onCreateProduct: () => void
}

export default function DashboardLayout({ children, onCreateProduct }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Product CMS</h1>
            </div>
            <Button onClick={onCreateProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
