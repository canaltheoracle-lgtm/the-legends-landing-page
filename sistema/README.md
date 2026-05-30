# The Legends - Sistema de Gerenciamento

Sistema completo de gerenciamento de pedidos e cardápio para o restaurante The Legends, 100% gratuito!

## Estrutura

```
sistema/
├── backend/    # API REST (Node.js + Express + TypeScript + SQLite)
└── dashboard/  # Painel administrativo (React + TypeScript + Vite + Tailwind)
```

## Como rodar

### 1. Backend

```bash
cd sistema/backend
npm install
npm run dev
```

O backend rodará em `http://localhost:3001`

### 2. Dashboard

```bash
cd sistema/dashboard
npm install
npm run dev
```

O dashboard rodará em `http://localhost:3000`

## Credenciais padrão

- Email: `admin@thelegends.com`
- Senha: `admin123`

## Funcionalidades

- ✅ Autenticação JWT
- ✅ Controle de acesso por funções (admin, gerente, atendente, cozinha, entregador)
- ✅ Gerenciamento de cardápio (produtos e categorias)
- ✅ Gerenciamento de pedidos (status, itens, cliente)
- ✅ Dashboard com estatísticas
- ✅ Logs de auditoria
- ✅ Banco de dados SQLite (sem custo!)
