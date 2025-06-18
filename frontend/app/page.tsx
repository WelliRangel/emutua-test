"use client"

import { useEffect, useState, useCallback } from "react"
import { useProducts } from "./hooks/useProducts"
import type { Product } from "./types/product"
import DashboardLayout from "./components/templates/DashboardLayout"
import SearchBar from "./components/molecules/SearchBar"
import CategoryFilter from "./components/molecules/CategoryFilter"
import ProductTable from "./components/organisms/ProductTable"
import ProductCard from "./components/molecules/ProductCard"
import Pagination from "./components/molecules/Pagination"
import Modal from "./components/atoms/Modal"
import ProductForm from "./components/organisms/ProductForm"
import ProductDetails from "./components/organisms/ProductDetails"
import ConfirmDialog from "./components/molecules/ConfirmDialog"
import Button from "./components/atoms/Button"
import { Grid, List } from "lucide-react"

export default function Home() {
  const {
    products,
    categories,
    currentProduct,
    loading,
    pagination,
    filters,
    loadProducts,
    searchProducts,
    loadCategories,
    filterByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    clearFilters,
  } = useProducts()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Load initial data
  useEffect(() => {
    loadProducts()
    loadCategories()
  }, []) // Empty dependency array - only run on mount

  const handleSearch = useCallback(
    (query: string) => {
      searchProducts(query)
    },
    [searchProducts],
  )

  const handleCategoryFilter = useCallback(
    (category: string) => {
      if (category) {
        filterByCategory(category)
      } else {
        clearFilters()
      }
    },
    [filterByCategory, clearFilters],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      if (filters.search) {
        searchProducts(filters.search, page)
      } else if (filters.category) {
        filterByCategory(filters.category, page)
      } else {
        loadProducts(page)
      }
    },
    [filters.search, filters.category, searchProducts, filterByCategory, loadProducts],
  )

  const handleViewProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
    setShowDetailsModal(true)
  }, [])

  const handleEditProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
    setShowEditModal(true)
  }, [])

  const handleDeleteProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
    setShowDeleteDialog(true)
  }, [])

  const handleCreateSubmit = useCallback(
    async (data: any) => {
      await createProduct(data)
      setShowCreateModal(false)
      // Refresh the current view
      if (filters.search) {
        searchProducts(filters.search)
      } else if (filters.category) {
        filterByCategory(filters.category)
      } else {
        loadProducts()
      }
    },
    [createProduct, filters, searchProducts, filterByCategory, loadProducts],
  )

  const handleEditSubmit = useCallback(
    async (data: any) => {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, data)
        setShowEditModal(false)
        setSelectedProduct(null)
        // Refresh the current view
        if (filters.search) {
          searchProducts(filters.search)
        } else if (filters.category) {
          filterByCategory(filters.category)
        } else {
          loadProducts()
        }
      }
    },
    [selectedProduct, updateProduct, filters, searchProducts, filterByCategory, loadProducts],
  )

  const handleConfirmDelete = useCallback(async () => {
    if (selectedProduct) {
      setDeleteLoading(true)
      try {
        await deleteProduct(selectedProduct.id)
        setShowDeleteDialog(false)
        setSelectedProduct(null)
      } finally {
        setDeleteLoading(false)
      }
    }
  }, [selectedProduct, deleteProduct])

  const handleClearSearch = useCallback(() => {
    clearFilters()
  }, [clearFilters])

  return (
    <DashboardLayout onCreateProduct={() => setShowCreateModal(true)}>
      <div className="space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} value={filters.search} />
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategory={filters.category}
            onCategoryChange={handleCategoryFilter}
            loading={loading}
          />
          <div className="flex gap-2">
            <Button
              variant={viewMode === "table" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.search || filters.category) && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Filtros ativos:</span>
            {filters.search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Busca: {filters.search}</span>
            )}
            {filters.category && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Categoria: {filters.category}</span>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        )}

        {/* Products Display */}
        {viewMode === "table" ? (
          <ProductTable
            products={products}
            loading={loading}
            onView={handleViewProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleViewProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Criar Novo Produto" size="lg">
        <ProductForm
          categories={categories}
          onSubmit={handleCreateSubmit}
          onCancel={() => setShowCreateModal(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedProduct(null)
        }}
        title="Editar Produto"
        size="lg"
      >
        {selectedProduct && (
          <ProductForm
            product={selectedProduct}
            categories={categories}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setShowEditModal(false)
              setSelectedProduct(null)
            }}
            loading={loading}
          />
        )}
      </Modal>

      {/* Product Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedProduct(null)
        }}
        title="Detalhes do Produto"
        size="xl"
      >
        {selectedProduct && <ProductDetails product={selectedProduct} />}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setSelectedProduct(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o produto "${selectedProduct?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        loading={deleteLoading}
      />
    </DashboardLayout>
  )
}
