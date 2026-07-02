# Study Platform

> 🇧🇷 [Português](#português) | 🇺🇸 [English](#english)

---

## Português

Plataforma de gerenciamento de estudos e produtividade com suporte a múltiplos workspaces colaborativos em tempo real, tarefas, metas, hábitos e sugestões geradas por IA.

### Tecnologias

**Frontend**

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- TanStack Query
- React Hook Form + Zod
- React Router
- Zustand
- Recharts
- Socket.IO Client

**Backend**

- Node.js + Express + TypeScript
- PostgreSQL
- JWT (access + refresh token)
- Zod
- Bcrypt
- Socket.IO
- Google Gemini API
- Pino (logs estruturados)
- Vitest

### Funcionalidades

**Autenticação e conta**

- Autenticação com JWT, access token de vida curta e refresh token com rotação
- Sair de todos os dispositivos e exclusão de conta com confirmação de senha
- Rate limiting em rotas de autenticação contra brute-force

**Workspaces colaborativos**

- Múltiplos workspaces por usuário, com papéis (owner, editor, viewer)
- Sistema de convites com aceitar/recusar, expiração de 15 dias e limite de recusas
- Notificações em tempo real via WebSocket quando um convite é recebido, cancelado, ou o usuário é removido
- CRUD de workspaces com soft delete

**Produtividade**

- Tarefas com toggle de conclusão, filtros e paginação
- Metas quantitativas e qualitativas com tracking de progresso
- Hábitos com streak de dias consecutivos
- Paginação em todas as listagens (tasks, goals, habits, members, workspaces)

**IA**

- Sugestão de metas, tarefas e hábitos geradas por IA (Google Gemini) a partir de uma descrição em texto livre
- Refinamento iterativo da sugestão antes de aceitar
- Aceitação seletiva de itens sugeridos

**Perfis e busca**

- Perfil de usuário com avatar, bio e troca de senha
- Busca de usuários por nome ou email
- Perfis públicos com analytics agregados de todos os workspaces

**Dashboard e UX**

- Dashboard com analytics e gráficos customizados
- Optimistic updates e cache configurado via TanStack Query
- Troca de tema claro/escuro/sistema
- Navegação por abas em estilo browser (workspaces abertos)
- Lazy loading de rotas e debounce em buscas

### Decisões de arquitetura

**Transactions** — a criação de um workspace envolve duas operações (criar o workspace e adicionar o dono como membro). Ambas são executadas dentro de uma transaction — se uma falhar, a outra é desfeita, evitando workspaces órfãos sem membros.

**Indexes** — antes de adicionar indexes, as queries principais foram analisadas com `EXPLAIN ANALYZE`. Com o volume atual de dados, sequential scans são mais rápidos que index scans nas tabelas `tasks`, `goals` e `habits` — adicionar indexes nelas agora adicionaria custo de manutenção sem benefício real. A tabela `workspace_members` recebeu um index composto em `(workspace_id, user_id)`, já que é consultada em toda requisição autenticada via middleware de autorização, independente do volume de dados.

**Refresh token com rotação** — cada uso do refresh token gera um novo par de tokens e invalida o anterior. Isso limita a janela de uso de um token roubado e permite detectar reuso indevido, sem exigir novo login enquanto o usuário estiver ativo.

**WebSocket com salas por usuário** — cada conexão Socket.IO entra numa sala nomeada `user:{id}`, permitindo emitir eventos direcionados a um usuário específico sem broadcast desnecessário.

**IA com schema estruturado** — as respostas do Gemini são forçadas a seguir um `responseSchema` definido, eliminando a necessidade de parsing frágil de texto livre e garantindo tipos consistentes.

**Logs estruturados** — erros de negócio (`AppError`, ex: senha incorreta, recurso não encontrado) não são logados como erro, apenas erros verdadeiramente inesperados (500) geram log com stack trace, evitando ruído em produção.

### Rodando o projeto

**Backend**

```bash
cd server
npm install
cp .env.example .env
# configure as variáveis de ambiente
npm run migrate
npm run migrate:owners
npm run migrate:members-index
npm run migrate:refresh-tokens
npm run migrate:invites
npm run dev
```

**Frontend**

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### Testes

```bash
cd server
npm test
```

### Variáveis de ambiente

Veja `server/.env.example` e `client/.env.example` para as variáveis necessárias.

---

## English

Productivity and study management platform with support for multiple real-time collaborative workspaces, tasks, goals, habits, and AI-generated suggestions.

### Tech Stack

**Frontend**

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- TanStack Query
- React Hook Form + Zod
- React Router
- Zustand
- Recharts
- Socket.IO Client

**Backend**

- Node.js + Express + TypeScript
- PostgreSQL
- JWT (access + refresh token with rotation)
- Zod
- Bcrypt
- Socket.IO
- Google Gemini API
- Pino (structured logging)
- Vitest

### Features

**Auth and account**

- JWT authentication with short-lived access tokens and rotating refresh tokens
- Logout from all devices and account deletion with password confirmation
- Rate limiting on auth routes against brute-force attacks

**Collaborative workspaces**

- Multiple workspaces per user, with roles (owner, editor, viewer)
- Invite system with accept/reject, 15-day expiration, and rejection limit
- Real-time WebSocket notifications for received/cancelled invites and member removal
- Workspace CRUD with soft delete

**Productivity**

- Tasks with completion toggle, filters and pagination
- Quantitative and qualitative goals with progress tracking
- Habits with consecutive day streak tracking
- Pagination across all listings (tasks, goals, habits, members, workspaces)

**AI**

- AI-generated goal, task and habit suggestions (Google Gemini) from a free-text description
- Iterative refinement before accepting a suggestion
- Selective acceptance of suggested items

**Profiles and search**

- User profile with avatar, bio and password change
- User search by name or email
- Public profiles with aggregated analytics across all workspaces

**Dashboard and UX**

- Dashboard with analytics and custom charts
- Optimistic updates and cache configuration via TanStack Query
- Light/dark/system theme toggle
- Browser-style tab navigation for open workspaces
- Lazy-loaded routes and debounced search

### Architecture decisions

**Transactions** — creating a workspace involves two operations (creating the workspace and adding the owner as a member). Both run inside a transaction — if one fails, the other is rolled back, preventing orphaned workspaces with no members.

**Indexes** — before adding indexes, the main queries were analyzed with `EXPLAIN ANALYZE`. With the current data volume, sequential scans outperform index scans on the `tasks`, `goals` and `habits` tables — adding indexes there now would add maintenance cost with no real benefit. The `workspace_members` table received a composite index on `(workspace_id, user_id)`, since it's queried on every authenticated request via the authorization middleware, regardless of data volume.

**Refresh token rotation** — each use of a refresh token issues a new token pair and invalidates the previous one. This limits the exposure window of a stolen token and allows detecting reuse, without requiring a new login while the user stays active.

**WebSocket with per-user rooms** — each Socket.IO connection joins a room named `user:{id}`, enabling events to be targeted at a specific user without unnecessary broadcasting.

**AI with structured schema** — Gemini responses are constrained to a defined `responseSchema`, removing the need for fragile free-text parsing and guaranteeing consistent types.

**Structured logging** — expected business errors (`AppError`, e.g. wrong password, resource not found) are not logged as errors; only truly unexpected errors (500) are logged with a stack trace, avoiding noise in production.

### Running the project

**Backend**

```bash
cd server
npm install
cp .env.example .env
# set the environment variables
npm run migrate
npm run migrate:owners
npm run migrate:members-index
npm run migrate:refresh-tokens
npm run migrate:invites
npm run dev
```

**Frontend**

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### Tests

```bash
cd server
npm test
```

### Environment variables

See `server/.env.example` and `client/.env.example` for the required variables.
