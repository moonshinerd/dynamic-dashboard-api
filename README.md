# Dynamic Dashboard API

API RESTful dinâmica para servir dados de dashboard, com suporte a múltiplos tipos de gráfico e filtro obrigatório por período de datas.

## Stack

- **Node.js** + **TypeScript** (strict)
- **Express** — framework HTTP
- **Prisma** — ORM
- **MySQL** — banco de dados
- **Jest** + **Supertest** — testes
- **Swagger/OpenAPI 3.0** — documentação
- **Docker** + **docker-compose** — containerização

## Pré-requisitos

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) e Docker Compose
- (Opcional) MySQL 8.0 local, caso não use Docker

## Início Rápido com Docker

```bash
# Clonar o repositório
git clone <repo-url>
cd dynamic-dashboard-api

# Subir os serviços (MySQL + API)
docker-compose up --build

# Em outro terminal, rodar as migrations e seed
docker-compose exec api npx prisma migrate deploy
docker-compose exec api npx prisma db seed
```

A API estará disponível em `http://localhost:3000`.

## Desenvolvimento Local (sem Docker)

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com sua conexão MySQL

# Gerar o Prisma Client
npx prisma generate

# Rodar as migrations
npx prisma migrate dev

# Popular o banco com dados de exemplo
npx prisma db seed

# Iniciar em modo desenvolvimento
npm run dev
```

## Variáveis de Ambiente

| Variável       | Descrição                        | Padrão                                    |
|----------------|----------------------------------|-------------------------------------------|
| `DATABASE_URL` | Connection string do MySQL       | `mysql://root:root@localhost:3306/dashboard` |
| `PORT`         | Porta do servidor                | `3000`                                    |
| `NODE_ENV`     | Ambiente (`development`/`production`/`test`) | `development`                   |

## Endpoints

### `GET /api/v1/charts/:chartType`

Retorna dados formatados para o tipo de gráfico solicitado.

**Parâmetros:**

| Parâmetro   | Tipo   | Local | Obrigatório | Descrição                                      |
|-------------|--------|-------|-------------|-------------------------------------------------|
| `chartType` | string | path  | Sim         | Tipo do gráfico: `pie`, `line`, `bar`, `area`  |
| `startDate` | string | query | Sim         | Data início (YYYY-MM-DD)                        |
| `endDate`   | string | query | Sim         | Data fim (YYYY-MM-DD)                           |

**Exemplo:**

```bash
curl "http://localhost:3000/api/v1/charts/pie?startDate=2025-01-01&endDate=2025-12-31"
```

**Resposta (200):**

```json
{
  "data": {
    "labels": ["Electronics", "Clothing", "Food & Beverages"],
    "values": [125000.50, 48000.00, 22500.75]
  },
  "meta": {
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "chartType": "pie"
  }
}
```

### `GET /api/v1/health`

Health check do serviço.

**Resposta (200):**

```json
{ "status": "ok" }
```

### Documentação Swagger

Acesse `http://localhost:3000/api-docs` para a documentação interativa.

## Testes

```bash
# Todos os testes com cobertura
npm test

# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration
```

## Arquitetura

O projeto segue **Clean Architecture**:

```
src/
├── config/               # Variáveis de ambiente, Swagger
├── domain/               # Entidades e interfaces (zero dependências externas)
├── application/          # Casos de uso (regras de negócio)
├── infrastructure/       # Implementações concretas (Prisma, MySQL)
├── presentation/         # Controllers, rotas, middlewares, DTOs
├── shared/               # Erros customizados, utilitários
└── main.ts               # Bootstrap da aplicação
```

**Regra de dependência:** `presentation → application → domain`. Nenhuma camada interna conhece a externa.

## Tipos de Gráfico

| Tipo   | Formato dos dados                                                |
|--------|------------------------------------------------------------------|
| `pie`  | `labels` (categorias) + `values` (totais por categoria)         |
| `bar`  | `labels` (categorias) + `datasets` com valores por categoria    |
| `line` | `labels` (datas) + `datasets` com série temporal por categoria  |
| `area` | Mesmo formato de `line` (diferença é visual no frontend)        |
