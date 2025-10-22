const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'workbridge',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Teste de conexão com o banco
pool.on('connect', () => {
    console.log('✅ Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Erro na conexão com o banco:', err);
});

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rotas da API
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'WorkBridge API funcionando!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Rota para testar conexão com banco
app.get('/api/db-status', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
        res.json({
            success: true,
            database: 'connected',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            database: 'disconnected',
            error: error.message
        });
    }
});

// Rota para listar usuários
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id DESC');
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para criar usuário
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, profession, phone, location, bio, skills, experience_level } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Nome e email são obrigatórios'
            });
        }

        const result = await pool.query(
            'INSERT INTO users (name, email, profession, phone, location, bio, skills, experience_level, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *',
            [name, email, profession || null, phone || null, location || null, bio || null, skills || null, experience_level || null]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Usuário criado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para buscar usuário por ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para listar empresas
app.get('/api/companies', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies ORDER BY id DESC');
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para criar empresa
app.post('/api/companies', async (req, res) => {
    try {
        const { name, description, website, location, industry, size } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Nome da empresa é obrigatório'
            });
        }

        const result = await pool.query(
            'INSERT INTO companies (name, description, website, location, industry, size, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
            [name, description || null, website || null, location || null, industry || null, size || null]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Empresa criada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao criar empresa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para listar vagas
app.get('/api/jobs', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, location, experience_level } = req.query;
        let query = 'SELECT j.*, c.name as company_name FROM jobs j LEFT JOIN companies c ON j.company_id = c.id WHERE j.status = $1';
        let params = ['active'];
        let paramCount = 1;

        if (search) {
            paramCount++;
            query += ` AND (j.title ILIKE $${paramCount} OR j.description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        if (location) {
            paramCount++;
            query += ` AND j.location ILIKE $${paramCount}`;
            params.push(`%${location}%`);
        }

        if (experience_level) {
            paramCount++;
            query += ` AND j.experience_level = $${paramCount}`;
            params.push(experience_level);
        }

        query += ` ORDER BY j.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

        const result = await pool.query(query, params);
        
        // Contar total de registros para paginação
        let countQuery = 'SELECT COUNT(*) FROM jobs j WHERE j.status = $1';
        let countParams = ['active'];
        let countParamCount = 1;

        if (search) {
            countParamCount++;
            countQuery += ` AND (j.title ILIKE $${countParamCount} OR j.description ILIKE $${countParamCount})`;
            countParams.push(`%${search}%`);
        }

        if (location) {
            countParamCount++;
            countQuery += ` AND j.location ILIKE $${countParamCount}`;
            countParams.push(`%${location}%`);
        }

        if (experience_level) {
            countParamCount++;
            countQuery += ` AND j.experience_level = $${countParamCount}`;
            countParams.push(experience_level);
        }

        const countResult = await pool.query(countQuery, countParams);
        const totalCount = parseInt(countResult.rows[0].count);

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                pages: Math.ceil(totalCount / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para criar vaga
app.post('/api/jobs', async (req, res) => {
    try {
        const { title, description, company_id, company_name, location, salary_min, salary_max, employment_type, experience_level, skills_required, benefits, remote_work } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Título e descrição são obrigatórios'
            });
        }

        const result = await pool.query(
            'INSERT INTO jobs (title, description, company_id, company_name, location, salary_min, salary_max, employment_type, experience_level, skills_required, benefits, remote_work, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()) RETURNING *',
            [title, description, company_id || null, company_name || null, location || null, salary_min || null, salary_max || null, employment_type || null, experience_level || null, skills_required || null, benefits || null, remote_work || false]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Vaga criada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao criar vaga:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para buscar vaga por ID
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT j.*, c.name as company_name, c.description as company_description, c.website as company_website 
            FROM jobs j 
            LEFT JOIN companies c ON j.company_id = c.id 
            WHERE j.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Vaga não encontrada'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao buscar vaga:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para listar candidaturas
app.get('/api/applications', async (req, res) => {
    try {
        const { user_id, job_id } = req.query;
        let query = 'SELECT a.*, u.name as user_name, u.email as user_email, j.title as job_title FROM applications a LEFT JOIN users u ON a.user_id = u.id LEFT JOIN jobs j ON a.job_id = j.id';
        let params = [];
        let conditions = [];

        if (user_id) {
            params.push(user_id);
            conditions.push(`a.user_id = $${params.length}`);
        }

        if (job_id) {
            params.push(job_id);
            conditions.push(`a.job_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY a.applied_at DESC';

        const result = await pool.query(query, params);
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Erro ao buscar candidaturas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para criar candidatura
app.post('/api/applications', async (req, res) => {
    try {
        const { user_id, job_id, cover_letter, resume_url } = req.body;
        
        if (!user_id || !job_id) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário e ID da vaga são obrigatórios'
            });
        }

        // Verificar se já existe candidatura
        const existingApplication = await pool.query(
            'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
            [user_id, job_id]
        );

        if (existingApplication.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Você já se candidatou para esta vaga'
            });
        }

        const result = await pool.query(
            'INSERT INTO applications (user_id, job_id, cover_letter, resume_url, applied_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [user_id, job_id, cover_letter || null, resume_url || null]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Candidatura realizada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao criar candidatura:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Algo deu errado!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
    });
});

// Rota 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    pool.end(() => {
        console.log('Pool has ended');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    pool.end(() => {
        console.log('Pool has ended');
        process.exit(0);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor WorkBridge rodando na porta ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database Status: http://localhost:${PORT}/api/db-status`);
});

module.exports = app;