/* ============================================
   WORK BRIDGE - LÓGICA DA TELA DE LOGIN
   Validações, interações e preparação para backend
   ============================================ */

// ===== ELEMENTOS DO DOM =====
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const googleBtn = document.getElementById('googleBtn');
const facebookBtn = document.getElementById('facebookBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');
const facebookSignupBtn = document.getElementById('facebookSignupBtn');

// Elementos específicos do cadastro
const fullNameInput = document.getElementById('fullName');
const cpfCnpjInput = document.getElementById('cpfCnpj');
const phoneInput = document.getElementById('phone');
const confirmPasswordInput = document.getElementById('confirmPassword');
const userTypeInputs = document.querySelectorAll('input[name="userType"]');
const acceptTermsInput = document.getElementById('acceptTerms');

// ===== CONFIGURAÇÕES =====
const CONFIG = {
    minPasswordLength: 8,
    apiBaseUrl: 'http://localhost:3000/api', // Base URL da API
    apiEndpoint: 'http://localhost:3000/api/login', // Endpoint de login
    signupEndpoint: 'http://localhost:3000/api/usuarios', // Endpoint de cadastro
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

/**
 * Valida o formato do telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} - Retorna true se o telefone for válido
 */
function isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
}

/**
 * Valida se o nome completo tem pelo menos 2 palavras
 * @param {string} name - Nome a ser validado
 * @returns {boolean} - Retorna true se o nome for válido
 */
function isValidFullName(name) {
    const words = name.trim().split(/\s+/);
    return words.length >= 2 && words.every(word => word.length >= 2);
}

/**
 * Valida CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - Retorna true se o CPF for válido
 */
function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    return digit === parseInt(cpf.charAt(10));
}

/**
 * Valida CNPJ
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean} - Retorna true se o CNPJ for válido
 */
function isValidCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
    
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result === parseInt(digits.charAt(1));
}

/**
 * Valida CPF ou CNPJ
 * @param {string} value - CPF/CNPJ a ser validado
 * @returns {boolean} - Retorna true se for válido
 */
function isValidCpfCnpj(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) return isValidCPF(numbers);
    if (numbers.length === 14) return isValidCNPJ(numbers);
    return false;
}

/**
 * Calcula a força da senha
 * @param {string} password - Senha a ser analisada
 * @returns {object} - Objeto com nível e texto da força
 */
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score += 1;
    else feedback.push('Mínimo 8 caracteres');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Letras minúsculas');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Letras maiúsculas');
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Números');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Caracteres especiais');
    
    const levels = ['', 'weak', 'fair', 'good', 'strong'];
    const texts = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
    
    return {
        level: levels[score] || '',
        text: texts[score] || 'Muito fraca',
        score: score,
        feedback: feedback
    };
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

/**
 * Altera o estado do botão de cadastro (carregando ou normal)
 * @param {boolean} isLoading - Se true, mostra estado de carregamento
 */
function setSignupButtonLoading(isLoading) {
    if (isLoading) {
        signupBtn.classList.add('loading');
        signupBtn.disabled = true;
    } else {
        signupBtn.classList.remove('loading');
        signupBtn.disabled = false;
    }
}

/**
 * Atualiza o indicador de força da senha
 * @param {string} password - Senha a ser analisada
 */
function updatePasswordStrength(password) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthFill || !strengthText) return;
    
    if (password === '') {
        strengthFill.className = 'strength-fill';
        strengthText.textContent = 'Digite uma senha';
        return;
    }
    
    const strength = calculatePasswordStrength(password);
    strengthFill.className = `strength-fill ${strength.level}`;
    strengthText.textContent = strength.text;
}

/**
 * Formata o telefone conforme o usuário digita
 * @param {string} value - Valor do input
 * @returns {string} - Telefone formatado
 */
function formatPhone(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

/**
 * Formata CPF/CNPJ conforme o usuário digita
 * @param {string} value - Valor do input
 * @returns {string} - CPF/CNPJ formatado
 */
function formatCpfCnpj(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
        // Formata como CPF
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
        if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
        return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    } else {
        // Formata como CNPJ
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
        if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
        if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }
}

/**
 * Alterna a visibilidade da senha
 * @param {string} inputId - ID do input de senha
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggle.className = 'fas fa-eye';
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

// ===== VALIDAÇÃO DO FORMULÁRIO DE CADASTRO =====

/**
 * Valida o campo de nome completo
 * @returns {boolean} - Retorna true se o nome for válido
 */
function validateFullName() {
    const name = fullNameInput.value.trim();
    
    if (name === '') {
        showError(fullNameInput, 'Por favor, informe seu nome completo');
        return false;
    }
    
    if (!isValidFullName(name)) {
        showError(fullNameInput, 'Por favor, informe seu nome e sobrenome');
        return false;
    }
    
    clearError(fullNameInput);
    return true;
}

/**
 * Valida o campo de CPF/CNPJ
 * @returns {boolean} - Retorna true se o CPF/CNPJ for válido
 */
function validateCpfCnpj() {
    const cpfCnpj = cpfCnpjInput.value.trim();
    
    if (cpfCnpj === '') {
        showError(cpfCnpjInput, 'Por favor, informe seu CPF ou CNPJ');
        return false;
    }
    
    if (!isValidCpfCnpj(cpfCnpj)) {
        showError(cpfCnpjInput, 'Por favor, informe um CPF ou CNPJ válido');
        return false;
    }
    
    clearError(cpfCnpjInput);
    return true;
}

/**
 * Valida o campo de telefone
 * @returns {boolean} - Retorna true se o telefone for válido
 */
function validatePhone() {
    const phone = phoneInput.value.trim();
    
    if (phone === '') {
        showError(phoneInput, 'Por favor, informe seu telefone');
        return false;
    }
    
    if (!isValidPhone(phone)) {
        showError(phoneInput, 'Por favor, informe um telefone válido');
        return false;
    }
    
    clearError(phoneInput);
    return true;
}

/**
 * Valida o campo de confirmação de senha
 * @returns {boolean} - Retorna true se as senhas coincidirem
 */
function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword === '') {
        showError(confirmPasswordInput, 'Por favor, confirme sua senha');
        return false;
    }
    
    if (password !== confirmPassword) {
        showError(confirmPasswordInput, 'As senhas não coincidem');
        return false;
    }
    
    clearError(confirmPasswordInput);
    return true;
}

/**
 * Valida o tipo de usuário selecionado
 * @returns {boolean} - Retorna true se um tipo for selecionado
 */
function validateUserType() {
    const selectedType = document.querySelector('input[name="userType"]:checked');
    
    if (!selectedType) {
        const formGroup = document.querySelector('.user-type-selector').closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = 'Por favor, selecione o tipo de usuário';
        errorMessage.classList.add('show');
        return false;
    }
    
    const formGroup = document.querySelector('.user-type-selector').closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    return true;
}

/**
 * Valida a aceitação dos termos
 * @returns {boolean} - Retorna true se os termos forem aceitos
 */
function validateTerms() {
    if (!acceptTermsInput.checked) {
        const formGroup = acceptTermsInput.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = 'Você deve aceitar os termos de uso';
        errorMessage.classList.add('show');
        return false;
    }
    
    const formGroup = acceptTermsInput.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    return true;
}

/**
 * Valida todos os campos do formulário de cadastro
 * @returns {boolean} - Retorna true se todos os campos forem válidos
 */
function validateSignupForm() {
    const isNameValid = validateFullName();
    const isCpfCnpjValid = validateCpfCnpj();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isUserTypeValid = validateUserType();
    const isTermsValid = validateTerms();
    
    return isNameValid && isCpfCnpjValid && isEmailValid && isPhoneValid && 
           isPasswordValid && isConfirmPasswordValid && isUserTypeValid && isTermsValid;
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
        // Chamada real à API de login
        const response = await fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email, 
                senha: password 
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ Login realizado com sucesso!');
            console.log('Usuário:', data.data);
            
            // Salvar dados do usuário no localStorage
            localStorage.setItem('workbridge_user', JSON.stringify(data.data));
            
            // Exibir mensagem de sucesso
            alert(`Login realizado com sucesso!\n\nBem-vindo(a), ${data.data.nome_completo}! 🎉`);
            
            // Redirecionar para a landing page (futuramente será dashboard)
            window.location.href = 'public/index.html';
            
        } else {
            // Exibe erro retornado pela API
            showError(emailInput, data.message || 'E-mail ou senha incorretos');
            if (data.message) {
                showError(passwordInput, ''); // Marca o campo de senha como erro também
            }
        }
        
    } catch (error) {
        console.error('❌ Erro ao fazer login:', error);
        alert('Erro ao conectar com o servidor. Verifique se o backend está rodando (npm start).');
        
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

// ===== FUNÇÕES DE CADASTRO =====

/**
 * Processa o cadastro do usuário
 */
async function handleSignup(event) {
    event.preventDefault();
    
    // Valida o formulário antes de prosseguir
    if (!validateSignupForm()) {
        return;
    }
    
    // Obtém os valores dos campos
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const cpfCnpj = cpfCnpjInput.value.replace(/\D/g, ''); // Remove formatação
    const telefone = phoneInput.value.replace(/\D/g, ''); // Remove formatação
    
    const formData = {
        nome_completo: fullNameInput.value.trim(),
        tipo: userType.toUpperCase(),
        cpf_cnpj: cpfCnpj,
        email: emailInput.value.trim().toLowerCase(),
        telefone: telefone,
        senha_hash: passwordInput.value, // Em produção, usar bcrypt no backend
        aceitou_termos_em: acceptTermsInput.checked ? new Date().toISOString() : null,
        aceitou_privacidade_em: acceptTermsInput.checked ? new Date().toISOString() : null
    };
    
    // Debug: Exibe os dados no console (remover em produção)
    if (CONFIG.debugMode) {
        console.log('=== TENTATIVA DE CADASTRO ===');
        console.log('Nome:', formData.nome_completo);
        console.log('Tipo:', formData.tipo);
        console.log('CPF/CNPJ:', formData.cpf_cnpj);
        console.log('E-mail:', formData.email);
        console.log('Telefone:', formData.telefone);
        console.log('Senha:', '*'.repeat(passwordInput.value.length));
        console.log('Termos aceitos:', acceptTermsInput.checked);
        console.log('Timestamp:', new Date().toISOString());
    }
    
    // Ativa estado de carregamento
    setSignupButtonLoading(true);
    
    try {
        // Chamada real à API de cadastro
        const response = await fetch(CONFIG.signupEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ Cadastro realizado com sucesso!');
            console.log('Usuário criado:', data.data);
            
            // Exibir mensagem de sucesso
            alert(`Cadastro realizado com sucesso!\n\nBem-vindo(a) ao Work Bridge, ${data.data.nome_completo}! 🎉\n\nVocê será redirecionado para a página de login.`);
            
            // Redirecionar para login após 1 segundo
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
            
        } else {
            // Exibe erro retornado pela API
            const errorMessage = data.message || 'Erro ao criar conta. Tente novamente.';
            
            // Se o erro for relacionado a email/CPF duplicado, mostra no campo correto
            if (errorMessage.toLowerCase().includes('email')) {
                showError(emailInput, errorMessage);
            } else if (errorMessage.toLowerCase().includes('cpf') || errorMessage.toLowerCase().includes('cnpj')) {
                showError(cpfCnpjInput, errorMessage);
            } else {
                alert(errorMessage);
            }
        }
        
    } catch (error) {
        console.error('❌ Erro ao fazer cadastro:', error);
        alert('Erro ao conectar com o servidor. Verifique se o backend está rodando (npm start).');
        
    } finally {
        // Desativa estado de carregamento
        setSignupButtonLoading(false);
    }
}

/**
 * Simula chamada à API de cadastro
 * ⚠️ ESTA FUNÇÃO SERÁ SUBSTITUÍDA PELA INTEGRAÇÃO REAL COM O BACKEND
 * 
 * @param {object} formData - Dados do formulário
 * @returns {Promise} - Promise com resposta simulada da API
 */
function simulateSignupApiCall(formData) {
    return new Promise((resolve) => {
        // Simula delay de rede (1-2 segundos)
        const delay = 1000 + Math.random() * 1000;
        
        setTimeout(() => {
            // Simula resposta bem-sucedida
            // Em produção, isto será substituído por:
            // const response = await fetch(CONFIG.signupEndpoint, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
            // const data = await response.json();
            
            resolve({
                success: true,
                user: {
                    id: Math.floor(Math.random() * 1000),
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    userType: formData.userType,
                    createdAt: new Date().toISOString()
                }
            });
        }, delay);
    });
}

/**
 * Processa cadastro via Google
 */
function handleGoogleSignup() {
    console.log('🔵 Iniciando cadastro com Google...');
    
    // Aqui será implementada a integração com Google OAuth
    // Exemplo: window.location.href = '/auth/google/signup';
    
    alert('Cadastro com Google será implementado em breve! 🔵');
}

/**
 * Processa cadastro via Facebook
 */
function handleFacebookSignup() {
    console.log('🔵 Iniciando cadastro com Facebook...');
    
    // Aqui será implementada a integração com Facebook OAuth
    // Exemplo: window.location.href = '/auth/facebook/signup';
    
    alert('Cadastro com Facebook será implementado em breve! 🔵');
}

// ===== EVENT LISTENERS =====

// Validação em tempo real ao digitar (Login)
if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
            clearError(emailInput);
        }
    });
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && passwordInput) {
            passwordInput.focus();
        }
    });
}

if (passwordInput) {
    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', () => {
        if (passwordInput.classList.contains('error')) {
            clearError(passwordInput);
        }
        // Atualiza força da senha se estivermos na página de cadastro
        if (document.querySelector('.password-strength')) {
            updatePasswordStrength(passwordInput.value);
        }
    });
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (loginForm) {
                handleLogin(e);
            } else if (signupForm) {
                handleSignup(e);
            }
        }
    });
}

// Validação em tempo real ao digitar (Cadastro)
if (fullNameInput) {
    fullNameInput.addEventListener('blur', validateFullName);
    fullNameInput.addEventListener('input', () => {
        if (fullNameInput.classList.contains('error')) {
            clearError(fullNameInput);
        }
    });
}

if (cpfCnpjInput) {
    cpfCnpjInput.addEventListener('blur', validateCpfCnpj);
    cpfCnpjInput.addEventListener('input', (e) => {
        if (cpfCnpjInput.classList.contains('error')) {
            clearError(cpfCnpjInput);
        }
        // Formata o CPF/CNPJ automaticamente
        const formatted = formatCpfCnpj(e.target.value);
        if (formatted !== e.target.value) {
            e.target.value = formatted;
        }
    });
}

if (phoneInput) {
    phoneInput.addEventListener('blur', validatePhone);
    phoneInput.addEventListener('input', (e) => {
        if (phoneInput.classList.contains('error')) {
            clearError(phoneInput);
        }
        // Formata o telefone automaticamente
        const formatted = formatPhone(e.target.value);
        if (formatted !== e.target.value) {
            e.target.value = formatted;
        }
    });
}

if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.classList.contains('error')) {
            clearError(confirmPasswordInput);
        }
    });
}

// Validação do tipo de usuário
if (userTypeInputs.length > 0) {
    userTypeInputs.forEach(input => {
        input.addEventListener('change', validateUserType);
    });
}

// Validação dos termos
if (acceptTermsInput) {
    acceptTermsInput.addEventListener('change', validateTerms);
}

// Submissão dos formulários
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}

// Botões de login social
if (googleBtn) {
    googleBtn.addEventListener('click', handleGoogleLogin);
}

if (facebookBtn) {
    facebookBtn.addEventListener('click', handleFacebookLogin);
}

// Botões de cadastro social
if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', handleGoogleSignup);
}

if (facebookSignupBtn) {
    facebookSignupBtn.addEventListener('click', handleFacebookSignup);
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = document.querySelector('.login-container');
    const isSignupPage = document.querySelector('.signup-container');
    
    if (isLoginPage) {
        console.log('🚀 Work Bridge - Sistema de Login Inicializado');
        console.log('📝 Pronto para integração com backend Node.js');
        
        // Foca no campo de e-mail ao carregar a página
        if (emailInput) emailInput.focus();
    }
    
    if (isSignupPage) {
        console.log('🚀 Work Bridge - Sistema de Cadastro Inicializado');
        console.log('📝 Pronto para integração com backend Node.js');
        
        // Foca no campo de nome ao carregar a página
        if (fullNameInput) fullNameInput.focus();
    }
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

