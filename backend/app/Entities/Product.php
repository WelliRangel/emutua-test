<?php

namespace App\Entities;

use Doctrine\ORM\Mapping as ORM;

/**
 * Product entity.
 */
#[ORM\Entity(repositoryClass: \App\Repositories\ProductRepository::class)]
#[ORM\Table(name: "products")]
class Product
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string")]
    private string $name;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: "decimal", precision: 10, scale: 2)]
    private string $price;

    #[ORM\Column(type: "string")]
    private string $category;

    /**
     * Product constructor.
     * Torna obrigatório os campos essenciais.
     */
    public function __construct(
        string $name,
        string|float $price,
        string $category,
        ?string $description = null
    ) {
        $this->setName($name);
        $this->setPrice($price);
        $this->setCategory($category);
        $this->setDescription($description);
    }

    /**
     * Get the product ID.
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Get the product name.
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Set the product name.
     */
    public function setName(string $name): void
    {
        if (trim($name) === '') {
            throw new \InvalidArgumentException('O nome do produto não pode ser vazio.');
        }
        $this->name = $name;
    }

    /**
     * Get the product description.
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * Set the product description.
     */
    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    /**
     * Get the product price as float.
     */
    public function getPrice(): float
    {
        return (float)$this->price;
    }

    /**
     * Set the product price.
     */
    public function setPrice(string|float $price): void
    {
        $price = (float)$price;
        if ($price < 0) {
            throw new \InvalidArgumentException('O preço não pode ser negativo.');
        }
        // Armazene como string para o Doctrine
        $this->price = number_format($price, 2, '.', '');
    }

    /**
     * Get the product category.
     */
    public function getCategory(): string
    {
        return $this->category;
    }

    /**
     * Set the product category.
     */
    public function setCategory(string $category): void
    {
        if (trim($category) === '') {
            throw new \InvalidArgumentException('A categoria não pode ser vazia.');
        }
        $this->category = $category;
    }
}