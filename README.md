# 🌌 Nexus Hub - Forum API

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-272C36?style=for-the-badge&logo=vitest&logoColor=729B1B)

Uma API RESTful robusta para um fórum de perguntas e respostas. Desenvolvida com foco em manutenibilidade, performance e testes, aplicando rigorosamente os conceitos de **Clean Architecture** e **Domain-Driven Design (DDD)**.

---

## ✨ Funcionalidades

- **Autenticação e Autorização:**
  - Criação de conta de usuário com hash de senhas (Bcrypt).
  - Autenticação de usuários e geração de token JWT usando chaves assimétricas (RS256).
- **Gestão de Fórum:**
  - Criação de novas perguntas vinculadas ao usuário autenticado.
  - Listagem de perguntas mais recentes com paginação.
- **Validação:** Validação rigorosa de dados de entrada e variáveis de ambiente usando Zod.

## 🛠️ Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Validação:** [Zod](https://zod.dev/)
- **Autenticação:** [Passport](https://docs.nestjs.com/security/authentication) + JWT
- **Testes:** [Vitest](https://vitest.dev/) (Unitários) + Supertest (E2E) + [SWC](https://swc.rs/)

## 🏗️ Arquitetura (Clean Architecture & DDD)

O projeto é estruturado para isolar as regras de negócio de frameworks e bibliotecas externas:

- **Domain:** Entidades puras, Value Objects e regras de negócio essenciais (Independente de tecnologia externa).
- **Application:** Casos de uso (Use Cases) que orquestram o domínio.
- **Infrastructure:** Controladores (Controllers), Módulos do NestJS, implementação de repositórios (Prisma), estratégias de autenticação e validações.

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (v18+)
- PNPM
- Docker & Docker Compose (para o PostgreSQL)
- OpenSSL (para gerar as chaves JWT)

### Passos

1. **Clone o repositório:**

   ```bash
   git clone [https://github.com/seu-usuario/nexus-hub.git](https://github.com/seu-usuario/nexus-hub.git)
   cd nexus-hub
   ```

2. **Instale dependências:**

   ```bash
     pnpm install
   ```

3. **Configuração das Variáveis de Ambiente:**

- Faça uma cópia do .env.example para .env.
- Gere suas chaves privadas e públicas (RSA-256) em Base64 e adicione ao arquivo .env junto com a URL de conexão do seu banco de dados

4. **Suba o Banco de Dados:**

```bash
  docker-compose up -d
```

5. **Rode as Migrations do Prisma:**

```bash
  pnpm prisma migrate dev
```

5. **Inicie a Aplicação:**

```bash
  pnpm start:dev
```

A API estará rodando em http://localhost:3333.

## 🧪 Testes

O projeto possui uma infraestrutura completa de testes, garantindo a integridade desde os casos de uso até as rotas HTTP com bancos de dados isolados.

```bash
# Executar testes unitários (Casos de Uso e Domínio)
pnpm test

# Executar testes End-to-End (E2E - Controladores e Banco de Dados)
pnpm test:e2e
```

Desenvolvido com dedicação para estudos de arquitetura de software avançada.
