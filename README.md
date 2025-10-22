# 🚀 WorkBridge - Plataforma de Conectividade Profissional

WorkBridge é uma plataforma inovadora que conecta profissionais talentosos com as melhores oportunidades de trabalho, oferecendo um sistema completo de matchmaking entre candidatos e empresas.

## 📋 Funcionalidades

- **👥 Gestão de Usuários**: Cadastro e perfil completo de profissionais
- **🏢 Gestão de Empresas**: Cadastro de empresas e suas informações
- **💼 Sistema de Vagas**: Publicação e busca de oportunidades de trabalho
- **📝 Candidaturas**: Sistema completo de aplicação para vagas
- **⭐ Favoritos**: Usuários podem favoritar vagas de interesse
- **💬 Sistema de Mensagens**: Chat entre candidatos e recrutadores
- **🔍 Busca Inteligente**: Filtros avançados para encontrar oportunidades ideais

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **CORS** - Middleware para requisições cross-origin
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com gradientes e animações
- **JavaScript** - Interatividade e funcionalidades dinâmicas

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- PostgreSQL (versão 12 ou superior)
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/paraizorenan/WorkBridge.git
cd WorkBridge
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados PostgreSQL

#### Opção A: Usando Docker (Recomendado)
```bash
# Instale o Docker e execute:
docker run --name workbridge-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=workbridge -p 5432:5432 -d postgres:13
```

#### Opção B: Instalação local
1. Instale o PostgreSQL em sua máquina
2. Crie um banco de dados chamado `workbridge`
3. Configure um usuário com permissões adequadas

### 4. Execute o script de inicialização do banco
```bash
# Conecte-se ao PostgreSQL e execute:
psql -U postgres -d workbridge -f database/schema.sql
```

### 5. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo:
cp env.example .env

# Edite o arquivo .env com suas configurações:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=workbridge
# DB_USER=postgres
# DB_PASSWORD=sua_senha_aqui
```

### 6. Inicie o servidor
```bash
# Modo desenvolvimento (com nodemon):
npm run dev

# Modo produção:
npm start
```

## 🌐 Acesso à Aplicação

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

## 📚 Documentação da API

### Endpoints Principais

#### Usuários
- `GET /api/users` - Lista todos os usuários
- `POST /api/users` - Cria um novo usuário
- `GET /api/users/:id` - Busca usuário por ID
- `PUT /api/users/:id` - Atualiza usuário
- `DELETE /api/users/:id` - Remove usuário

#### Vagas
- `GET /api/jobs` - Lista todas as vagas
- `POST /api/jobs` - Cria uma nova vaga
- `GET /api/jobs/:id` - Busca vaga por ID
- `PUT /api/jobs/:id` - Atualiza vaga
- `DELETE /api/jobs/:id` - Remove vaga

#### Candidaturas
- `GET /api/applications` - Lista candidaturas
- `POST /api/applications` - Cria nova candidatura
- `GET /api/applications/:id` - Busca candidatura por ID
- `PUT /api/applications/:id` - Atualiza status da candidatura

### Exemplo de Uso da API

#### Criar um usuário:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "profession": "Desenvolvedor Full Stack",
    "location": "São Paulo, SP"
  }'
```

#### Criar uma vaga:
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Desenvolvedor React Senior",
    "description": "Procuramos desenvolvedor React com experiência em projetos grandes",
    "company": "TechCorp Brasil",
    "location": "São Paulo, SP",
    "salary": "8000-12000"
  }'
```

## 🗂️ Estrutura do Projeto

```
WorkBridge/
├── src/
│   └── server.js          # Servidor principal
├── database/
│   └── schema.sql         # Script de inicialização do banco
├── public/                # Arquivos estáticos (se necessário)
├── index.html             # Frontend principal
├── package.json           # Dependências e scripts
├── .gitignore            # Arquivos ignorados pelo Git
├── env.example           # Exemplo de variáveis de ambiente
└── README.md             # Este arquivo
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon
- `npm start` - Inicia o servidor em modo produção
- `npm test` - Executa os testes (a implementar)

## 🚀 Deploy

### Deploy no Heroku
1. Instale o Heroku CLI
2. Crie uma aplicação: `heroku create workbridge-app`
3. Configure as variáveis de ambiente no Heroku
4. Faça o deploy: `git push heroku main`

### Deploy no Railway
1. Conecte seu repositório GitHub ao Railway
2. Configure as variáveis de ambiente
3. O deploy será automático

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- **Renan Paraizo** - Desenvolvedor Full Stack

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.

## 🎯 Roadmap

- [ ] Sistema de autenticação com JWT
- [ ] Upload de currículos e documentos
- [ ] Sistema de notificações por email
- [ ] Dashboard administrativo
- [ ] API de integração com LinkedIn
- [ ] Sistema de avaliações e reviews
- [ ] Chat em tempo real com WebSocket
- [ ] Aplicativo mobile (React Native)

---

⭐ **Se este projeto foi útil para você, não esqueça de dar uma estrela!** ⭐
