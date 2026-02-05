# 🦅 Griffon Workshop - Sistema de Gestão de Projetos

Sistema completo de gestão de projetos com autenticação, múltiplas visualizações (Lista, Kanban, Timeline, Gantt, Calendário) e controle de usuários.

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Deploy](#deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Usuário Inicial](#usuário-inicial)

## ✨ Características

### Autenticação e Usuários
- ✅ Sistema de login/registro com JWT
- ✅ Primeiro usuário registrado é automaticamente Admin
- ✅ Controle de permissões (Admin, Manager, Member)
- ✅ Admin pode criar e gerenciar usuários
- ✅ Cada usuário vê apenas seus projetos

### Gestão de Projetos
- ✅ Criar projetos com cores personalizadas
- ✅ Adicionar membros aos projetos
- ✅ Filtrar por projeto específico

### Gestão de Tarefas
- ✅ Criar, editar, deletar tarefas
- ✅ Atribuir responsáveis
- ✅ Definir prioridades (Alta, Média, Baixa)
- ✅ Status personalizados (A Fazer, Em Progresso, Em Revisão, Concluído)
- ✅ Datas de início e entrega
- ✅ Tags e comentários
- ✅ Busca e filtros avançados

### Visualizações
- 📊 **Lista**: Visualização tradicional agrupada por projeto
- 🎯 **Kanban**: Quadro com drag & drop
- 📈 **Timeline**: Linha do tempo visual
- 📊 **Gantt**: Gráfico de Gantt profissional
- 📅 **Calendário**: Visualização de tarefas em calendário mensal

### Recursos Adicionais
- 💾 Dados persistidos em MongoDB
- 🔒 Rotas protegidas com autenticação
- 🎨 Interface moderna com Tailwind CSS
- 📱 Design responsivo

## 🛠 Tecnologias

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticação
- bcryptjs para hash de senhas

### Frontend
- React 18
- React Router v6
- Axios para requisições
- React Big Calendar
- Tailwind CSS
- Zustand para estado global
- React Hot Toast para notificações

## 📦 Pré-requisitos

- Node.js 16+ ([Download](https://nodejs.org/))
- MongoDB 5+ ([Download](https://www.mongodb.com/try/download/community))
  - Ou conta no MongoDB Atlas (gratuito)
- npm ou yarn

## 🚀 Instalação

### 1. Clone o repositório (ou extraia o ZIP)

```bash
cd griffon-workshop-pm
```

### 2. Instalar dependências do Backend

```bash
cd server
npm install
```

### 3. Instalar dependências do Frontend

```bash
cd ../client
npm install
```

## ⚙️ Configuração

### Backend

1. Na pasta `server`, copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações:

```env
PORT=5000
NODE_ENV=production

# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/griffon-workshop-pm

# OU MongoDB Atlas (recomendado para produção)
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/griffon-workshop-pm

# Gere uma chave secreta forte (use um gerador online)
JWT_SECRET=sua-chave-super-secreta-mude-isso

# URL do frontend (para CORS)
CLIENT_URL=http://localhost:3000
```

### MongoDB Atlas (Grátis - Recomendado)

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crie uma conta gratuita
3. Crie um cluster (selecione o tier gratuito)
4. Em "Database Access", crie um usuário
5. Em "Network Access", adicione `0.0.0.0/0` (permite todos IPs)
6. Clique em "Connect" > "Connect your application"
7. Copie a string de conexão e cole no `.env`
8. Substitua `<password>` pela senha do usuário

## 🎯 Execução

### Desenvolvimento Local

#### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd client
npm start
```

O app estará rodando em `http://localhost:3000`

### Produção Local

#### Backend:
```bash
cd server
npm start
```

#### Frontend (build):
```bash
cd client
npm run build
```

## 🌐 Deploy (Hospedagem)

### Opção 1: Heroku (Gratuito)

#### Backend no Heroku:

1. Crie conta no [Heroku](https://heroku.com)
2. Instale o [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

```bash
cd server
heroku login
heroku create griffon-workshop-api
heroku config:set JWT_SECRET=sua-chave-secreta
heroku config:set MONGODB_URI=sua-mongodb-atlas-uri
heroku config:set CLIENT_URL=https://seu-frontend.vercel.app
git init
git add .
git commit -m "Deploy backend"
git push heroku main
```

#### Frontend no Vercel:

1. Crie conta no [Vercel](https://vercel.com)
2. Instale o [Vercel CLI](https://vercel.com/cli)

```bash
cd client
# Crie arquivo .env.production
echo "REACT_APP_API_URL=https://griffon-workshop-api.herokuapp.com" > .env.production
vercel login
vercel --prod
```

### Opção 2: DigitalOcean (Pago - Recomendado)

1. Crie um Droplet Ubuntu
2. Instale Node.js e MongoDB
3. Clone o projeto
4. Configure Nginx como proxy reverso
5. Use PM2 para gerenciar o processo Node.js

```bash
# No servidor
npm install -g pm2
cd server
pm2 start server.js --name "griffon-api"
pm2 save
pm2 startup
```

### Opção 3: Railway (Fácil)

1. Acesse [Railway](https://railway.app)
2. Conecte seu repositório GitHub
3. Railway detectará automaticamente Node.js
4. Configure as variáveis de ambiente
5. Deploy automático!

### Opção 4: Render (Gratuito)

1. Acesse [Render](https://render.com)
2. Crie um Web Service
3. Conecte o repositório
4. Configure variáveis de ambiente
5. Deploy!

## 📁 Estrutura do Projeto

```
griffon-workshop-pm/
├── server/                 # Backend Node.js
│   ├── config/            # Configurações
│   │   └── database.js    # Conexão MongoDB
│   ├── models/            # Modelos Mongoose
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/            # Rotas da API
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── middleware/        # Middlewares
│   │   └── auth.js
│   ├── .env.example       # Exemplo de variáveis
│   ├── package.json
│   └── server.js          # Arquivo principal
│
├── client/                # Frontend React
│   ├── public/
│   │   └── logo.png      # Logo Griffon Workshop
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── styles/       # Estilos CSS
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md             # Este arquivo
```

## 🔌 API Endpoints

### Autenticação (`/api/auth`)

```
POST   /register          - Registrar usuário
POST   /login             - Login
GET    /me                - Obter usuário atual
GET    /users             - Listar usuários
POST   /users             - Criar usuário (Admin)
PUT    /users/:id         - Atualizar usuário (Admin)
DELETE /users/:id         - Desativar usuário (Admin)
```

### Projetos (`/api/projects`)

```
GET    /                  - Listar projetos do usuário
GET    /:id               - Obter projeto específico
POST   /                  - Criar projeto
PUT    /:id               - Atualizar projeto
DELETE /:id               - Deletar projeto
```

### Tarefas (`/api/tasks`)

```
GET    /                  - Listar tarefas (com filtros)
GET    /:id               - Obter tarefa específica
POST   /                  - Criar tarefa
PUT    /:id               - Atualizar tarefa
DELETE /:id               - Deletar tarefa
POST   /:id/comments      - Adicionar comentário
```

## 👤 Usuário Inicial

### Primeiro Acesso

1. Acesse o sistema
2. Clique em "Criar Conta"
3. Preencha os dados
4. **O primeiro usuário registrado será automaticamente Admin**
5. Faça login com suas credenciais

### Criar Usuários Adicionais (Como Admin)

1. Faça login como Admin
2. Acesse "Configurações" ou "Usuários"
3. Clique em "Novo Usuário"
4. Defina:
   - Nome
   - Email
   - Senha
   - Função (Admin/Manager/Member)
   - Avatar (emoji)

### Níveis de Acesso

- **Admin**: Acesso total, pode gerenciar usuários
- **Manager**: Pode criar projetos e gerenciar equipe
- **Member**: Acesso básico, visualiza apenas projetos onde é membro

## 🎨 Personalizando o Logo

O logo da Griffon Workshop já está incluído. Para usar outro:

1. Substitua o arquivo `public/logo.png`
2. Mantenha o nome ou atualize as referências no código

## 🐛 Troubleshooting

### MongoDB não conecta

- Verifique se o MongoDB está rodando: `sudo systemctl status mongod`
- Ou use MongoDB Atlas (mais fácil)

### Erro de CORS

- Verifique se `CLIENT_URL` no `.env` está correto
- Em produção, adicione o domínio real do frontend

### JWT Token Inválido

- Certifique-se de que `JWT_SECRET` é o mesmo em todos ambientes
- Faça logout e login novamente

### Port já em uso

```bash
# Linux/Mac
lsof -i :5000
kill -9 PID

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 📝 Próximos Passos

1. **Testar localmente** - Execute o sistema e teste todas as funcionalidades
2. **Criar conta MongoDB Atlas** - Para não depender de MongoDB local
3. **Deploy Backend** - Escolha Heroku, Railway ou Render
4. **Deploy Frontend** - Vercel ou Netlify são rápidos
5. **Configurar Domínio** - Opcional, mas profissional

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique este README
2. Consulte a documentação das tecnologias
3. Verifique os logs do servidor

## 📄 Licença

Este projeto foi desenvolvido para Griffon Workshop.

---

**Desenvolvido com ❤️ para Griffon Workshop** 🦅
