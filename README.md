# 🚀 WorkBridge - Plataforma de Conectividade Profissional

WorkBridge é uma plataforma inovadora que conecta contratantes com profissionais especializados em construção e serviços, oferecendo um sistema completo de solicitação de orçamentos, propostas e gestão de projetos.

## 📋 Funcionalidades

- **👥 Gestão de Usuários**: Cadastro de contratantes e profissionais especializados
- **🏗️ Especialidades**: Sistema de categorização por área de atuação (Alvenaria, Hidráulica, Elétrica, etc.)
- **📍 Localização**: Gestão de UFs, cidades e áreas de atendimento
- **💰 Solicitações de Orçamento**: Sistema completo de solicitação e gestão de orçamentos
- **📝 Propostas**: Envio e gestão de propostas pelos profissionais
- **🔨 Jobs**: Gestão completa de projetos contratados
- **💬 Chat**: Sistema de mensagens entre contratantes e profissionais
- **⭐ Avaliações**: Sistema bilateral de avaliações e reviews
- **💳 Pagamentos**: Sistema de pagamentos com escrow e carteira digital
- **📊 Portfolio**: Galeria de trabalhos realizados pelos profissionais

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional com schema otimizado
- **pgcrypto** - Extensão para UUIDs e criptografia
- **citext** - Extensão para emails case-insensitive
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
- `GET /api/usuarios` - Lista todos os usuários (contratantes e profissionais)
- `POST /api/usuarios` - Cria um novo usuário
- `GET /api/usuarios/:id` - Busca usuário por ID

#### Profissionais
- `GET /api/profissionais` - Lista profissionais com filtros
- `GET /api/profissionais/:id` - Busca profissional por ID com detalhes completos
- `POST /api/profissionais/:id/especialidades` - Adiciona especialidade ao profissional
- `POST /api/profissionais/:id/cidades` - Adiciona cidade de atendimento
- `POST /api/profissionais/:id/portfolio` - Adiciona item ao portfolio

#### Suporte
- `GET /api/ufs` - Lista todas as UFs
- `GET /api/cidades/:uf` - Lista cidades por UF
- `GET /api/especialidades` - Lista todas as especialidades

#### Solicitações de Orçamento
- `GET /api/solicitacoes-orcamento` - Lista solicitações com filtros
- `POST /api/solicitacoes-orcamento` - Cria nova solicitação de orçamento

#### Propostas
- `GET /api/propostas` - Lista propostas com filtros
- `POST /api/propostas` - Cria nova proposta
- `PUT /api/propostas/:id/aceitar` - Aceita uma proposta

#### Jobs
- `GET /api/jobs` - Lista jobs com filtros

#### Chat
- `POST /api/conversas` - Cria nova conversa
- `POST /api/mensagens` - Envia mensagem
- `GET /api/conversas/:id/mensagens` - Lista mensagens da conversa

#### Avaliações
- `POST /api/avaliacoes/profissional` - Avalia profissional
- `POST /api/avaliacoes/contratante` - Avalia contratante

### Exemplo de Uso da API

#### Criar um profissional:
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "tipo": "PROFISSIONAL",
    "cpf_cnpj": "123.456.789-00",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "cidade_id": "uuid-da-cidade",
    "aceitou_termos_em": "2025-01-22T15:30:00.000Z",
    "aceitou_privacidade_em": "2025-01-22T15:30:00.000Z"
  }'
```

#### Criar uma solicitação de orçamento:
```bash
curl -X POST http://localhost:3000/api/solicitacoes-orcamento \
  -H "Content-Type: application/json" \
  -d '{
    "contratante_id": "uuid-do-contratante",
    "profissional_id": "uuid-do-profissional",
    "titulo": "Reforma do banheiro",
    "descricao": "Preciso reformar o banheiro completo com novo piso e azulejos",
    "cidade_id": "uuid-da-cidade",
    "data_desejada_ini": "2025-02-01"
  }'
```

#### Enviar uma proposta:
```bash
curl -X POST http://localhost:3000/api/propostas \
  -H "Content-Type: application/json" \
  -d '{
    "solicitacao_id": "uuid-da-solicitacao",
    "profissional_id": "uuid-do-profissional",
    "valor_mao_obra_cents": 500000,
    "valor_material_cents": 300000,
    "data_inicio_prevista": "2025-02-01",
    "data_fim_prevista": "2025-02-15",
    "validade_ate": "2025-01-30",
    "mensagem": "Posso realizar o trabalho conforme solicitado..."
  }'
```

## 🗂️ Estrutura do Projeto

```
WorkBridge/
├── src/
│   └── server.js          # Servidor principal Express.js v2.0
├── database/
│   └── schema.sql         # Schema PostgreSQL completo com regras de negócio
├── public/                # Arquivos estáticos do frontend
│   └── index.html         # Frontend principal
├── css/                   # Estilos CSS
│   └── style.css          # Estilos adicionais
├── js/                    # Scripts JavaScript
│   └── script.js          # JavaScript adicional
├── cadastro.html          # Página de cadastro
├── package.json           # Dependências e scripts
├── README.md              # Documentação principal
├── DOCUMENTATION.md       # Documentação técnica completa
├── GUIDE.md               # Guia prático de uso
├── API.md                 # Documentação da API
├── .gitignore             # Arquivos ignorados pelo Git
└── config.example         # Exemplo de configuração
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
- [ ] Upload de fotos e documentos
- [ ] Sistema de notificações por email e push
- [ ] Dashboard administrativo completo
- [ ] Sistema de pagamentos integrado (Stripe/Mercado Pago)
- [ ] Aplicativo mobile (React Native)
- [ ] Sistema de geolocalização para busca por proximidade
- [ ] Chat em tempo real com WebSocket
- [ ] Sistema de garantia e seguro
- [ ] Relatórios e analytics avançados

---

⭐ **Se este projeto foi útil para você, não esqueça de dar uma estrela!** ⭐
