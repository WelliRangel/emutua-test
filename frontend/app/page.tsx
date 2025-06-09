"use client"
import { useEffect, useState } from "react"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProductForm } from "@/components/product-form"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../lib/product-api"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  stock?: number
  image?: string
  status?: "active" | "inactive"
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  })

  // Carregar produtos ao montar e ao mudar de página
  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts(page = 1) {
    setLoading(true)
    try {
      const res = await getProducts(page)
      setProducts(res.data)
      setPagination(res.pagination)
    } catch (e) {
      alert("Erro ao carregar produtos")
    }
    setLoading(false)
  }

  // Busca
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (searchTerm.trim() === "") {
        await fetchProducts()
      } else {
        const res = await searchProducts(searchTerm)
        setProducts(res.data)
        setPagination(res.pagination)
      }
    } catch {
      alert("Erro na busca")
    }
    setLoading(false)
  }

  // Adicionar produto
  async function handleAddProduct(productData: Omit<Product, "id">) {
    setLoading(true)
    try {
      await createProduct(productData)
      await fetchProducts()
      setIsFormOpen(false)
    } catch {
      alert("Erro ao adicionar produto")
    }
    setLoading(false)
  }

  // Editar produto
  async function handleEditProduct(productData: Omit<Product, "id">) {
    if (!editingProduct) return
    setLoading(true)
    try {
      await updateProduct(editingProduct.id, productData)
      await fetchProducts()
      setEditingProduct(null)
      setIsFormOpen(false)
    } catch {
      alert("Erro ao editar produto")
    }
    setLoading(false)
  }

  // Excluir produto
  async function handleDeleteProduct(id: string) {
    if (!confirm("Deseja realmente excluir?")) return
    setLoading(true)
    try {
      await deleteProduct(id)
      await fetchProducts()
    } catch {
      alert("Erro ao excluir produto")
    }
    setLoading(false)
  }

  // Paginação
  async function handlePageChange(page: number) {
    await fetchProducts(page)
  }

  // A API não retorna stock, image, status por padrão, então tratamos como opcionais
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">eMutua Digital</h1>
            </div>
            <div className="text-sm text-gray-500">Desafio Técnico by Wellington Rangel</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form className="relative flex-1" onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </form>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingProduct(null); setIsFormOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700 h-11">
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <ProductForm
                product={editingProduct}
                onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Package className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Outras estatísticas podem ser adaptadas conforme os dados da API */}
        </div>

        {/* Products Grid */}
        {loading ? (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Carregando...</h3>
          </Card>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first product."}
            </p>
            {!searchTerm && (
              <Button onClick={() => { setEditingProduct(null); setIsFormOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-3 right-3 ${product.status === "active"
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }`}>
                    {product.status || "active"}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      R$ {(product.price / 100).toFixed(2)}
                    </span>
                    <span className={`text-sm font-medium ${product.stock && product.stock < 20 ? "text-orange-600" : "text-emerald-600"}`}>
                      {product.stock ?? "-"} in stock
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditingProduct(product); setIsFormOpen(true) }} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Paginação */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: pagination.last_page }, (_, i) => (
            <Button
              key={i + 1}
              variant={pagination.current_page === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i + 1)}
              disabled={pagination.current_page === i + 1}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </main>
    </div>
  )
}