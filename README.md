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

## Desenvolvimento com Docker (recomendado)

A forma mais rápida de subir o projeto completo (MySQL + API + migrations + seed):

```bash
# Clonar o repositório
git clone https://github.com/moonshinerd/dynamic-dashboard-api.git
cd dynamic-dashboard-api

# Subir tudo com um único comando
docker-compose -f docker-compose.dev.yml up --build
```

Isso irá:
1. Subir o MySQL 8.0
2. Rodar as migrations (`prisma migrate deploy`)
3. Popular o banco com dados de exemplo (`prisma db seed`)
4. Iniciar a API em modo desenvolvimento

A API estará disponível em `http://localhost:3000`.

Para derrubar os serviços:

```bash
docker-compose -f docker-compose.dev.yml down
```

Para derrubar e apagar os dados do banco (volume):

```bash
docker-compose -f docker-compose.dev.yml down -v
```

## Desenvolvimento Local (sem Docker)

Requer um MySQL 8.0 rodando localmente.

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

## Produção com Docker

```bash
docker-compose up --build
```

Usa o `Dockerfile` multi-stage (build TypeScript → roda a partir de `dist/`).

## Testes

Os testes não precisam de MySQL — o repositório é mockado. Basta ter as dependências instaladas:

```bash
# Instalar dependências (se ainda não fez)
npm install

# Gerar o Prisma Client (necessário para os tipos)
npx prisma generate

# Rodar todos os testes com relatório de cobertura
npm test
```

Para rodar separadamente:

```bash
# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration
```

### Cobertura

O projeto exige no mínimo **80%** de cobertura. Ao rodar `npm test`, o relatório é gerado na pasta `coverage/`.

## Variáveis de Ambiente

| Variável       | Descrição                                    | Padrão                                       |
|----------------|----------------------------------------------|----------------------------------------------|
| `DATABASE_URL` | Connection string do MySQL                   | `mysql://root:root@localhost:3306/dashboard`  |
| `PORT`         | Porta do servidor                            | `3000`                                       |
| `NODE_ENV`     | Ambiente (`development`/`production`/`test`) | `development`                                |

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

**Resposta de erro (400):**

```json
{
  "error": {
    "message": "startDate is required",
    "code": "VALIDATION_ERROR"
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

Acesse `http://localhost:3000/api-docs` para a documentação interativa dos endpoints.

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

## Scripts disponíveis

| Comando                  | Descrição                                    |
|--------------------------|----------------------------------------------|
| `npm run dev`            | Inicia em modo desenvolvimento (ts-node)     |
| `npm run build`          | Compila TypeScript para `dist/`              |
| `npm start`              | Inicia a partir do build (`dist/main.js`)    |
| `npm test`               | Roda todos os testes com cobertura           |
| `npm run test:unit`      | Roda apenas testes unitários                 |
| `npm run test:integration` | Roda apenas testes de integração           |
| `npm run lint`           | Verifica erros de tipagem (tsc --noEmit)     |
