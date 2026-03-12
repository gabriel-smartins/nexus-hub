<div align="center">

# 🌌 Nexus Hub

**Uma API RESTful robusta para fórum de perguntas e respostas**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vitest](https://img.shields.io/badge/Vitest-272C36?style=flat-square&logo=vitest&logoColor=FCC72B)](https://vitest.dev/)

</div>

---

## Sobre o Projeto

O **Nexus Hub** é uma API de fórum desenvolvida com foco rigoroso em arquitetura de software. O objetivo vai além das funcionalidades: cada decisão técnica foi tomada para demonstrar na prática os princípios de **Clean Architecture**, **Domain-Driven Design (DDD)** e **SOLID**.

A aplicação mantém as regras de negócio completamente isoladas de frameworks, bancos de dados e qualquer dependência de infraestrutura — o que garante alta testabilidade, manutenibilidade e facilidade de evolução.

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Endpoints da API](#endpoints-da-api)
- [Como Executar](#como-executar)
- [Testes](#testes)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## Funcionalidades

### Autenticação e Segurança

- Registro de usuários com hash seguro de senha via **Bcrypt**
- Login com geração de token **JWT** usando criptografia assimétrica **RS256**
- Proteção de rotas via guards de autenticação do NestJS
- Validação de todas as entradas e variáveis de ambiente com **Zod**

### Fórum

- Criação, edição e exclusão de perguntas vinculadas ao usuário autenticado
- Listagem das perguntas mais recentes com **paginação**
- Busca de detalhes completos de uma pergunta pelo **slug**
- Criação, edição e exclusão de respostas a perguntas
- Listagem de respostas por pergunta
- Marcação de uma resposta como **a melhor** pelo autor da pergunta
- Criação, listagem e exclusão de comentários em perguntas e respostas
- Upload de **anexos** vinculados a perguntas ou respostas
- Sistema de **notificações** com marcação de leitura

---

## Arquitetura

O projeto segue **Clean Architecture** estruturada em três camadas, com dependências sempre apontando para dentro — da infraestrutura para o domínio, nunca o contrário.

```
┌──────────────────────────────────────────────────────────┐
│                      Infrastructure                      │
│   Controllers · NestJS Modules · Prisma Repositories     │
│            JWT Strategies · Zod Pipes                    │
│                                                          │
│   ┌──────────────────────────────────────────────────┐   │
│   │                  Application                     │   │
│   │              Use Cases (Services)                │   │
│   │                                                  │   │
│   │   ┌──────────────────────────────────────────┐   │   │
│   │   │                  Domain                  │   │   │
│   │   │   Entities · Value Objects · Interfaces  │   │   │
│   │   │        (zero external dependencies)      │   │   │
│   │   └──────────────────────────────────────────┘   │   │
│   └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

**Domain** — Entidades puras (ex: `Question`, `User`) e Value Objects sem nenhuma dependência externa. É o núcleo imutável da aplicação.

**Application** — Casos de uso que orquestram o domínio. Dependem apenas de interfaces, nunca de implementações concretas (inversão de dependência).

**Infrastructure** — Adaptadores que conectam o mundo externo ao núcleo: controllers HTTP, repositórios Prisma, estratégias JWT. Implementa as interfaces definidas na camada de aplicação.

### Padrões Avançados

Além da divisão em camadas, o projeto aplica padrões avançados de engenharia de software:

- **CQRS (Command Query Responsibility Segregation):** Separação clara entre modelos de mutação (Entidades puras) e modelos de leitura (Value Objects ricos), otimizando a performance e a complexidade das consultas ao banco de dados.
- **Domain Events:** Arquitetura orientada a eventos, criando um ecossistema reativo e totalmente desacoplado. Ações paralelas, como o envio de notificações, ocorrem em _background_ ouvindo eventos de domínio, garantindo que o fluxo principal da requisição HTTP não seja bloqueado ou atrasado.

---

## Tecnologias

| Categoria       | Tecnologia                 |
| --------------- | -------------------------- |
| Linguagem       | TypeScript (Strict Mode)   |
| Framework       | NestJS                     |
| Banco de Dados  | PostgreSQL                 |
| ORM             | Prisma                     |
| Armazenamento   | Cloudflare R2 (API S3)     |
| Autenticação    | Passport.js · JWT RS256    |
| Hash de Senha   | Bcrypt                     |
| Validação       | Zod                        |
| Testes          | Vitest · Supertest         |
| Transpilação    | SWC (builds ultrarrápidos) |
| Containerização | Docker · Docker Compose    |
| Package Manager | PNPM                       |

---

## Endpoints da API

> **Autenticação:** Bearer Token JWT no header `Authorization`.  
> **Paginação:** via query param `?page=1`.

### Autenticação

| Método | Rota        | Descrição                    | Auth |
| ------ | ----------- | ---------------------------- | ---- |
| POST   | `/accounts` | Criação de conta de usuário  | ❌   |
| POST   | `/sessions` | Login e geração do token JWT | ❌   |

### Perguntas

| Método | Rota               | Descrição                                 | Auth |
| ------ | ------------------ | ----------------------------------------- | ---- |
| POST   | `/questions`       | Criar uma nova pergunta                   | ✅   |
| GET    | `/questions`       | Listar perguntas recentes (paginado)      | ✅   |
| GET    | `/questions/:slug` | Buscar detalhes completos de uma pergunta | ✅   |
| PUT    | `/questions/:id`   | Editar uma pergunta                       | ✅   |
| DELETE | `/questions/:id`   | Deletar uma pergunta                      | ✅   |

### Respostas

| Método | Rota                                | Descrição                        | Auth |
| ------ | ----------------------------------- | -------------------------------- | ---- |
| POST   | `/questions/:questionId/answers`    | Responder a uma pergunta         | ✅   |
| GET    | `/questions/:questionId/answers`    | Listar respostas de uma pergunta | ✅   |
| PUT    | `/answers/:id`                      | Editar uma resposta              | ✅   |
| DELETE | `/answers/:id`                      | Deletar uma resposta             | ✅   |
| PATCH  | `/answers/:answerId/choose-as-best` | Marcar resposta como a melhor    | ✅   |

### Comentários

| Método | Rota                              | Descrição                          | Auth |
| ------ | --------------------------------- | ---------------------------------- | ---- |
| POST   | `/questions/:questionId/comments` | Comentar em uma pergunta           | ✅   |
| GET    | `/questions/:questionId/comments` | Listar comentários de uma pergunta | ✅   |
| DELETE | `/questions/comments/:id`         | Deletar comentário de uma pergunta | ✅   |
| POST   | `/answers/:answerId/comments`     | Comentar em uma resposta           | ✅   |
| GET    | `/answers/:answerId/comments`     | Listar comentários de uma resposta | ✅   |
| DELETE | `/answers/comments/:id`           | Deletar comentário de uma resposta | ✅   |

### Notificações e Anexos

| Método | Rota                                  | Descrição                        | Auth |
| ------ | ------------------------------------- | -------------------------------- | ---- |
| PATCH  | `/notifications/:notificationId/read` | Marcar notificação como lida     | ✅   |
| POST   | `/attachments`                        | Fazer upload de um arquivo/anexo | ✅   |

---

## Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [PNPM](https://pnpm.io/)
- [Docker & Docker Compose](https://www.docker.com/)
- [OpenSSL](https://www.openssl.org/)

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/gabriel-smartins/nexus-hub.git
cd nexus-hub
```

**2. Instale as dependências**

```bash
pnpm install
```

**3. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Gere o par de chaves RSA para autenticação JWT:

```bash
# Gerar chave privada
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048

# Extrair chave pública
openssl rsa -pubout -in private.pem -out public.pem

# Converter para Base64 e copiar para o .env
base64 -i private.pem
base64 -i public.pem
```

Preencha o `.env` com os valores gerados (veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente)).

**4. Suba o banco de dados com Docker**

```bash
docker-compose up -d
```

**5. Execute as migrations**

```bash
pnpm prisma migrate dev
```

**6. Inicie o servidor**

```bash
pnpm start:dev
```

A API estará disponível em `http://localhost:3333`.

---

## Testes

O projeto possui cobertura em duas camadas complementares:

```bash
# Testes unitários — Domínio e Casos de Uso
pnpm test

# Testes E2E — Rotas HTTP com banco de dados isolado
pnpm test:e2e
```

**Testes Unitários**  
Validam casos de uso e lógica de domínio com repositórios em memória (_in-memory repositories_). Sem banco de dados, sem HTTP — apenas a lógica de negócio isolada. Execução ultrarrápida via Vitest + SWC.

**Testes E2E**  
Sobem a aplicação completa com um banco de dados de teste dedicado e disparam requisições HTTP reais via Supertest, garantindo a integração correta entre todas as camadas.

---

## Estrutura de Pastas

```
nexus-hub/
│
├── prisma/
│   ├── schema.prisma          # Modelos do banco de dados
│   └── migrations/            # Histórico de migrations
│
├── src/
│   ├── domain/
│   │   ├── entities/          # Entidades e Value Objects
│   │   └── repositories/      # Interfaces dos repositórios
│   │
│   ├── application/
│   │   └── use-cases/         # Casos de uso da aplicação
│   │
│   └── infra/
│       ├── auth/              # Estratégias JWT e guards
│       ├── database/          # Módulo Prisma e repositórios concretos
│       └── http/              # Controllers, módulos e pipes Zod
│
├── test/
│   └── repositories/          # Repositórios in-memory para testes
│
├── docker-compose.yaml
├── .env.example
└── package.json
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

| Variável                | Descrição                                                               |
| ----------------------- | ----------------------------------------------------------------------- |
| `POSTGRES_USER`         | Nome de usuário do PostgreSQL (usado para subir o container Docker)     |
| `POSTGRES_PASSWORD`     | Senha do PostgreSQL (usada para subir o container Docker)               |
| `POSTGRES_DB`           | Nome do banco de dados PostgreSQL (usado para subir o container Docker) |
| `DATABASE_URL`          | String de conexão completa com o PostgreSQL (usada pelo Prisma)         |
| `PORT`                  | Porta em que o servidor HTTP da API vai rodar (ex: 3333)                |
| `JWT_PRIVATE_KEY`       | Chave privada RSA em Base64 (usada para assinar os tokens JWT)          |
| `JWT_PUBLIC_KEY`        | Chave pública RSA em Base64 (usada para verificar os tokens JWT)        |
| `CLOUDFLARE_ACCOUNT_ID` | ID da sua conta no Cloudflare (necessário para a API do R2)             |
| `AWS_BUCKET_NAME`       | Nome do bucket de armazenamento (no Cloudflare R2 ou AWS S3)            |
| `AWS_ACCESS_KEY_ID`     | Chave de acesso pública da API de armazenamento (R2 / S3)               |
| `AWS_SECRET_ACCESS_KEY` | Chave secreta da API de armazenamento (R2 / S3)                         |

> ⚠️ Nunca versione o `.env` ou os arquivos `.pem`. Ambos estão listados no `.gitignore`.

---

<div align="center">

Desenvolvido com foco em arquitetura de software avançada e boas práticas de engenharia.

</div>
