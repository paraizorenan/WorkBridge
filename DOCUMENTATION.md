# 📚 Documentação Técnica Completa - WorkBridge

## 📋 Índice
1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Backend - Servidor Express.js](#backend---servidor-expressjs)
6. [Banco de Dados PostgreSQL](#banco-de-dados-postgresql)
7. [API RESTful](#api-restful)
8. [Frontend](#frontend)
9. [Configuração e Deploy](#configuração-e-deploy)
10. [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral do Projeto

O **WorkBridge** é uma plataforma web completa que conecta profissionais talentosos com oportunidades de trabalho. O projeto foi desenvolvido como uma aplicação full-stack com backend em Node.js/Express.js e frontend em HTML/CSS/JavaScript.

### Objetivos do Projeto:
- Criar uma plataforma de recrutamento moderna
- Implementar sistema completo de CRUD para usuários, empresas e vagas
- Desenvolver API RESTful robusta
- Integrar banco de dados PostgreSQL
- Fornecer interface de usuário responsiva e intuitiva

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Arquitetura:
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database     │
│   (HTML/CSS/JS) │◄──►│   (Express.js)  │◄──►│   (PostgreSQL) │
│                 │    │                 │    │                 │
│ - index.html    │    │ - server.js     │    │ - users         │
│ - cadastro.html │    │ - API Routes    │    │ - companies     │
│ - CSS/JS files  │    │ - Middleware    │    │ - jobs          │
└─────────────────┘    └─────────────────┘    │ - applications │
                                               │ - messages     │
                                               └─────────────────┘
```

### Padrões Arquiteturais:
- **MVC (Model-View-Controller)**: Separação clara entre lógica de negócio, apresentação e dados
- **RESTful API**: Endpoints padronizados seguindo convenções REST
- **Middleware Pattern**: Processamento de requisições em camadas
- **Repository Pattern**: Abstração do acesso aos dados

---

## 🛠️ Tecnologias Utilizadas

### Backend:
- **Node.js v14+**: Runtime JavaScript no servidor
- **Express.js v5.1.0**: Framework web minimalista e flexível
- **PostgreSQL v12+**: Banco de dados relacional robusto
- **pg v8.16.3**: Driver PostgreSQL para Node.js
- **CORS v2.8.5**: Middleware para requisições cross-origin
- **dotenv v17.2.3**: Gerenciamento de variáveis de ambiente

### Frontend:
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Estilização com gradientes, animações e responsividade
- **JavaScript ES6+**: Interatividade e manipulação do DOM
- **Fetch API**: Comunicação com o backend

### Ferramentas de Desenvolvimento:
- **Nodemon v3.1.10**: Reinicialização automática do servidor
- **Git**: Controle de versão
- **npm**: Gerenciador de pacotes

---

## 📁 Estrutura de Arquivos

```
WorkBridge/
├── 📁 src/                    # Código fonte do backend
│   └── server.js              # Servidor principal Express.js
├── 📁 database/               # Scripts e configurações do banco
│   └── schema.sql             # Schema completo do PostgreSQL
├── 📁 public/                 # Arquivos estáticos do frontend
│   └── index.html             # Página principal
├── 📁 css/                    # Estilos CSS
│   └── style.css              # Estilos adicionais
├── 📁 js/                     # Scripts JavaScript
│   └── script.js              # JavaScript adicional
├── 📄 cadastro.html           # Página de cadastro
├── 📄 package.json            # Dependências e scripts npm
├── 📄 package-lock.json        # Lock file das dependências
├── 📄 README.md               # Documentação principal
├── 📄 DOCUMENTATION.md        # Esta documentação técnica
├── 📄 .gitignore              # Arquivos ignorados pelo Git
├── 📄 config.example          # Exemplo de configuração
└── 📄 env.example             # Exemplo de variáveis de ambiente
```

---

## 🔧 Backend - Servidor Express.js

### Arquivo Principal: `src/server.js`

#### Configuração Inicial:
```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
```

#### Middleware Configurado:
1. **CORS**: Permite requisições cross-origin
2. **JSON Parser**: Processa dados JSON nas requisições
3. **Static Files**: Serve arquivos estáticos da pasta `public/`
4. **Request Logging**: Log de todas as requisições

#### Conexão com PostgreSQL:
```javascript
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'workbridge',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});
```

#### Tratamento de Erros:
- **Database Connection Errors**: Logs de conexão e erro
- **Global Error Handler**: Middleware para capturar erros não tratados
- **Graceful Shutdown**: Encerramento limpo do servidor e pool de conexões

---

## 🗄️ Banco de Dados PostgreSQL

### Schema: `database/schema.sql`

#### Tabelas Principais:

##### 1. **users** - Usuários/Candidatos
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profession VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(255),
    bio TEXT,
    skills TEXT[],
    experience_level VARCHAR(50),
    availability VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

##### 2. **companies** - Empresas
```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    location VARCHAR(255),
    industry VARCHAR(255),
    size VARCHAR(50),
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

##### 3. **jobs** - Vagas de Emprego
```sql
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company_id INTEGER REFERENCES companies(id),
    company_name VARCHAR(255),
    location VARCHAR(255),
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'BRL',
    employment_type VARCHAR(50),
    experience_level VARCHAR(50),
    skills_required TEXT[],
    benefits TEXT[],
    remote_work BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

##### 4. **applications** - Candidaturas
```sql
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    job_id INTEGER REFERENCES jobs(id),
    status VARCHAR(20) DEFAULT 'pending',
    cover_letter TEXT,
    resume_url VARCHAR(500),
    applied_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    notes TEXT
);
```

##### 5. **favorites** - Vagas Favoritas
```sql
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    job_id INTEGER REFERENCES jobs(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);
```

##### 6. **messages** - Sistema de Mensagens
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    job_id INTEGER REFERENCES jobs(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Índices para Performance:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
```

#### Triggers Automáticos:
```sql
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabela
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🌐 API RESTful

### Endpoints Implementados:

#### **Health Check**
- `GET /api/health` - Status da API
- `GET /api/db-status` - Status da conexão com banco

#### **Usuários**
- `GET /api/users` - Lista todos os usuários
- `POST /api/users` - Cria novo usuário
- `GET /api/users/:id` - Busca usuário por ID
- `PUT /api/users/:id` - Atualiza usuário (a implementar)
- `DELETE /api/users/:id` - Remove usuário (a implementar)

#### **Empresas**
- `GET /api/companies` - Lista todas as empresas
- `POST /api/companies` - Cria nova empresa
- `GET /api/companies/:id` - Busca empresa por ID (a implementar)
- `PUT /api/companies/:id` - Atualiza empresa (a implementar)
- `DELETE /api/companies/:id` - Remove empresa (a implementar)

#### **Vagas**
- `GET /api/jobs` - Lista vagas com filtros e paginação
- `POST /api/jobs` - Cria nova vaga
- `GET /api/jobs/:id` - Busca vaga por ID
- `PUT /api/jobs/:id` - Atualiza vaga (a implementar)
- `DELETE /api/jobs/:id` - Remove vaga (a implementar)

#### **Candidaturas**
- `GET /api/applications` - Lista candidaturas com filtros
- `POST /api/applications` - Cria nova candidatura
- `GET /api/applications/:id` - Busca candidatura por ID (a implementar)
- `PUT /api/applications/:id` - Atualiza status da candidatura (a implementar)

### Exemplos de Uso da API:

#### Criar Usuário:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "profession": "Desenvolvedor Full Stack",
    "location": "São Paulo, SP",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience_level": "senior"
  }'
```

#### Buscar Vagas com Filtros:
```bash
curl "http://localhost:3000/api/jobs?search=react&location=São Paulo&experience_level=senior&page=1&limit=10"
```

#### Criar Candidatura:
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "job_id": 1,
    "cover_letter": "Tenho interesse nesta vaga...",
    "resume_url": "https://example.com/curriculo.pdf"
  }'
```

### Padrões de Resposta:

#### Sucesso:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

#### Erro:
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos do erro"
}
```

#### Paginação:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🎨 Frontend

### Estrutura do Frontend:

#### **Página Principal** (`public/index.html`):
- Design responsivo com CSS Grid e Flexbox
- Gradientes e animações CSS3
- JavaScript interativo com efeitos de digitação
- Integração com API para dados dinâmicos

#### **Página de Cadastro** (`cadastro.html`):
- Formulário completo de cadastro
- Validação client-side
- Estilização consistente com tema principal

#### **Estilos CSS** (`css/style.css`):
- Design system consistente
- Variáveis CSS para cores e espaçamentos
- Media queries para responsividade
- Animações e transições suaves

#### **JavaScript** (`js/script.js`):
- Manipulação do DOM
- Requisições AJAX para API
- Validação de formulários
- Interações dinâmicas

### Funcionalidades Frontend:

1. **Carregamento Dinâmico**: Dados carregados via API
2. **Validação de Formulários**: Validação client-side
3. **Responsividade**: Adaptação para diferentes dispositivos
4. **Animações**: Efeitos visuais modernos
5. **Interatividade**: Botões e elementos interativos

---

## ⚙️ Configuração e Deploy

### Variáveis de Ambiente:

#### Arquivo `.env`:
```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=workbridge
DB_USER=postgres
DB_PASSWORD=sua_senha

# Segurança
JWT_SECRET=seu_jwt_secret_muito_seguro
SESSION_SECRET=seu_session_secret_muito_seguro

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3000/api
```

### Scripts NPM Disponíveis:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "db:init": "psql -U postgres -d workbridge -f database/schema.sql",
    "db:reset": "psql -U postgres -c \"DROP DATABASE IF EXISTS workbridge; CREATE DATABASE workbridge;\" && npm run db:init",
    "setup": "npm install && cp config.example .env",
    "build": "echo \"Build completed\"",
    "lint": "echo \"Linting completed\""
  }
}
```

### Processo de Instalação:

1. **Clone do Repositório**:
   ```bash
   git clone https://github.com/paraizorenan/WorkBridge.git
   cd WorkBridge
   ```

2. **Instalação de Dependências**:
   ```bash
   npm install
   ```

3. **Configuração do Banco**:
   ```bash
   # Criar banco de dados
   createdb workbridge
   
   # Executar schema
   psql -U postgres -d workbridge -f database/schema.sql
   ```

4. **Configuração de Ambiente**:
   ```bash
   cp config.example .env
   # Editar .env com suas configurações
   ```

5. **Execução**:
   ```bash
   npm run dev  # Desenvolvimento
   npm start    # Produção
   ```

### Deploy em Produção:

#### Heroku:
```bash
# Instalar Heroku CLI
# Criar aplicação
heroku create workbridge-app

# Configurar variáveis de ambiente
heroku config:set DB_HOST=seu_host
heroku config:set DB_PASSWORD=sua_senha

# Deploy
git push heroku main
```

#### Railway:
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

#### VPS/Docker:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔄 Fluxo de Desenvolvimento

### Metodologia Utilizada:

1. **Análise de Requisitos**: Definição das funcionalidades necessárias
2. **Design da Arquitetura**: Planejamento da estrutura do sistema
3. **Configuração do Ambiente**: Setup inicial do projeto
4. **Desenvolvimento Backend**: Implementação da API e banco de dados
5. **Desenvolvimento Frontend**: Criação da interface de usuário
6. **Integração**: Conexão entre frontend e backend
7. **Testes**: Validação das funcionalidades
8. **Deploy**: Publicação do projeto

### Processo de Desenvolvimento:

#### 1. **Setup Inicial**:
```bash
# Inicialização do projeto
npm init -y
npm install express cors pg dotenv
npm install -D nodemon

# Configuração do Git
git init
git remote add origin https://github.com/paraizorenan/WorkBridge.git
```

#### 2. **Desenvolvimento Backend**:
- Criação do servidor Express.js
- Configuração do middleware
- Implementação das rotas da API
- Integração com PostgreSQL
- Tratamento de erros

#### 3. **Desenvolvimento do Banco**:
- Design do schema
- Criação das tabelas
- Implementação dos índices
- Configuração dos triggers
- Inserção de dados de exemplo

#### 4. **Desenvolvimento Frontend**:
- Criação das páginas HTML
- Implementação dos estilos CSS
- Desenvolvimento do JavaScript
- Integração com a API

#### 5. **Integração e Testes**:
- Teste de todos os endpoints
- Validação da interface
- Teste de responsividade
- Verificação de performance

#### 6. **Deploy e Documentação**:
- Configuração para produção
- Criação da documentação
- Push para GitHub
- Configuração de CI/CD

---

## 🔧 Troubleshooting

### Problemas Comuns e Soluções:

#### 1. **Erro de Conexão com Banco**:
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solução**:
- Verificar se PostgreSQL está rodando
- Confirmar credenciais no arquivo `.env`
- Verificar se o banco `workbridge` existe

#### 2. **Porta já em uso**:
```
Error: listen EADDRINUSE :::3000
```
**Solução**:
```bash
# Encontrar processo usando a porta
lsof -i :3000
# Matar o processo
kill -9 PID
# Ou usar porta diferente
PORT=3001 npm run dev
```

#### 3. **Dependências não encontradas**:
```
Error: Cannot find module 'express'
```
**Solução**:
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

#### 4. **Erro de permissão no banco**:
```
Error: permission denied for table users
```
**Solução**:
```bash
# Conceder permissões ao usuário
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE workbridge TO seu_usuario;"
```

#### 5. **CORS Error no Frontend**:
```
Access to fetch at 'http://localhost:3000/api/users' from origin 'http://localhost:8080' has been blocked by CORS policy
```
**Solução**:
- Verificar configuração do CORS no servidor
- Confirmar URLs permitidas

### Logs e Debugging:

#### Habilitar Logs Detalhados:
```javascript
// No server.js
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});
```

#### Debug do Banco de Dados:
```javascript
// Verificar conexão
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Erro na conexão:', err);
    } else {
        console.log('Conexão OK:', result.rows[0]);
    }
});
```

### Monitoramento:

#### Health Check Endpoints:
- `GET /api/health` - Status geral da API
- `GET /api/db-status` - Status da conexão com banco

#### Logs de Produção:
```bash
# Usando PM2
npm install -g pm2
pm2 start src/server.js --name workbridge
pm2 logs workbridge
```

---

## 📈 Próximos Passos e Melhorias

### Funcionalidades Futuras:

1. **Autenticação e Autorização**:
   - Sistema de login/logout
   - JWT tokens
   - Controle de acesso por roles

2. **Upload de Arquivos**:
   - Currículos em PDF
   - Fotos de perfil
   - Logos de empresas

3. **Sistema de Notificações**:
   - Email notifications
   - Push notifications
   - Sistema de alertas

4. **Dashboard Administrativo**:
   - Painel de controle
   - Estatísticas e métricas
   - Gerenciamento de usuários

5. **Sistema de Busca Avançada**:
   - Filtros complexos
   - Busca por localização
   - Recomendações baseadas em IA

6. **Chat em Tempo Real**:
   - WebSocket implementation
   - Mensagens instantâneas
   - Notificações de chat

### Melhorias Técnicas:

1. **Testes Automatizados**:
   - Unit tests com Jest
   - Integration tests
   - E2E tests com Cypress

2. **CI/CD Pipeline**:
   - GitHub Actions
   - Deploy automático
   - Testes automatizados

3. **Monitoramento**:
   - Logs estruturados
   - Métricas de performance
   - Alertas automáticos

4. **Segurança**:
   - Rate limiting
   - Input validation
   - SQL injection prevention
   - XSS protection

5. **Performance**:
   - Caching com Redis
   - CDN para assets
   - Database optimization
   - Image optimization

---

## 📞 Suporte e Contato

### Documentação Adicional:
- [README.md](./README.md) - Guia de instalação e uso
- [API Documentation](./API.md) - Documentação completa da API
- [Database Schema](./database/schema.sql) - Schema do banco de dados

### Recursos Úteis:
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

### Contato:
- **Desenvolvedor**: Renan Paraizo
- **Repositório**: https://github.com/paraizorenan/WorkBridge
- **Issues**: https://github.com/paraizorenan/WorkBridge/issues

---

**Esta documentação foi criada para fornecer uma visão completa e técnica do projeto WorkBridge, facilitando a compreensão, manutenção e evolução do sistema.**
