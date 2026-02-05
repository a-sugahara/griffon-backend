# 🚀 GUIA COMPLETO DE DEPLOY - GRIFFON WORKSHOP PM

Este guia vai te levar do zero ao sistema rodando na internet.

## 📋 Checklist Rápido

- [ ] Instalar Node.js
- [ ] Criar conta MongoDB Atlas
- [ ] Deploy do Backend
- [ ] Deploy do Frontend
- [ ] Configurar variáveis de ambiente
- [ ] Criar primeiro usuário Admin
- [ ] Testar sistema completo

---

## PASSO 1: MongoDB Atlas (5 minutos) ☁️

### Por que MongoDB Atlas?
- ✅ Grátis para sempre (até 512MB)
- ✅ Não precisa instalar MongoDB no computador
- ✅ Funciona de qualquer lugar
- ✅ Backups automáticos

### Como configurar:

1. **Criar conta**
   - Acesse: https://www.mongodb.com/cloud/atlas/register
   - Use Google ou crie com email
   - Escolha o plano **FREE** (M0 Sandbox)

2. **Criar Cluster**
   - Nome do cluster: `griffon-workshop`
   - Provider: AWS
   - Região: Escolha mais próxima (ex: São Paulo)
   - Clique em **Create Cluster**
   - Aguarde 3-5 minutos

3. **Configurar Acesso**
   
   **Database Access (Usuário do Banco)**
   - No menu, clique em "Database Access"
   - Clique em "+ Add New Database User"
   - Authentication Method: Password
   - Username: `admin_griffon`
   - Password: Clique em "Autogenerate Secure Password" e **COPIE**
   - Database User Privileges: "Atlas admin"
   - Clique em "Add User"

   **Network Access (Liberar IPs)**
   - No menu, clique em "Network Access"
   - Clique em "+ Add IP Address"
   - Clique em "Allow Access from Anywhere" (0.0.0.0/0)
   - Clique em "Confirm"

4. **Obter String de Conexão**
   - Volte para "Database"
   - Clique em "Connect" no seu cluster
   - Escolha "Connect your application"
   - Driver: Node.js
   - Copie a string: `mongodb+srv://admin_griffon:<password>@...`
   - **Substitua `<password>` pela senha que você copiou**
   - Guarde essa string, você vai precisar!

---

## PASSO 2: Deploy do Backend (10 minutos) 🔧

### Opção A: Render.com (Recomendado - Mais Fácil)

1. **Criar conta**
   - Acesse: https://render.com
   - Cadastre com GitHub

2. **Conectar GitHub**
   - Primeiro, suba o código para GitHub:
   ```bash
   cd griffon-workshop-pm
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create griffon-workshop-pm --private --source=. --push
   ```

3. **Criar Web Service**
   - No Render, clique em "New +" > "Web Service"
   - Conecte seu repositório GitHub
   - Configurações:
     - Name: `griffon-workshop-api`
     - Region: Oregon (Free)
     - Branch: `main`
     - Root Directory: `server`
     - Runtime: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: **Free**

4. **Configurar Variáveis de Ambiente**
   - Na seção "Environment Variables"
   - Adicione:
     ```
     NODE_ENV = production
     JWT_SECRET = griffon_workshop_super_secret_key_2024
     MONGODB_URI = [Cole sua string do MongoDB Atlas aqui]
     CLIENT_URL = https://griffon-workshop.vercel.app
     ```

5. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde 2-3 minutos
   - Copie a URL: `https://griffon-workshop-api.onrender.com`

### Opção B: Railway.app (Alternativa Fácil)

1. Acesse https://railway.app
2. Login com GitHub
3. "New Project" > "Deploy from GitHub repo"
4. Selecione o repositório
5. Adicione variáveis de ambiente (mesmas acima)
6. Deploy automático!

---

## PASSO 3: Deploy do Frontend (8 minutos) 💻

### Vercel (Recomendado)

1. **Preparar Frontend**
   
   Crie arquivo `.env.production` na pasta `client`:
   ```bash
   cd client
   echo "REACT_APP_API_URL=https://griffon-workshop-api.onrender.com" > .env.production
   ```

2. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

4. **Configurar**
   - Project Name: `griffon-workshop`
   - Framework: Create React App (detecta automaticamente)
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Confirme tudo

5. **Obter URL**
   - Exemplo: `https://griffon-workshop.vercel.app`
   - Copie essa URL

6. **Atualizar Backend**
   - Volte ao Render/Railway
   - Atualize `CLIENT_URL` para a URL do Vercel
   - Salve e redeploy

---

## PASSO 4: Configuração Final (3 minutos) ⚙️

### Atualizar CORS no Backend

1. No Render.com, vá em Environment Variables
2. Atualize `CLIENT_URL` com a URL real do Vercel
3. Clique em "Save Changes"
4. O backend vai redeployar automaticamente

### Testar Conexão

1. Acesse: `https://griffon-workshop-api.onrender.com/api/health`
2. Deve retornar:
   ```json
   {
     "success": true,
     "message": "Griffon Workshop PM API está funcionando!",
     "timestamp": "2024-..."
   }
   ```

---

## PASSO 5: Primeiro Acesso (2 minutos) 🎉

1. **Acessar Sistema**
   - Abra: `https://griffon-workshop.vercel.app`

2. **Criar Conta Admin**
   - Clique em "Criar Conta"
   - Preencha:
     - Nome: Seu nome
     - Email: seu@email.com
     - Senha: senha forte
   - **Importante**: O primeiro usuário é automaticamente Admin!

3. **Fazer Login**
   - Use as credenciais criadas
   - Você terá acesso total ao sistema

4. **Criar Projeto de Teste**
   - Clique em "Novo Projeto"
   - Nome: "Projeto Teste"
   - Cor: Escolha uma
   - Salve

5. **Criar Tarefa de Teste**
   - Clique no botão "+"
   - Título: "Primeira Tarefa"
   - Projeto: "Projeto Teste"
   - Configure como desejar
   - Salve

---

## 🎯 URLs Finais

Após completar, você terá:

- **Frontend**: `https://griffon-workshop.vercel.app`
- **Backend**: `https://griffon-workshop-api.onrender.com`
- **Banco de Dados**: MongoDB Atlas (cloud)

---

## 🔄 Atualizações Futuras

### Para atualizar o sistema:

```bash
# Fazer mudanças no código
git add .
git commit -m "Descrição da mudança"
git push

# Render e Vercel detectam e fazem deploy automaticamente!
```

---

## 🐛 Problemas Comuns

### 1. "Cannot connect to database"
- ✅ Verifique string do MongoDB Atlas
- ✅ Confirme que liberou acesso (0.0.0.0/0)
- ✅ Senha correta na string de conexão

### 2. "CORS Error" no frontend
- ✅ `CLIENT_URL` no backend deve ser exatamente a URL do Vercel
- ✅ Sem `/` no final da URL

### 3. Backend demora a responder (Render Free)
- ⚠️ Render free "dorme" após 15min de inatividade
- ✅ Primeira requisição pode levar 30-60 segundos
- ✅ Depois fica rápido

### 4. "API URL not found"
- ✅ Verifique `.env.production` no frontend
- ✅ Deve apontar para URL real do backend

---

## 💰 Custos

### Configuração Grátis (Recomendada)
- MongoDB Atlas: **Grátis** (M0 - 512MB)
- Render.com Backend: **Grátis** (750h/mês)
- Vercel Frontend: **Grátis** (100GB bandwidth)
- **Total: R$ 0,00/mês** ✅

### Limitações do Plano Grátis
- Render: Backend "dorme" após 15min sem uso
- MongoDB: Máximo 512MB de dados
- Vercel: 100GB de tráfego/mês

### Para Produção Séria
- Render: $7/mês (sem sleep)
- MongoDB Atlas: $9/mês (2GB, mais rápido)
- **Total: ~$16/mês (R$ 80/mês)**

---

## 📊 Monitoramento

### Verificar Status dos Serviços

1. **Backend (Render)**
   - Dashboard: https://dashboard.render.com
   - Veja logs, CPU, memória

2. **Frontend (Vercel)**
   - Dashboard: https://vercel.com/dashboard
   - Veja deploys, analytics

3. **Banco de Dados (MongoDB)**
   - Dashboard: https://cloud.mongodb.com
   - Veja uso de storage, queries

---

## 🔒 Segurança

### Recomendações Importantes

1. **JWT_SECRET**
   - Use gerador: https://www.grc.com/passwords.htm
   - Nunca compartilhe
   - Diferente em dev e prod

2. **Senhas de Usuários**
   - Mínimo 8 caracteres
   - Inclua números e símbolos
   - Não reutilize senhas

3. **MongoDB**
   - Não compartilhe credenciais
   - Faça backup regular (Atlas faz automaticamente)

4. **HTTPS**
   - Render e Vercel já fornecem SSL grátis ✅

---

## 📞 Suporte

### Ordem de Troubleshooting

1. ✅ Verifique os logs no Render/Vercel
2. ✅ Teste endpoints da API diretamente
3. ✅ Verifique console do navegador (F12)
4. ✅ Confirme variáveis de ambiente
5. ✅ Revise este guia

### Recursos Úteis

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com/manual/
- React Docs: https://react.dev

---

## ✅ Checklist Final

Antes de considerar concluído:

- [ ] Backend respondendo em /api/health
- [ ] Frontend carregando sem erros
- [ ] Login funcionando
- [ ] Criar projeto funcionando
- [ ] Criar tarefa funcionando
- [ ] Todas as visualizações funcionando
- [ ] Filtros e busca funcionando
- [ ] Calendário mostrando tarefas

---

## 🎊 Pronto!

Seu sistema Griffon Workshop PM está no ar!

Compartilhe a URL do frontend com sua equipe e comece a gerenciar projetos!

**URL do Sistema**: `https://griffon-workshop.vercel.app`

---

**Desenvolvido para Griffon Workshop** 🦅
