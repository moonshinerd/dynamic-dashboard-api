# Maintenance KPI Dashboard API

API RESTful para indicadores de performance (KPIs) de manutenção agrupados por família de equipamentos.

## Stack

- **Node.js** + **TypeScript** (strict)
- **NestJS** — framework HTTP com injeção de dependência
- **Prisma** — ORM com `$queryRaw` para SQL puro
- **MySQL** — banco de dados (DigitalOcean)
- **Passport / JWT** — autenticação
- **Zod** — validação de inputs
- **Jest** — testes unitários e de integração

---

## Instalação

```bash
npm install
npx prisma generate
```

Copie `.env.example` para `.env` e ajuste as variáveis.

---

## Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build && npm start
```

A documentação interativa (Swagger) fica disponível em: `http://localhost:3000/api/docs`

---

## Testes

```bash
npm test                          # todos os testes com cobertura
npm run test:unit                 # apenas unitários
npm run test:integration          # apenas integração
```

---

## Autenticação

A API usa JWT. Obtenha um token antes de chamar rotas protegidas:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@smartnew.com",
  "password": "smartnew2024"
}
```

Resposta:
```json
{ "access_token": "<jwt>" }
```

Use o token no header:
```
Authorization: Bearer <jwt>
```

---

## Endpoint Principal

### `GET /maintenance/reports/performance-indicator`

Retorna KPIs de manutenção agrupados por família de equipamentos para o cliente autenticado.

**Requer autenticação.**

#### Query Parameters

| Parâmetro        | Tipo   | Obrigatório | Descrição                                      |
|------------------|--------|-------------|------------------------------------------------|
| `startDate`      | DATE   | Não         | Início do período (`YYYY-MM-DD`). Default: 30 dias atrás |
| `endDate`        | DATE   | Não         | Fim do período (`YYYY-MM-DD`). Default: hoje   |
| `typeMaintenance`| STRING | Não         | IDs de tipo de manutenção separados por vírgula (ex: `"1,2,3"`) |
| `chartType`      | STRING | Não         | Formato da resposta: `table` (padrão), `pie`, `bar`, `line` |

#### Formatos de Gráfico (`chartType`)

| Tipo | Descrição | Estrutura |
|------|-----------|-----------|
| `table` | Tabela (padrão) | Array de objetos com todos os campos |
| `pie` | Gráfico de pizza — proporção de paradas por família | `{ labels, datasets: [{ label: "Paradas", data }] }` |
| `bar` | Gráfico de barras — KPIs por família | `{ labels, datasets: [{ label: "DF (%)", data }, { label: "MTBF (h)", data }, { label: "MTTR (h)", data }] }` |
| `line` | Gráfico de linhas — tempo previsto vs corretiva | `{ labels, datasets: [{ label: "Tempo Previsto (h)", data }, { label: "Tempo Corretiva (h)", data }] }` |

#### Resposta

```json
{
  "success": true,
  "data": [
    {
      "Familia": "COMPRESSORES",
      "DF": 85.50,
      "MTBF": 120.5,
      "MTTR": 4.2,
      "Paradas": 15,
      "tempo_prev": 1800,
      "tempo_corretiva": 63
    }
  ]
}
```

#### Campos

| Campo            | Descrição                                               |
|------------------|---------------------------------------------------------|
| `Familia`        | Nome da família de equipamentos                         |
| `DF`             | Disponibilidade Física (%) — `((tempo_prev - tempo_corretiva) / tempo_prev) * 100` |
| `MTBF`           | Tempo médio entre falhas (h) — `(tempo_prev - tempo_corretiva) / Paradas` |
| `MTTR`           | Tempo médio para reparo (h) — `tempo_corretiva / Paradas` |
| `Paradas`        | Quantidade de paradas no período                        |
| `tempo_prev`     | Tempo previsto de funcionamento (h), da escala de trabalho |
| `tempo_corretiva`| Tempo de manutenção (h), da soma das paradas            |

> **Nota:** quando `Paradas = 0`, o divisor usado é `1` para evitar divisão por zero.

---

## Estrutura do Projeto

```
src/
├── app.module.ts                    # Módulo raiz
├── main.ts                          # Bootstrap NestJS
├── config/
│   └── env.ts                       # Validação de env vars com Zod
├── prisma/
│   ├── prisma.module.ts             # Módulo global Prisma
│   └── prisma.service.ts            # PrismaClient como serviço NestJS
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts           # POST /auth/login
│   ├── auth.service.ts              # Validação de credenciais + geração JWT
│   ├── auth.guard.ts                # JwtAuthGuard (AuthGuard('jwt'))
│   ├── jwt.strategy.ts              # Estratégia Passport JWT
│   └── dto/login.dto.ts             # Schema Zod para login
├── maintenance/
│   ├── maintenance.module.ts
│   ├── maintenance.controller.ts    # GET /maintenance/reports/performance-indicator
│   ├── maintenance.service.ts       # Cálculo dos KPIs
│   ├── dto/
│   │   └── performance-indicator-query.dto.ts  # Schema Zod para query params
│   └── repositories/
│       ├── maintenance.repository.interface.ts  # Contrato do repositório
│       └── prisma-maintenance.repository.ts     # SQL puro via $queryRaw
└── shared/
    ├── pipes/zod-validation.pipe.ts  # Pipe genérico de validação Zod
    └── errors/app-error.exception.ts # Exceção HTTP customizada
```

---

## Lógica do SQL (Repositório)

O cálculo usa as tabelas:

- **`cadastro_de_familias_de_equipamento`** → agrupamento por família
- **`cadastro_de_equipamentos`** → filtra por `id_cliente` do usuário autenticado
- **`sofman_prospect_escala_trabalho`** → `TIMEDIFF(termino, inicio)` → `tempo_prev`
- **`sofman_apontamento_paradas`** → `TIMESTAMPDIFF(SECOND, data_hora_stop, data_hora_start)` → `tempo_corretiva`
- **`controle_de_ordens_de_servico`** → filtro opcional por `tipo_manutencao`

Os KPIs são calculados em memória no `MaintenanceService` após o retorno do repositório.
