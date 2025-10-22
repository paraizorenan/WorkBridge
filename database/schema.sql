-- Script de inicialização do banco de dados WorkBridge
-- Execute este script no PostgreSQL para criar as tabelas necessárias

-- Criar banco de dados (execute como superuser)
-- CREATE DATABASE workbridge;

-- Conectar ao banco workbridge e executar os comandos abaixo:

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
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

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS companies (
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

-- Tabela de vagas
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company_id INTEGER REFERENCES companies(id),
    company_name VARCHAR(255), -- Para casos onde não há empresa cadastrada
    location VARCHAR(255),
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'BRL',
    employment_type VARCHAR(50), -- CLT, PJ, Freelance, etc.
    experience_level VARCHAR(50),
    skills_required TEXT[],
    benefits TEXT[],
    remote_work BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active', -- active, closed, draft
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de candidaturas
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    job_id INTEGER REFERENCES jobs(id),
    status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, accepted, rejected
    cover_letter TEXT,
    resume_url VARCHAR(500),
    applied_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    notes TEXT
);

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    job_id INTEGER REFERENCES jobs(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Tabela de mensagens/chat
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    job_id INTEGER REFERENCES jobs(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);

-- Dados de exemplo para teste
INSERT INTO users (name, email, profession, location, bio, skills, experience_level) VALUES
('João Silva', 'joao@email.com', 'Desenvolvedor Full Stack', 'São Paulo, SP', 'Desenvolvedor com 5 anos de experiência', ARRAY['JavaScript', 'React', 'Node.js', 'PostgreSQL'], 'senior'),
('Maria Santos', 'maria@email.com', 'Designer UX/UI', 'Rio de Janeiro, RJ', 'Designer especializada em interfaces', ARRAY['Figma', 'Adobe XD', 'Sketch', 'Prototyping'], 'mid-level'),
('Pedro Costa', 'pedro@email.com', 'Analista de Dados', 'Belo Horizonte, MG', 'Analista com foco em Python e SQL', ARRAY['Python', 'SQL', 'Power BI', 'Machine Learning'], 'junior');

INSERT INTO companies (name, description, website, location, industry, size) VALUES
('TechCorp Brasil', 'Empresa de tecnologia focada em soluções inovadoras', 'https://techcorp.com.br', 'São Paulo, SP', 'Tecnologia', 'Grande'),
('StartupXYZ', 'Startup disruptiva no mercado de fintech', 'https://startupxyz.com', 'São Paulo, SP', 'Fintech', 'Pequena'),
('DesignStudio', 'Estúdio de design especializado em branding', 'https://designstudio.com', 'Rio de Janeiro, RJ', 'Design', 'Média');

INSERT INTO jobs (title, description, company_id, location, salary_min, salary_max, employment_type, experience_level, skills_required, remote_work, status) VALUES
('Desenvolvedor React Senior', 'Procuramos desenvolvedor React com experiência em projetos grandes', 1, 'São Paulo, SP', 8000.00, 12000.00, 'CLT', 'senior', ARRAY['React', 'JavaScript', 'TypeScript', 'Redux'], true, 'active'),
('Designer UX/UI', 'Vaga para designer com foco em experiência do usuário', 2, 'São Paulo, SP', 5000.00, 8000.00, 'CLT', 'mid-level', ARRAY['Figma', 'Adobe XD', 'Prototyping', 'User Research'], true, 'active'),
('Analista de Dados Jr', 'Oportunidade para analista iniciante em dados', 1, 'São Paulo, SP', 3000.00, 5000.00, 'CLT', 'junior', ARRAY['Python', 'SQL', 'Excel', 'Power BI'], false, 'active');

-- Comentários sobre o banco
COMMENT ON TABLE users IS 'Tabela de usuários/candidatos da plataforma';
COMMENT ON TABLE companies IS 'Tabela de empresas que publicam vagas';
COMMENT ON TABLE jobs IS 'Tabela de vagas de emprego';
COMMENT ON TABLE applications IS 'Tabela de candidaturas dos usuários';
COMMENT ON TABLE favorites IS 'Tabela de vagas favoritas dos usuários';
COMMENT ON TABLE messages IS 'Tabela de mensagens entre usuários';

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
