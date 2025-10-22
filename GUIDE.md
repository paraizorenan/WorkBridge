# 🚀 Guia Prático de Uso - WorkBridge

## 📋 Índice
1. [Guia de Instalação Rápida](#guia-de-instalação-rápida)
2. [Exemplos Práticos de Uso](#exemplos-práticos-de-uso)
3. [Cenários de Teste](#cenários-de-teste)
4. [Comandos Úteis](#comandos-úteis)
5. [Troubleshooting Rápido](#troubleshooting-rápido)

---

## ⚡ Guia de Instalação Rápida

### Pré-requisitos:
- Node.js 14+ instalado
- PostgreSQL 12+ instalado
- Git instalado

### Instalação em 5 Passos:

```bash
# 1. Clone o repositório
git clone https://github.com/paraizorenan/WorkBridge.git
cd WorkBridge

# 2. Instale as dependências
npm install

# 3. Configure o banco de dados
createdb workbridge
psql -U postgres -d workbridge -f database/schema.sql

# 4. Configure as variáveis de ambiente
cp config.example .env
# Edite o .env com suas credenciais do PostgreSQL

# 5. Execute o projeto
npm run dev
```

### Verificação da Instalação:
- Acesse: http://localhost:3000
- API Health: http://localhost:3000/api/health
- Database Status: http://localhost:3000/api/db-status

---

## 🎯 Exemplos Práticos de Uso

### 1. Cadastrar um Novo Usuário

#### Via API (cURL):
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@email.com",
    "profession": "Designer UX/UI",
    "location": "Rio de Janeiro, RJ",
    "bio": "Designer com 3 anos de experiência em interfaces modernas",
    "skills": ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    "experience_level": "mid-level",
    "phone": "(21) 99999-9999"
  }'
```

#### Resposta Esperada:
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Maria Silva",
    "email": "maria@email.com",
    "profession": "Designer UX/UI",
    "location": "Rio de Janeiro, RJ",
    "bio": "Designer com 3 anos de experiência em interfaces modernas",
    "skills": ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    "experience_level": "mid-level",
    "phone": "(21) 99999-9999",
    "created_at": "2025-01-22T15:30:00.000Z"
  },
  "message": "Usuário criado com sucesso!"
}
```

### 2. Cadastrar uma Empresa

```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TechStartup Brasil",
    "description": "Startup focada em soluções de IA para o mercado brasileiro",
    "website": "https://techstartup.com.br",
    "location": "São Paulo, SP",
    "industry": "Tecnologia",
    "size": "Pequena"
  }'
```

### 3. Publicar uma Vaga

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Desenvolvedor React Senior",
    "description": "Procuramos desenvolvedor React com experiência em projetos de grande escala. Conhecimento em TypeScript, Redux e testes automatizados é essencial.",
    "company_id": 1,
    "location": "São Paulo, SP",
    "salary_min": 8000.00,
    "salary_max": 12000.00,
    "employment_type": "CLT",
    "experience_level": "senior",
    "skills_required": ["React", "TypeScript", "Redux", "Jest", "Node.js"],
    "benefits": ["Vale refeição", "Plano de saúde", "Home office"],
    "remote_work": true
  }'
```

### 4. Buscar Vagas com Filtros

```bash
# Buscar vagas de React em São Paulo
curl "http://localhost:3000/api/jobs?search=react&location=São Paulo&page=1&limit=5"

# Buscar vagas para desenvolvedores sênior
curl "http://localhost:3000/api/jobs?experience_level=senior&page=1&limit=10"

# Buscar vagas com trabalho remoto
curl "http://localhost:3000/api/jobs?remote_work=true"
```

### 5. Candidatar-se a uma Vaga

```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "job_id": 1,
    "cover_letter": "Olá! Tenho interesse nesta vaga pois possuo experiência sólida em React e TypeScript. Trabalhei em projetos similares e acredito que posso contribuir significativamente para a equipe.",
    "resume_url": "https://drive.google.com/file/curriculo.pdf"
  }'
```

### 6. Listar Candidaturas de um Usuário

```bash
curl "http://localhost:3000/api/applications?user_id=1"
```

---

## 🧪 Cenários de Teste

### Cenário 1: Fluxo Completo de Recrutamento

1. **Cadastrar Empresa**:
   ```bash
   curl -X POST http://localhost:3000/api/companies \
     -H "Content-Type: application/json" \
     -d '{"name": "Empresa Teste", "description": "Empresa para testes"}'
   ```

2. **Cadastrar Usuário**:
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Usuário Teste", "email": "teste@email.com"}'
   ```

3. **Publicar Vaga**:
   ```bash
   curl -X POST http://localhost:3000/api/jobs \
     -H "Content-Type: application/json" \
     -d '{"title": "Vaga Teste", "description": "Descrição da vaga", "company_id": 1}'
   ```

4. **Candidatar-se**:
   ```bash
   curl -X POST http://localhost:3000/api/applications \
     -H "Content-Type: application/json" \
     -d '{"user_id": 1, "job_id": 1}'
   ```

5. **Verificar Candidatura**:
   ```bash
   curl "http://localhost:3000/api/applications?user_id=1"
   ```

### Cenário 2: Teste de Validações

1. **Tentar criar usuário sem email**:
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Usuário Sem Email"}'
   ```
   **Resultado esperado**: Erro 400 com mensagem de validação

2. **Tentar candidatar-se duas vezes à mesma vaga**:
   ```bash
   # Primeira candidatura
   curl -X POST http://localhost:3000/api/applications \
     -H "Content-Type: application/json" \
     -d '{"user_id": 1, "job_id": 1}'
   
   # Segunda candidatura (deve falhar)
   curl -X POST http://localhost:3000/api/applications \
     -H "Content-Type: application/json" \
     -d '{"user_id": 1, "job_id": 1}'
   ```
   **Resultado esperado**: Erro 400 informando que já existe candidatura

### Cenário 3: Teste de Performance

1. **Criar múltiplos usuários**:
   ```bash
   for i in {1..10}; do
     curl -X POST http://localhost:3000/api/users \
       -H "Content-Type: application/json" \
       -d "{\"name\": \"Usuário $i\", \"email\": \"usuario$i@email.com\"}"
   done
   ```

2. **Testar paginação**:
   ```bash
   curl "http://localhost:3000/api/users?page=1&limit=5"
   curl "http://localhost:3000/api/users?page=2&limit=5"
   ```

---

## 🛠️ Comandos Úteis

### Desenvolvimento:

```bash
# Iniciar em modo desenvolvimento (com nodemon)
npm run dev

# Iniciar em modo produção
npm start

# Verificar logs em tempo real
npm run dev | grep -E "(GET|POST|PUT|DELETE)"

# Testar conexão com banco
psql -U postgres -d workbridge -c "SELECT NOW();"
```

### Banco de Dados:

```bash
# Conectar ao banco
psql -U postgres -d workbridge

# Executar schema novamente
psql -U postgres -d workbridge -f database/schema.sql

# Backup do banco
pg_dump -U postgres workbridge > backup.sql

# Restaurar backup
psql -U postgres -d workbridge < backup.sql

# Resetar banco completamente
npm run db:reset
```

### Git e Deploy:

```bash
# Verificar status
git status

# Adicionar mudanças
git add .

# Commit com mensagem
git commit -m "Descrição das mudanças"

# Push para GitHub
git push origin main

# Ver logs do Git
git log --oneline -10
```

### Monitoramento:

```bash
# Verificar processos Node.js
ps aux | grep node

# Verificar uso de porta
lsof -i :3000

# Monitorar logs do sistema
tail -f /var/log/syslog | grep workbridge
```

---

## 🔧 Troubleshooting Rápido

### Problema: Servidor não inicia

**Sintomas**: Erro ao executar `npm run dev`

**Soluções**:
```bash
# 1. Verificar se Node.js está instalado
node --version
npm --version

# 2. Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# 3. Verificar se a porta está livre
lsof -i :3000
# Se ocupada, matar processo ou usar porta diferente
PORT=3001 npm run dev
```

### Problema: Erro de conexão com banco

**Sintomas**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Soluções**:
```bash
# 1. Verificar se PostgreSQL está rodando
sudo service postgresql status
# ou
brew services list | grep postgresql

# 2. Iniciar PostgreSQL
sudo service postgresql start
# ou
brew services start postgresql

# 3. Verificar configurações no .env
cat .env | grep DB_
```

### Problema: Erro 404 nas rotas da API

**Sintomas**: `Cannot GET /api/users`

**Soluções**:
```bash
# 1. Verificar se o servidor está rodando
curl http://localhost:3000/api/health

# 2. Verificar logs do servidor
npm run dev
# Procurar por erros nos logs

# 3. Testar rota específica
curl -v http://localhost:3000/api/users
```

### Problema: CORS Error no frontend

**Sintomas**: `Access to fetch at 'http://localhost:3000/api/users' has been blocked by CORS policy`

**Soluções**:
```javascript
// Verificar configuração CORS no server.js
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
```

### Problema: Dados não aparecem no frontend

**Sintomas**: Frontend carrega mas não mostra dados da API

**Soluções**:
```bash
# 1. Verificar se API está retornando dados
curl http://localhost:3000/api/users

# 2. Verificar console do navegador (F12)
# Procurar por erros JavaScript

# 3. Testar requisição manualmente
fetch('http://localhost:3000/api/users')
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 📊 Monitoramento e Métricas

### Endpoints de Monitoramento:

```bash
# Health check geral
curl http://localhost:3000/api/health

# Status do banco de dados
curl http://localhost:3000/api/db-status

# Contar usuários cadastrados
curl http://localhost:3000/api/users | jq '.count'

# Contar vagas ativas
curl http://localhost:3000/api/jobs | jq '.count'
```

### Logs Úteis:

```bash
# Filtrar apenas requisições HTTP
npm run dev | grep -E "(GET|POST|PUT|DELETE)"

# Monitorar erros
npm run dev | grep -i error

# Verificar conexões com banco
npm run dev | grep -i "conectado\|erro.*banco"
```

---

## 🎯 Próximos Passos

### Para Desenvolvedores:

1. **Implementar Autenticação**:
   - Sistema de login/logout
   - JWT tokens
   - Middleware de autenticação

2. **Adicionar Validações**:
   - Validação de email único
   - Validação de CPF/CNPJ
   - Sanitização de inputs

3. **Implementar Testes**:
   - Unit tests com Jest
   - Integration tests
   - E2E tests

4. **Melhorar Performance**:
   - Implementar cache
   - Otimizar queries do banco
   - Compressão de responses

### Para Usuários:

1. **Funcionalidades Adicionais**:
   - Upload de currículo
   - Sistema de favoritos
   - Notificações por email
   - Chat entre candidatos e empresas

2. **Melhorias na Interface**:
   - Dashboard do usuário
   - Filtros avançados de busca
   - Sistema de avaliações
   - Relatórios e estatísticas

---

**Este guia prático fornece exemplos concretos e soluções rápidas para os problemas mais comuns, facilitando o uso e desenvolvimento do projeto WorkBridge.**
