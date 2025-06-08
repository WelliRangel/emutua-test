<?php

namespace App\Services;

use App\Entities\Product;
use App\Repositories\ProductRepositoryInterface;

class ProductService
{
    private ProductRepositoryInterface $repo;

    public function __construct(ProductRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function list(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $total = $this->repo->count([]);
        $products = $this->repo->findBy([], null, $limit, $offset);
        return [$products, $total];
    }

    public function get(int $id): ?Product
    {
        return $this->repo->findById($id);
    }

    public function create(array $data): Product
    {
        if ($this->repo->findByNameAndCategory($data['name'], $data['category'])) {
            throw new \DomainException('Já existe um produto com este nome e categoria.');
        }

        $product = new Product(
            $data['name'],
            $data['price'],
            $data['category'],
            $data['description'] ?? null
        );

        $this->repo->save($product);

        return $product;
    }

    public function update(Product $product, array $data): Product
    {
        $name = $data['name'] ?? $product->getName();
        $category = $data['category'] ?? $product->getCategory();
        $existing = $this->repo->findByNameAndCategory($name, $category);

        if ($existing && $existing->getId() !== $product->getId()) {
            throw new \DomainException('Já existe um produto com este nome e categoria.');
        }

        if (isset($data['name'])) $product->setName($data['name']);
        if (isset($data['description'])) $product->setDescription($data['description']);
        if (isset($data['price'])) $product->setPrice($data['price']);
        if (isset($data['category'])) $product->setCategory($data['category']);

        $this->repo->save($product);

        return $product;
    }

    public function delete(Product $product): void
    {
        $this->repo->remove($product);
    }

    public function search(string $query, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $total = $this->repo->countByNameOrDescription($query);
        $products = $this->repo->searchByNameOrDescription($query, $offset, $limit);
        return [$products, $total];
    }

    public function categories(): array
    {
        return $this->repo->getDistinctCategories();
    }

    public function productsByCategory(string $category): array
    {
        return $this->repo->findBy(['category' => $category]);
    }
}