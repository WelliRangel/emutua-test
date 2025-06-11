# Backend API — Laravel 12 + Doctrine ORM

## Visão Geral
API RESTful desenvolvida com Laravel 10 e Doctrine ORM, seguindo princípios de:
- **Separação de Camadas**: Controllers, Services, Repositories e Entities.
- **Injeção de Dependência**: Interfaces e contêiner de serviço do Laravel para abstração.
- **Padrões de Projeto**: Repository Pattern, Service Layer, Dependency Injection.

---

## Estrutura de Pastas

```
backend/
├── app/
│   ├── Controllers/      # HTTP Controllers
│   ├── Services/         # Lógica de negócio
│   ├── Repositories/     # Acesso a dados (Doctrine)
│   ├── Entities/         # Mapeamento ORM
│   └── Providers/        # Bindings de DI
├── config/
├── database/
│   └── migrations/
├── routes/
│   └── api.php
└── docker-compose.yml
```

---

## Principais Padrões e Boas Práticas

- **Repository Pattern**  
  Cada entidade possui um repositório que implementa uma interface, desacoplando regras de persistência.
- **Service Layer**  
  A lógica de negócio fica em Services que recebem Repositories via injeção de dependência.
- **Dependency Injection**  
  Registrado em `App\Providers\AppServiceProvider`:
  ```php
  $this->app->bind(
      \App\Repositories\ProductRepositoryInterface::class,
      \App\Repositories\DoctrineProductRepository::class
  );
  ```
- **Doctrine Migrations**  
  Separação clara entre definição de entidade e geração de schema:
  ```bash
  php artisan doctrine:migrations:diff
  php artisan doctrine:migrations:migrate
  ```

---

## Variáveis de Ambiente
Copie o `.env.example` e configure:
```bash
cp .env.example .env
# Ajuste DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, etc.
```

---

## Scripts Docker

```bash
# Build e sobe containers
docker compose up -d --build

# Entrar no container da API
docker exec -it laravel_app bash
```

---

## Endpoints de Produto

| Método | Rota                                     | Controller                          |
| ------ | ---------------------------------------- | ----------------------------------- |
| GET    | `/api/produtos`                          | ProductController@index             |
| GET    | `/api/produtos/search`                   | ProductController@search            |
| GET    | `/api/produtos/categorias`               | ProductController@categories        |
| GET    | `/api/produtos/categorias/{category}`    | ProductController@productsByCategory|
| GET    | `/api/produtos/{id}`                     | ProductController@show              |
| POST   | `/api/produtos`                          | ProductController@store             |
| PUT    | `/api/produtos/{id}`                     | ProductController@update            |
| DELETE | `/api/produtos/{id}`                     | ProductController@destroy           |

---

## Exemplos de Requisição (cURL)

- **Listar produtos**  
  ```bash
  curl -X GET http://localhost:8000/api/produtos
  ```
- **Buscar produtos**  
  ```bash
  curl -G http://localhost:8000/api/produtos/search --data-urlencode "q=palavra-chave"
  ```
- **Listar categorias**  
  ```bash
  curl -X GET http://localhost:8000/api/produtos/categorias
  ```
- **Produtos por categoria**  
  ```bash
  curl -X GET http://localhost:8000/api/produtos/categorias/eletronicos
  ```
- **Detalhar produto**  
  ```bash
  curl -X GET http://localhost:8000/api/produtos/123
  ```
- **Criar produto**  
  ```bash
  curl -X POST http://localhost:8000/api/produtos \
       -H "Content-Type: application/json" \
       -d '{"name":"Novo Produto","price":99.90}'
  ```
- **Atualizar produto**  
  ```bash
  curl -X PUT http://localhost:8000/api/produtos/123 \
       -H "Content-Type: application/json" \
       -d '{"price":89.90}'
  ```
- **Remover produto**  
  ```bash
  curl -X DELETE http://localhost:8000/api/produtos/123
  ```

---

