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

- [ ] Tarefas por workspace
- [ ] Metas com progresso
- [ ] Tracking de hábitos
- [ ] Sessões pomodoro
- [ ] Dashboard analytics
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

- [ ] Tasks per workspace
- [ ] Goals with progress tracking
- [ ] Habit tracking
- [ ] Pomodoro sessions
- [ ] Analytics dashboard
- [ ] Notifications
- [ ] AI integration
