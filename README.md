# Monorepo Fullstack — Laravel & Next.js

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)]()

## Descrição

Disponível em https://content-management-system-product.vercel.app/

Este repositório contém um monorepo fullstack dividido em dois projetos:

- **Backend**: API REST desenvolvida em PHP 8.2 com Laravel 10 e Doctrine ORM.  
- **Frontend**: Aplicação web em React, utilizando Next.js para renderização híbrida (SSR/SSG).

A orquestração do ambiente de desenvolvimento e produção é feita através de containers Docker, com Docker Compose gerenciando serviços como API, banco de dados MySQL e demais dependências.

---

## 📑 Sumário

1. [Tecnologias Utilizadas](#tecnologias-utilizadas)  
2. [Pré-requisitos](#pré-requisitos)  
3. [Instalação](#instalação)  
4. [Configuração de Ambiente](#configuração-de-ambiente)  
5. [Comandos Úteis](#comandos-úteis)  
6. [Estrutura do Projeto](#estrutura-do-projeto)  
7. [Execução Local](#execução-local)  
8. [Testes](#testes)  
9. [Contribuição](#contribuição)  
10. [Licença](#licença)  
11. [Contato](#contato)

---

## Tecnologias Utilizadas

| Camada     | Tecnologia                 |
| ---------- | -------------------------- |
| Backend    | PHP 8.2, Laravel 10, Doctrine ORM |
| Banco de Dados | MySQL 8.0                 |
| Frontend   | Next.js (React), Node.js   |
| DevOps     | Docker, Docker Compose     |

---

## Pré-requisitos

- **Git** (v2.0 ou superior)  
- **Docker Engine** (v20.10 ou superior)  
- **Docker Compose** (v1.29 ou superior)

---

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/WelliRangel/emutua-test.git
   cd emutua-test
   ```

2. Crie e configure as variáveis de ambiente do backend:
   ```bash
   cp backend/.env.example backend/.env
   # Edite backend/.env conforme necessário (DB_HOST, DB_PORT, DB_USER, DB_PASS etc.)
   ```

---

## Configuração de Ambiente

O arquivo `docker-compose.yml` está localizado na raiz e define os seguintes serviços:

- **api**: Container Laravel + PHP-FPM  
- **db**: Container MySQL  
- **app**: Container Nginx (opcional, proxy reverso)  
- **frontend**: Container Next.js

---

## Comandos Úteis

| Comando                                                                                     | Descrição                                |
| ------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `docker compose up -d --build`                                                              | Builda imagens e inicia todos os serviços em background |
| `docker exec -it laravel_app php artisan key:generate`                                      | Gera e seta a `APP_KEY` no `.env`        |
| `docker exec -it laravel_app php artisan doctrine:migrations:diff`                          | Cria nova migration a partir das entidades |
| `docker exec -it laravel_app php artisan doctrine:migrations:migrate`                       | Executa migrations pendentes no banco    |
| `docker compose down -v`                                                                    | Para e remove containers e volumes       |

---

## Estrutura do Projeto

```
/
├── backend/          # API Laravel + Doctrine
│   ├── .env.example
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── docker-compose.yml
│   └── artisan
└── frontend/         # Next.js
    ├── public/
    ├── src/
    ├── package.json
    └── next.config.js
```

---

## Execução Local

Após a configuração de ambiente:

```bash
# No diretório raiz
docker compose up -d --build

# Gere a chave de aplicação
docker exec -it laravel_app php artisan key:generate

# Crie e aplique migrations
docker exec -it laravel_app php artisan doctrine:migrations:diff
docker exec -it laravel_app php artisan doctrine:migrations:migrate
```

- API disponível em: `http://localhost:8000`  
- Frontend disponível em: `http://localhost:3000`

---

## Testes

> **Em desenvolvimento:**  
> - Testes unitários e de integração ainda serão adicionados neste monorepo.

---

## Contribuição

1. Faça um fork deste repositório  
2. Crie uma branch feature: `git checkout -b feature/nome-da-feature`  
3. Faça commit das suas alterações: `git commit -m 'Adiciona nova feature'`  
4. Envie para o repositório remoto: `git push origin feature/nome-da-feature`  
5. Abra um Pull Request descrevendo suas alterações

---

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

## Contato

- **Autor**: Wellington Rangel  
- **E-mail**: wellirangel.dev@gmail.com  
- **LinkedIn**: https://www.linkedin.com/in/wellington-rangel/

---
