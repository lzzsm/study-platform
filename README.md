# Study Platform

> 🇧🇷 [Português](#português) | 🇺🇸 [English](#english)

---

## Português

Plataforma de gerenciamento de estudos e produtividade com suporte a múltiplos workspaces, tarefas, metas e hábitos.

### Tecnologias

**Frontend**

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- TanStack Query
- React Hook Form + Zod
- React Router

**Backend**

- Node.js + Express + TypeScript
- PostgreSQL
- JWT
- Zod
- Bcrypt

### Funcionalidades

- Autenticação com JWT
- Múltiplos workspaces por usuário
- CRUD de workspaces com soft delete
- Tarefas com toggle de conclusão
- Metas quantitativas e qualitativas com tracking de progresso
- Hábitos com streak de dias consecutivos
- Dashboard com visão geral
- Troca de tema claro/escuro

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

### Roadmap

- [x] Autenticação
- [x] Workspaces
- [x] Tarefas
- [x] Metas com progresso
- [x] Tracking de hábitos
- [ ] Dashboard analytics com gráficos
- [ ] Filtros e paginação
- [ ] Sessões pomodoro
- [ ] Notificações
- [ ] Integração com IA

---

## English

Productivity and study management platform with support for multiple workspaces, tasks, goals and habit tracking.

### Tech Stack

**Frontend**

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- TanStack Query
- React Hook Form + Zod
- React Router

**Backend**

- Node.js + Express + TypeScript
- PostgreSQL
- JWT
- Zod
- Bcrypt

### Features

- JWT authentication
- Multiple workspaces per user
- Workspace CRUD with soft delete
- Tasks with completion toggle
- Quantitative and qualitative goals with progress tracking
- Habits with consecutive day streak tracking
- Overview dashboard
- Light/dark theme toggle

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

### Roadmap

- [x] Authentication
- [x] Workspaces
- [x] Tasks
- [x] Goals with progress tracking
- [x] Habit tracking
- [ ] Analytics dashboard with charts
- [ ] Filters and pagination
- [ ] Pomodoro sessions
- [ ] Notifications
- [ ] AI integration
