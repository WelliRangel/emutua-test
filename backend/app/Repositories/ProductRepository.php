<?php

namespace App\Repositories;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entities\Product;

class ProductRepository extends EntityRepository implements ProductRepositoryInterface
{
    private EntityManagerInterface $em;

    // O EntityManager é injetado para permitir persistência e remoção
    public function setEntityManager(EntityManagerInterface $em): void
    {
        $this->em = $em;
    }

    public function findByNameAndCategory(string $name, string $category): ?Product
    {
        return $this->findOneBy(['name' => $name, 'category' => $category]);
    }

    public function searchByNameOrDescription(string $query, int $offset, int $limit): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.name LIKE :query OR p.description LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function countByNameOrDescription(string $query): int
    {
        return (int) $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.name LIKE :query OR p.description LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getDistinctCategories(): array
    {
        $result = $this->createQueryBuilder('p')
            ->select('DISTINCT p.category')
            ->getQuery()
            ->getArrayResult();

        return array_column($result, 'category');
    }   //Remover // o método getDistinctCategories() se não for necessário

    public function findById(int $id): ?Product
    {
        return $this->find($id);
    }

    public function findBy(array $criteria, $orderBy = null, $limit = null, $offset = null): array
    {
        return parent::findBy($criteria, $orderBy, $limit, $offset);
    }

    public function save(Product $product): void
    {
        $this->em->persist($product);
        $this->em->flush();
    }

    public function remove(Product $product): void
    {
        $this->em->remove($product);
        $this->em->flush();
    }

    public function count(array $criteria = []): int
    {
        return parent::count($criteria);
    }
}
