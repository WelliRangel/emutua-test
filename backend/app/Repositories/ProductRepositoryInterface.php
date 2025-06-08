<?php

namespace App\Repositories;

use App\Entities\Product;

interface ProductRepositoryInterface
{
    public function findById(int $id): ?Product;
    public function findByNameAndCategory(string $name, string $category): ?Product;
    public function searchByNameOrDescription(string $query, int $offset, int $limit): array;
    public function countByNameOrDescription(string $query): int;
    public function getDistinctCategories(): array;
    public function findBy(array $criteria, $orderBy = null, $limit = null, $offset = null): array;
    public function save(Product $product): void;
    public function remove(Product $product): void;
    public function count(array $criteria): int;
}
