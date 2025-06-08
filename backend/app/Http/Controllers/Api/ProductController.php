<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private ProductService $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $page = max(1, (int) $request->query('page', 1));
        $limit = max(1, (int) $request->query('limit', 10));
        [$products, $total] = $this->service->list($page, $limit);

        return response()->json([
            'status' => true,
            'message' => 'Listar produtos',
            'data' => ProductResource::collection($products),
            'pagination' => [
                'total' => $total,
                'per_page' => $limit,
                'current_page' => $page,
                'last_page' => ceil($total / $limit),
            ],
        ]);
    }

    public function show(int $id)
    {
        $product = $this->service->get($id);
        if (!$product) {
            return response()->json(['status' => false, 'message' => 'Produto não encontrado'], 404);
        }
        return response()->json([
            'status' => true,
            'message' => 'Detalhes do produto',
            'data' => new ProductResource($product),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        try {
            $product = $this->service->create($request->validated());
            return response()->json([
                'status' => true,
                'message' => 'Produto criado com sucesso',
                'data' => new ProductResource($product),
            ], 201);
        } catch (\DomainException $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function update(UpdateProductRequest $request, int $id)
    {
        $product = $this->service->get($id);
        if (!$product) {
            return response()->json(['status' => false, 'message' => 'Produto não encontrado'], 404);
        }
        try {
            $product = $this->service->update($product, $request->validated());
            return response()->json([
                'status' => true,
                'message' => 'Produto atualizado com sucesso',
                'data' => new ProductResource($product),
            ]);
        } catch (\DomainException $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function destroy(int $id)
    {
        $product = $this->service->get($id);
        if (!$product) {
            return response()->json(['status' => false, 'message' => 'Produto não encontrado'], 404);
        }
        $this->service->delete($product);
        return response()->json(['status' => true, 'message' => 'Produto excluído com sucesso']);
    }

    public function search(Request $request)
    {
        $query = $request->query('q', '');
        $page = max(1, (int) $request->query('page', 1));
        $limit = max(1, (int) $request->query('limit', 10));
        [$products, $total] = $this->service->search($query, $page, $limit);

        return response()->json([
            'status' => true,
            'message' => 'Resultados da pesquisa',
            'data' => ProductResource::collection($products),
            'pagination' => [
                'total' => $total,
                'per_page' => $limit,
                'current_page' => $page,
                'last_page' => ceil($total / $limit),
            ],
        ]);
    }

    public function categories()
    {
        $categories = $this->service->categories();
        return response()->json([
            'status' => true,
            'message' => 'Categorias de produtos',
            'data' => $categories,
        ]);
    }

    public function productsByCategory(string $category)
    {
        $products = $this->service->productsByCategory($category);
        if (empty($products)) {
            return response()->json(['status' => false, 'message' => 'Nenhum produto encontrado para esta categoria'], 404);
        }
        return response()->json([
            'status' => true,
            'message' => 'Produtos na categoria: ' . $category,
            'data' => ProductResource::collection($products),
        ]);
    }
}