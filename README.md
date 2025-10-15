# 🚀 Work Bridge - Tela de Login

Plataforma web que conecta contratantes e profissionais da construção civil.

## 📋 Sobre o Projeto

Esta é a implementação da **User Story US1.1 (Gestão de Contas e Perfis de Usuário)** - Tela de Login.

O Work Bridge é uma plataforma completa para gerenciamento de contratações na construção civil, facilitando a conexão entre profissionais qualificados e empresas contratantes.

## ✨ Funcionalidades Implementadas

### Autenticação
- ✅ Login com e-mail e senha
- ✅ Login social (Google e Facebook) - preparado para integração
- ✅ Opção "Lembrar-me"
- ✅ Link para recuperação de senha
- ✅ Link para criação de nova conta

### Validações
- ✅ Validação de formato de e-mail
- ✅ Validação de senha (mínimo 6 caracteres)
- ✅ Validação em tempo real (ao sair do campo)
- ✅ Mensagens de erro personalizadas
- ✅ Feedback visual para campos inválidos

### UX/UI
- ✅ Design moderno e profissional
- ✅ Responsivo (mobile-first)
- ✅ Animações suaves de hover e transição
- ✅ Estado de carregamento no botão de login
- ✅ Ícones intuitivos (Font Awesome)
- ✅ Paleta de cores atraente e profissional
- ✅ Tipografia moderna (Poppins)

## 📁 Estrutura do Projeto

```
workbridge/
├── index.html           # Página principal de login
├── css/
│   └── style.css       # Estilos CSS completos e organizados
├── js/
│   └── script.js       # Lógica JavaScript com validações
├── assets/             # Pasta para imagens e recursos
│   └── (logo.png)      # Logo do projeto (opcional)
└── README.md           # Documentação do projeto
```

## 🎨 Paleta de Cores

- **Primary**: `#4A90E2` (Azul)
- **Primary Dark**: `#357ABD`
- **Secondary**: `#50C878` (Verde)
- **Error**: `#E74C3C` (Vermelho)
- **Background Gradient**: Roxo/Rosa suave

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com Flexbox e Grid
- **JavaScript (Vanilla)** - Lógica e validações
- **Font Awesome 6.4** - Biblioteca de ícones
- **Google Fonts (Poppins)** - Tipografia

## 🚀 Como Usar

1. **Clone o repositório**
   ```bash
   git clone https://github.com/paraizorenan/WorkBridge.git
   cd WorkBridge
   ```

2. **Abra o arquivo index.html**
   - Você pode abrir diretamente no navegador
   - Ou usar um servidor local (recomendado):
   ```bash
   # Com Python 3
   python -m http.server 8000
   
   # Com Node.js (usando npx)
   npx serve
   ```

3. **Acesse no navegador**
   - Abra: `http://localhost:8000`
   - Ou apenas abra o arquivo `index.html` diretamente

## 🧪 Testando a Aplicação

### Validações Implementadas

1. **E-mail em branco**
   - Deixe o campo vazio e clique em "Entrar"
   - Mensagem: "Por favor, informe seu e-mail"

2. **E-mail inválido**
   - Digite: `teste@` ou `teste.com`
   - Mensagem: "Por favor, informe um e-mail válido"

3. **Senha em branco**
   - Deixe o campo senha vazio
   - Mensagem: "Por favor, informe sua senha"

4. **Senha curta**
   - Digite menos de 6 caracteres
   - Mensagem: "A senha deve ter no mínimo 6 caracteres"

5. **Login simulado**
   - Digite um e-mail válido e senha com 6+ caracteres
   - Clique em "Entrar"
   - Abra o Console do navegador (F12) para ver os dados enviados

## 🔐 Segurança

### Implementado
- ✅ Validação client-side
- ✅ Sanitização de entrada
- ✅ Prevenção de envio de formulário vazio
- ✅ Autocomplete adequado para campos sensíveis

### Para Implementar no Backend
- ⏳ Hash de senhas (bcrypt)
- ⏳ Tokens JWT para autenticação
- ⏳ Rate limiting
- ⏳ Proteção CSRF
- ⏳ HTTPS obrigatório
- ⏳ Validação server-side

## 🔌 Integração com Backend

O código está **100% preparado** para integração com backend Node.js.

### Endpoint de API Configurado

```javascript
// Em js/script.js
const CONFIG = {
    apiEndpoint: '/api/login',
    debugMode: true
};
```

### Exemplo de Integração

No arquivo `js/script.js`, há uma função comentada `loginWithBackend()` pronta para uso:

```javascript
async function loginWithBackend(email, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    return data;
}
```

### Próximos Passos para Backend

1. Criar endpoint `/api/login` no Node.js
2. Implementar verificação de credenciais
3. Gerar e retornar token JWT
4. Implementar OAuth para Google/Facebook
5. Adicionar middleware de autenticação

## 📱 Responsividade

A interface se adapta perfeitamente a diferentes tamanhos de tela:

- **Desktop**: Layout completo com todos os elementos
- **Tablet** (≤768px): Ajuste de tamanhos e espaçamentos
- **Mobile** (≤480px): Layout vertical otimizado

## 🎯 Próximas Implementações

- [ ] Tela de Cadastro (`cadastro.html`)
- [ ] Tela de Recuperação de Senha
- [ ] Dashboard do Usuário
- [ ] Perfil de Profissional/Contratante
- [ ] Integração com backend Node.js
- [ ] Autenticação JWT
- [ ] OAuth (Google/Facebook)
- [ ] Sistema de notificações

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para conectar talentos e oportunidades na construção civil.

---

**Work Bridge** - *Construindo pontes entre profissionais e oportunidades* 🏗️

