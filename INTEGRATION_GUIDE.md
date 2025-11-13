# 🔗 Guia de Integração Frontend-Backend - WorkBridge

## ✅ Resumo das Implementações

### 🎯 Backend
- ✅ **Endpoint de Login**: `POST /api/login`
- ✅ **Endpoint de Cadastro**: `POST /api/usuarios`
- ✅ Validações de campos obrigatórios
- ✅ Tratamento de erros (email/CPF duplicado)
- ✅ Resposta padronizada em JSON

### 🎨 Frontend
- ✅ **Campo CPF/CNPJ** adicionado ao cadastro
- ✅ **Validação completa** de CPF/CNPJ (algoritmo oficial)
- ✅ **Formatação automática** de CPF/CNPJ e telefone
- ✅ **Integração real com API** (substituiu simulações)
- ✅ **Feedback visual** de erros e sucesso
- ✅ **Redirecionamento** após login/cadastro

---

## 🚀 Como Testar a Integração

### 1️⃣ Iniciar o Backend

```bash
# No diretório raiz do projeto
npm install
npm start
```

**Saída esperada:**
```
✅ Conectado ao banco de dados PostgreSQL
Server running on http://localhost:3000
```

### 2️⃣ Testar a API (Opcional)

Você pode testar os endpoints diretamente:

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Cadastro de Usuário:**
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "tipo": "CONTRATANTE",
    "cpf_cnpj": "12345678901",
    "email": "joao@teste.com",
    "telefone": "11999999999",
    "senha_hash": "senha123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@teste.com",
    "senha": "senha123"
  }'
```

### 3️⃣ Testar o Frontend

1. **Abra o cadastro no navegador:**
   - Navegue até: `cadastro.html`
   - Ou abra diretamente: `file:///caminho/para/cadastro.html`

2. **Preencha o formulário:**
   - **Nome Completo**: João Silva
   - **CPF/CNPJ**: 123.456.789-01 (será validado)
   - **E-mail**: joao@teste.com
   - **Telefone**: (11) 99999-9999 (formatação automática)
   - **Senha**: Senha123! (mínimo 8 caracteres)
   - **Confirmar Senha**: Senha123!
   - **Tipo**: Selecione Contratante ou Profissional
   - ✅ Aceite os termos

3. **Clique em "Criar Conta"**
   - ⏳ O botão mostrará estado de carregamento
   - ✅ Se sucesso: mensagem de confirmação + redirecionamento para login
   - ❌ Se erro: mensagem específica (ex: "Email já cadastrado")

4. **Teste o Login:**
   - Abra `login.html`
   - Digite o e-mail e senha cadastrados
   - Clique em "Entrar"
   - ✅ Se sucesso: redirecionamento para landing page

---

## 📋 Validações Implementadas

### Cadastro:
- ✅ Nome completo (mínimo 2 palavras)
- ✅ CPF/CNPJ válido (algoritmo de validação oficial)
- ✅ E-mail válido (formato)
- ✅ Telefone válido (formato brasileiro)
- ✅ Senha forte (mínimo 8 caracteres)
- ✅ Confirmação de senha
- ✅ Tipo de usuário selecionado
- ✅ Termos aceitos

### Login:
- ✅ E-mail válido
- ✅ Senha preenchida

---

## 🔧 Estrutura de Dados

### Cadastro - Request
```json
{
  "nome_completo": "João Silva",
  "tipo": "CONTRATANTE",
  "cpf_cnpj": "12345678901",
  "email": "joao@teste.com",
  "telefone": "11999999999",
  "senha_hash": "senha123",
  "aceitou_termos_em": "2025-10-22T12:00:00.000Z",
  "aceitou_privacidade_em": "2025-10-22T12:00:00.000Z"
}
```

### Cadastro - Response (Sucesso)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome_completo": "João Silva",
    "tipo": "CONTRATANTE",
    "email": "joao@teste.com",
    "criado_em": "2025-10-22T12:00:00.000Z"
  },
  "message": "Usuário criado com sucesso!"
}
```

### Login - Request
```json
{
  "email": "joao@teste.com",
  "senha": "senha123"
}
```

### Login - Response (Sucesso)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome_completo": "João Silva",
    "tipo": "CONTRATANTE",
    "email": "joao@teste.com",
    "telefone": "11999999999"
  },
  "message": "Login realizado com sucesso!"
}
```

---

## ⚠️ Tratamento de Erros

### Erros Comuns:

**1. Email já cadastrado:**
```json
{
  "success": false,
  "message": "Email ou CPF/CNPJ já cadastrado"
}
```
- Frontend exibe erro no campo de e-mail

**2. Login inválido:**
```json
{
  "success": false,
  "message": "Email ou senha incorretos"
}
```
- Frontend exibe erro nos campos de e-mail e senha

**3. Servidor offline:**
- Frontend exibe: "Erro ao conectar com o servidor. Verifique se o backend está rodando (npm start)."

---

## 🧪 Casos de Teste

### ✅ Teste 1: Cadastro com Sucesso
1. Preencha todos os campos corretamente
2. Use CPF válido: 123.456.789-09
3. Use email único
4. Clique em "Criar Conta"
5. **Esperado**: Mensagem de sucesso + redirecionamento

### ✅ Teste 2: CPF Inválido
1. Digite CPF inválido: 111.111.111-11
2. Tente enviar o formulário
3. **Esperado**: Erro "Por favor, informe um CPF ou CNPJ válido"

### ✅ Teste 3: Email Duplicado
1. Cadastre um usuário
2. Tente cadastrar novamente com mesmo email
3. **Esperado**: Erro "Email ou CPF/CNPJ já cadastrado"

### ✅ Teste 4: Login com Sucesso
1. Use credenciais de usuário cadastrado
2. Clique em "Entrar"
3. **Esperado**: Mensagem de sucesso + redirecionamento

### ✅ Teste 5: Login com Senha Errada
1. Use email válido e senha incorreta
2. Clique em "Entrar"
3. **Esperado**: Erro "Email ou senha incorretos"

---

## 🔐 Segurança

### ⚠️ Notas Importantes:

1. **Senha em Texto Plano**: 
   - Atualmente a senha é armazenada em texto plano
   - **TODO**: Implementar bcrypt para hash de senhas

2. **Sem Autenticação JWT**:
   - Não há tokens de autenticação ainda
   - **TODO**: Implementar JWT para sessões

3. **CORS Habilitado**:
   - Backend aceita requisições de qualquer origem
   - **TODO**: Configurar CORS para produção

---

## 📝 Melhorias Futuras

### Backend:
- [ ] Implementar bcrypt para hash de senhas
- [ ] Adicionar JWT para autenticação
- [ ] Implementar rate limiting
- [ ] Adicionar logs de auditoria
- [ ] Validação de força de senha no backend

### Frontend:
- [ ] Implementar toast notifications (ao invés de alert)
- [ ] Adicionar loading skeleton
- [ ] Implementar recuperação de senha
- [ ] Adicionar validação de senha em tempo real
- [ ] Implementar dashboard após login

---

## 🐛 Troubleshooting

### Problema: "Erro ao conectar com o servidor"
**Solução:**
1. Verifique se o backend está rodando (`npm start`)
2. Verifique se a porta 3000 está disponível
3. Confirme que não há firewall bloqueando

### Problema: "Email ou CPF/CNPJ já cadastrado"
**Solução:**
1. Use um email diferente
2. Ou limpe o banco de dados e tente novamente

### Problema: CPF não valida
**Solução:**
1. Use um CPF válido (algoritmo oficial)
2. Ou use o gerador: [4devs.com.br/gerador_de_cpf](https://www.4devs.com.br/gerador_de_cpf)

---

## 📚 Documentação Adicional

- **API Documentation**: Ver `API.md`
- **Database Schema**: Ver `database/schema.sql`
- **Technical Docs**: Ver `DOCUMENTATION.md`

---

## ✨ Status da Integração

| Funcionalidade | Status | Observações |
|----------------|--------|-------------|
| Cadastro de usuário | ✅ Completo | Com validações |
| Login de usuário | ✅ Completo | Com validações |
| Validação CPF/CNPJ | ✅ Completo | Algoritmo oficial |
| Formatação automática | ✅ Completo | CPF/CNPJ e telefone |
| Tratamento de erros | ✅ Completo | Feedback visual |
| Redirecionamento | ✅ Completo | Após cadastro/login |
| Hash de senhas | ⏳ Pendente | Usar bcrypt |
| JWT Tokens | ⏳ Pendente | Para autenticação |
| Dashboard | ⏳ Pendente | Após login |

---

**🎉 Integração Frontend-Backend Concluída com Sucesso!**

Para dúvidas ou sugestões, consulte a documentação completa ou abra uma issue no repositório.


