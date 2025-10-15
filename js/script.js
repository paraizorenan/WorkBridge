/* ============================================
   WORK BRIDGE - LÓGICA DA TELA DE LOGIN
   Validações, interações e preparação para backend
   ============================================ */

// ===== ELEMENTOS DO DOM =====
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const googleBtn = document.getElementById('googleBtn');
const facebookBtn = document.getElementById('facebookBtn');

// ===== CONFIGURAÇÕES =====
const CONFIG = {
    minPasswordLength: 6,
    apiEndpoint: '/api/login', // Endpoint futuro do backend
    debugMode: true // Alterar para false em produção
};

// ===== UTILITÁRIOS DE VALIDAÇÃO =====

/**
 * Valida o formato do e-mail
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} - Retorna true se o e-mail for válido
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida se a senha atende aos requisitos mínimos
 * @param {string} password - Senha a ser validada
 * @returns {boolean} - Retorna true se a senha for válida
 */
function isValidPassword(password) {
    return password.length >= CONFIG.minPasswordLength;
}

// ===== FUNÇÕES DE FEEDBACK VISUAL =====

/**
 * Exibe mensagem de erro em um campo específico
 * @param {HTMLElement} input - Campo de input
 * @param {string} message - Mensagem de erro a ser exibida
 */
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    // Adiciona classe de erro ao input
    input.classList.add('error', 'shake');
    
    // Exibe a mensagem de erro
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Remove animação de shake após completar
    setTimeout(() => {
        input.classList.remove('shake');
    }, 300);
}

/**
 * Remove mensagem de erro de um campo específico
 * @param {HTMLElement} input - Campo de input
 */
function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    input.classList.remove('error');
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
}

/**
 * Altera o estado do botão de login (carregando ou normal)
 * @param {boolean} isLoading - Se true, mostra estado de carregamento
 */
function setButtonLoading(isLoading) {
    if (isLoading) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

// ===== VALIDAÇÃO DO FORMULÁRIO =====

/**
 * Valida o campo de e-mail
 * @returns {boolean} - Retorna true se o e-mail for válido
 */
function validateEmail() {
    const email = emailInput.value.trim();
    
    if (email === '') {
        showError(emailInput, 'Por favor, informe seu e-mail');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showError(emailInput, 'Por favor, informe um e-mail válido');
        return false;
    }
    
    clearError(emailInput);
    return true;
}

/**
 * Valida o campo de senha
 * @returns {boolean} - Retorna true se a senha for válida
 */
function validatePassword() {
    const password = passwordInput.value;
    
    if (password === '') {
        showError(passwordInput, 'Por favor, informe sua senha');
        return false;
    }
    
    if (!isValidPassword(password)) {
        showError(passwordInput, `A senha deve ter no mínimo ${CONFIG.minPasswordLength} caracteres`);
        return false;
    }
    
    clearError(passwordInput);
    return true;
}

/**
 * Valida todos os campos do formulário
 * @returns {boolean} - Retorna true se todos os campos forem válidos
 */
function validateForm() {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    return isEmailValid && isPasswordValid;
}

// ===== FUNÇÕES DE LOGIN =====

/**
 * Processa o login do usuário
 * Simula chamada à API e preparação para integração com backend
 */
async function handleLogin(event) {
    event.preventDefault();
    
    // Valida o formulário antes de prosseguir
    if (!validateForm()) {
        return;
    }
    
    // Obtém os valores dos campos
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Debug: Exibe os dados no console (remover em produção)
    if (CONFIG.debugMode) {
        console.log('=== TENTATIVA DE LOGIN ===');
        console.log('E-mail:', email);
        console.log('Senha:', '*'.repeat(password.length));
        console.log('Timestamp:', new Date().toISOString());
    }
    
    // Ativa estado de carregamento
    setButtonLoading(true);
    
    try {
        // Simula chamada à API (substituir por chamada real ao backend)
        const response = await simulateApiCall(email, password);
        
        if (response.success) {
            console.log('✅ Login realizado com sucesso!');
            console.log('Token:', response.token);
            console.log('Usuário:', response.user);
            
            // Aqui você pode:
            // 1. Salvar o token no localStorage
            // localStorage.setItem('authToken', response.token);
            
            // 2. Redirecionar para o dashboard
            // window.location.href = '/dashboard.html';
            
            // 3. Exibir mensagem de sucesso
            alert('Login realizado com sucesso! Bem-vindo ao Work Bridge 🎉');
            
        } else {
            // Exibe erro retornado pela API
            showError(emailInput, response.message || 'E-mail ou senha incorretos');
        }
        
    } catch (error) {
        console.error('❌ Erro ao fazer login:', error);
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        
    } finally {
        // Desativa estado de carregamento
        setButtonLoading(false);
    }
}

/**
 * Simula chamada à API de login
 * ⚠️ ESTA FUNÇÃO SERÁ SUBSTITUÍDA PELA INTEGRAÇÃO REAL COM O BACKEND
 * 
 * @param {string} email - E-mail do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise} - Promise com resposta simulada da API
 */
function simulateApiCall(email, password) {
    return new Promise((resolve) => {
        // Simula delay de rede (1-2 segundos)
        const delay = 1000 + Math.random() * 1000;
        
        setTimeout(() => {
            // Simula resposta bem-sucedida
            // Em produção, isto será substituído por:
            // const response = await fetch(CONFIG.apiEndpoint, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password })
            // });
            // const data = await response.json();
            
            resolve({
                success: true,
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example',
                user: {
                    id: 1,
                    name: 'Usuário Teste',
                    email: email,
                    role: 'contratante'
                }
            });
        }, delay);
    });
}

/**
 * Processa login via Google
 */
function handleGoogleLogin() {
    console.log('🔵 Iniciando login com Google...');
    
    // Aqui será implementada a integração com Google OAuth
    // Exemplo: window.location.href = '/auth/google';
    
    alert('Login com Google será implementado em breve! 🔵');
}

/**
 * Processa login via Facebook
 */
function handleFacebookLogin() {
    console.log('🔵 Iniciando login com Facebook...');
    
    // Aqui será implementada a integração com Facebook OAuth
    // Exemplo: window.location.href = '/auth/facebook';
    
    alert('Login com Facebook será implementado em breve! 🔵');
}

// ===== EVENT LISTENERS =====

// Validação em tempo real ao digitar
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

// Limpa erros ao começar a digitar
emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
        clearError(emailInput);
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('error')) {
        clearError(passwordInput);
    }
});

// Permite fazer login pressionando Enter
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLogin(e);
    }
});

// Submissão do formulário
loginForm.addEventListener('submit', handleLogin);

// Botões de login social
googleBtn.addEventListener('click', handleGoogleLogin);
facebookBtn.addEventListener('click', handleFacebookLogin);

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Work Bridge - Sistema de Login Inicializado');
    console.log('📝 Pronto para integração com backend Node.js');
    
    // Foca no campo de e-mail ao carregar a página
    emailInput.focus();
});

// ===== FUNÇÕES AUXILIARES PARA INTEGRAÇÃO FUTURA =====

/**
 * Exemplo de função para integração real com backend
 * Descomente e adapte quando o backend estiver pronto
 */
/*
async function loginWithBackend(email, password) {
    try {
        const response = await fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            throw new Error('Erro na autenticação');
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
}
*/

