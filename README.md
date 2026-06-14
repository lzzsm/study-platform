# Study Platform

> 🇧🇷 [Português](#português) | 🇺🇸 [English](#english)

---

## Português

Plataforma de gerenciamento de estudos e produtividade com suporte a múltiplos workspaces colaborativos, tarefas, metas e hábitos.

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

**Backend**

- Node.js + Express + TypeScript
- PostgreSQL
- JWT
- Zod
- Bcrypt
- Vitest

### Funcionalidades

- Autenticação com JWT
- Múltiplos workspaces colaborativos por usuário, com papéis (owner, editor, viewer)
- CRUD de workspaces com soft delete
- Tarefas com toggle de conclusão, filtros e paginação
- Metas quantitativas e qualitativas com tracking de progresso
- Hábitos com streak de dias consecutivos
- Dashboard com analytics e gráficos
- Perfil de usuário com avatar, bio e troca de senha
- Optimistic updates e cache configurado via TanStack Query
- Troca de tema claro/escuro/sistema

### Decisões de arquitetura

**Transactions** — a criação de um workspace envolve duas operações (criar o workspace e adicionar o dono como membro). Ambas são executadas dentro de uma transaction — se uma falhar, a outra é desfeita, evitando workspaces órfãos sem membros.

**Indexes** — antes de adicionar indexes, as queries principais foram analisadas com `EXPLAIN ANALYZE`. Com o volume atual de dados, sequential scans são mais rápidos que index scans nas tabelas `tasks`, `goals` e `habits` — adicionar indexes nelas agora adicionaria custo de manutenção sem benefício real. A tabela `workspace_members` recebeu um index composto em `(workspace_id, user_id)`, já que é consultada em toda requisição autenticada via middleware de autorização, independente do volume de dados.

### Rodando o projeto

**Backend**

```bash
cd server
npm install
cp .env.example .env
# configure as variáveis de ambiente
npm run dev
```

**Frontend**

```bash
cd client
npm install
npm run dev
```

### Variáveis de ambiente

Veja `server/.env.example` para as variáveis necessárias.

---

## English

Productivity and study management platform with support for multiple collaborative workspaces, tasks, goals and habit tracking.

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

**Backend**

- Node.js + Express + TypeScript
- PostgreSQL
- JWT
- Zod
- Bcrypt
- Vitest

### Features

- JWT authentication
- Multiple collaborative workspaces per user, with roles (owner, editor, viewer)
- Workspace CRUD with soft delete
- Tasks with completion toggle, filters and pagination
- Quantitative and qualitative goals with progress tracking
- Habits with consecutive day streak tracking
- Dashboard with analytics and charts
- User profile with avatar, bio and password change
- Optimistic updates and cache configuration via TanStack Query
- Light/dark/system theme toggle

### Architecture decisions

**Transactions** — creating a workspace involves two operations (creating the workspace and adding the owner as a member). Both run inside a transaction — if one fails, the other is rolled back, preventing orphaned workspaces with no members.

**Indexes** — before adding indexes, the main queries were analyzed with `EXPLAIN ANALYZE`. With the current data volume, sequential scans outperform index scans on the `tasks`, `goals` and `habits` tables — adding indexes there now would add maintenance cost with no real benefit. The `workspace_members` table received a composite index on `(workspace_id, user_id)`, since it's queried on every authenticated request via the authorization middleware, regardless of data volume.

### Running the project

**Backend**

```bash
cd server
npm install
cp .env.example .env
# set the environment variables
npm run dev
```

**Frontend**

```bash
cd client
npm install
npm run dev
```

### Environment variables

See `server/.env.example` for the required variables.
