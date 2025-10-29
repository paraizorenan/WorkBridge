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

// =====================================================================
// HEALTH CHECK ENDPOINTS
// =====================================================================

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'WorkBridge API funcionando!',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

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

// =====================================================================
// SUPPORT ENDPOINTS (UF, CIDADES, ESPECIALIDADES)
// =====================================================================

// Listar UFs
app.get('/api/ufs', async (req, res) => {
    try {
        const result = await pool.query('SELECT sigla, nome FROM wb.uf ORDER BY nome');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Erro ao buscar UFs:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Listar cidades por UF
app.get('/api/cidades/:uf', async (req, res) => {
    try {
        const { uf } = req.params;
        const result = await pool.query(
            'SELECT id, nome FROM wb.cidade WHERE uf_sigla = $1 ORDER BY nome',
            [uf.toUpperCase()]
        );
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Listar especialidades
app.get('/api/especialidades', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nome FROM wb.especialidade ORDER BY nome');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Erro ao buscar especialidades:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// =====================================================================
// USER ENDPOINTS
// =====================================================================

// Listar usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const { tipo, page = 1, limit = 10 } = req.query;
        let query = `
            SELECT u.id, u.nome_completo, u.tipo, u.email, u.telefone, 
                   c.nome as cidade_nome, uf.sigla as uf_sigla, u.foto_url,
                   u.criado_em, u.atualizado_em
            FROM wb.usuario u
            LEFT JOIN wb.cidade c ON u.cidade_id = c.id
            LEFT JOIN wb.uf uf ON c.uf_sigla = uf.sigla
        `;
        let params = [];
        let paramCount = 0;

        if (tipo) {
            paramCount++;
            query += ` WHERE u.tipo = $${paramCount}`;
            params.push(tipo.toUpperCase());
        }

        query += ` ORDER BY u.criado_em DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

        const result = await pool.query(query, params);
        
        // Contar total
        let countQuery = 'SELECT COUNT(*) FROM wb.usuario u';
        let countParams = [];
        let countParamCount = 0;

        if (tipo) {
            countParamCount++;
            countQuery += ` WHERE u.tipo = $${countParamCount}`;
            countParams.push(tipo.toUpperCase());
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
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Criar usuário
app.post('/api/usuarios', async (req, res) => {
    try {
        const { 
            nome_completo, 
            tipo, 
            cpf_cnpj, 
            email, 
            telefone, 
            cidade_id, 
            foto_url,
            senha_hash,
            aceitou_termos_em,
            aceitou_privacidade_em
        } = req.body;
        
        if (!nome_completo || !tipo || !cpf_cnpj || !email || !telefone) {
            return res.status(400).json({
                success: false,
                message: 'Nome completo, tipo, CPF/CNPJ, email e telefone são obrigatórios'
            });
        }

        if (!['CONTRATANTE', 'PROFISSIONAL'].includes(tipo.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Tipo deve ser CONTRATANTE ou PROFISSIONAL'
            });
        }

        const result = await pool.query(
            `INSERT INTO wb.usuario 
             (nome_completo, tipo, cpf_cnpj, email, telefone, cidade_id, foto_url, senha_hash, aceitou_termos_em, aceitou_privacidade_em) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             RETURNING *`,
            [
                nome_completo, 
                tipo.toUpperCase(), 
                cpf_cnpj, 
                email.toLowerCase(), 
                telefone, 
                cidade_id || null, 
                foto_url || null,
                senha_hash || null,
                aceitou_termos_em || null,
                aceitou_privacidade_em || null
            ]
        );

        // Criar registro específico baseado no tipo
        if (tipo.toUpperCase() === 'PROFISSIONAL') {
            await pool.query(
                'INSERT INTO wb.profissional (usuario_id) VALUES ($1)',
                [result.rows[0].id]
            );
        } else if (tipo.toUpperCase() === 'CONTRATANTE') {
            await pool.query(
                'INSERT INTO wb.contratante (usuario_id) VALUES ($1)',
                [result.rows[0].id]
            );
        }

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Usuário criado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        if (error.code === '23505') { // Unique violation
            res.status(400).json({
                success: false,
                message: 'Email ou CPF/CNPJ já cadastrado'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            });
        }
    }
});

// Login de usuário
app.post('/api/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        // Buscar usuário por email
        const result = await pool.query(`
            SELECT u.id, u.nome_completo, u.tipo, u.email, u.telefone, u.cpf_cnpj,
                   u.foto_url, u.senha_hash, c.nome as cidade_nome, uf.sigla as uf_sigla
            FROM wb.usuario u
            LEFT JOIN wb.cidade c ON u.cidade_id = c.id
            LEFT JOIN wb.uf uf ON c.uf_sigla = uf.sigla
            WHERE u.email = $1
        `, [email.toLowerCase()]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }

        const usuario = result.rows[0];

        // Verificar senha (implementação simples - em produção usar bcrypt)
        // Por enquanto, compara senha em texto plano ou hash simples
        if (usuario.senha_hash !== senha) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }

        // Remover senha_hash da resposta
        delete usuario.senha_hash;

        res.json({
            success: true,
            data: usuario,
            message: 'Login realizado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Buscar usuário por ID
app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT u.*, c.nome as cidade_nome, uf.sigla as uf_sigla
            FROM wb.usuario u
            LEFT JOIN wb.cidade c ON u.cidade_id = c.id
            LEFT JOIN wb.uf uf ON c.uf_sigla = uf.sigla
            WHERE u.id = $1
        `, [id]);
        
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

// =====================================================================
// PROFISSIONAL ENDPOINTS
// =====================================================================

// Buscar profissional por ID
app.get('/api/profissionais/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT u.*, p.descricao, p.nota_media, p.servicos_concluidos, p.raio_km,
                   c.nome as cidade_nome, uf.sigla as uf_sigla
            FROM wb.usuario u
            JOIN wb.profissional p ON u.id = p.usuario_id
            LEFT JOIN wb.cidade c ON u.cidade_id = c.id
            LEFT JOIN wb.uf uf ON c.uf_sigla = uf.sigla
            WHERE u.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Profissional não encontrado'
            });
        }

        // Buscar especialidades
        const especialidadesResult = await pool.query(`
            SELECT e.id, e.nome
            FROM wb.especialidade e
            JOIN wb.profissional_especialidade pe ON e.id = pe.especialidade_id
            WHERE pe.profissional_id = $1
        `, [id]);

        // Buscar cidades de atendimento
        const cidadesResult = await pool.query(`
            SELECT c.id, c.nome, uf.sigla as uf_sigla
            FROM wb.cidade c
            JOIN wb.profissional_cidade pc ON c.id = pc.cidade_id
            JOIN wb.uf uf ON c.uf_sigla = uf.sigla
            WHERE pc.profissional_id = $1
        `, [id]);

        // Buscar portfolio
        const portfolioResult = await pool.query(`
            SELECT id, titulo, descricao, imagem_url, criado_em
            FROM wb.portfolio_item
            WHERE profissional_id = $1
            ORDER BY criado_em DESC
        `, [id]);

        res.json({
            success: true,
            data: {
                ...result.rows[0],
                especialidades: especialidadesResult.rows,
                cidades_atendimento: cidadesResult.rows,
                portfolio: portfolioResult.rows
            }
        });
    } catch (error) {
        console.error('Erro ao buscar profissional:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Buscar profissionais com filtros
app.get('/api/profissionais', async (req, res) => {
    try {
        const { 
            especialidade_id, 
            cidade_id, 
            raio_km, 
            nota_minima = 0,
            page = 1, 
            limit = 10 
        } = req.query;

        let query = `
            SELECT u.id, u.nome_completo, u.foto_url, p.descricao, p.nota_media, 
                   p.servicos_concluidos, p.raio_km, c.nome as cidade_nome, uf.sigla as uf_sigla
            FROM wb.usuario u
            JOIN wb.profissional p ON u.id = p.usuario_id
            LEFT JOIN wb.cidade c ON u.cidade_id = c.id
            LEFT JOIN wb.uf uf ON c.uf_sigla = uf.sigla
            WHERE p.nota_media >= $1
        `;
        let params = [parseFloat(nota_minima)];
        let paramCount = 1;

        if (especialidade_id) {
            paramCount++;
            query += ` AND EXISTS (
                SELECT 1 FROM wb.profissional_especialidade pe 
                WHERE pe.profissional_id = u.id AND pe.especialidade_id = $${paramCount}
            )`;
            params.push(especialidade_id);
        }

        if (cidade_id) {
            paramCount++;
            query += ` AND EXISTS (
                SELECT 1 FROM wb.profissional_cidade pc 
                WHERE pc.profissional_id = u.id AND pc.cidade_id = $${paramCount}
            )`;
            params.push(cidade_id);
        }

        query += ` ORDER BY p.nota_media DESC, p.servicos_concluidos DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Adicionar especialidade ao profissional
app.post('/api/profissionais/:id/especialidades', async (req, res) => {
    try {
        const { id } = req.params;
        const { especialidade_id } = req.body;

        if (!especialidade_id) {
            return res.status(400).json({
                success: false,
                message: 'ID da especialidade é obrigatório'
            });
        }

        await pool.query(
            'INSERT INTO wb.profissional_especialidade (profissional_id, especialidade_id) VALUES ($1, $2)',
            [id, especialidade_id]
        );

        res.json({
            success: true,
            message: 'Especialidade adicionada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao adicionar especialidade:', error);
        if (error.code === '23505') { // Unique violation
            res.status(400).json({
                success: false,
                message: 'Profissional já possui esta especialidade'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            });
        }
    }
});

// Adicionar cidade de atendimento
app.post('/api/profissionais/:id/cidades', async (req, res) => {
    try {
        const { id } = req.params;
        const { cidade_id } = req.body;

        if (!cidade_id) {
            return res.status(400).json({
                success: false,
                message: 'ID da cidade é obrigatório'
            });
        }

        await pool.query(
            'INSERT INTO wb.profissional_cidade (profissional_id, cidade_id) VALUES ($1, $2)',
            [id, cidade_id]
        );

        res.json({
            success: true,
            message: 'Cidade de atendimento adicionada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao adicionar cidade:', error);
        if (error.code === '23505') { // Unique violation
            res.status(400).json({
                success: false,
                message: 'Profissional já atende nesta cidade'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            });
        }
    }
});

// Adicionar item ao portfolio
app.post('/api/profissionais/:id/portfolio', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, imagem_url } = req.body;

        if (!titulo || !imagem_url) {
            return res.status(400).json({
                success: false,
                message: 'Título e URL da imagem são obrigatórios'
            });
        }

        const result = await pool.query(
            'INSERT INTO wb.portfolio_item (profissional_id, titulo, descricao, imagem_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, titulo, descricao || null, imagem_url]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Item adicionado ao portfolio com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao adicionar item ao portfolio:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// =====================================================================
// SOLICITAÇÃO DE ORÇAMENTO ENDPOINTS
// =====================================================================

// Criar solicitação de orçamento
app.post('/api/solicitacoes-orcamento', async (req, res) => {
    try {
        const { 
            contratante_id, 
            profissional_id, 
            titulo, 
            descricao, 
            cidade_id, 
            data_desejada_ini 
        } = req.body;

        if (!contratante_id || !profissional_id || !titulo || !descricao) {
            return res.status(400).json({
                success: false,
                message: 'Contratante, profissional, título e descrição são obrigatórios'
            });
        }

        const result = await pool.query(
            `INSERT INTO wb.solicitacao_orcamento 
             (contratante_id, profissional_id, titulo, descricao, cidade_id, data_desejada_ini) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [contratante_id, profissional_id, titulo, descricao, cidade_id || null, data_desejada_ini || null]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Solicitação de orçamento criada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao criar solicitação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Listar solicitações de orçamento
app.get('/api/solicitacoes-orcamento', async (req, res) => {
    try {
        const { 
            contratante_id, 
            profissional_id, 
            status, 
            page = 1, 
            limit = 10 
        } = req.query;

        let query = `
            SELECT so.*, 
                   c.nome as cidade_nome, uf.sigla as uf_sigla,
                   u_contratante.nome_completo as contratante_nome,
                   u_profissional.nome_completo as profissional_nome
            FROM wb.solicitacao_orcamento so
            LEFT JOIN wb.cidade c ON so.cidade_id = c.id
            LEFT JOIN wb.uf uf ON c.uf_sigla = uf.sigla
            JOIN wb.usuario u_contratante ON so.contratante_id = u_contratante.id
            JOIN wb.usuario u_profissional ON so.profissional_id = u_profissional.id
        `;
        let params = [];
        let conditions = [];
        let paramCount = 0;

        if (contratante_id) {
            paramCount++;
            conditions.push(`so.contratante_id = $${paramCount}`);
            params.push(contratante_id);
        }

        if (profissional_id) {
            paramCount++;
            conditions.push(`so.profissional_id = $${paramCount}`);
            params.push(profissional_id);
        }

        if (status) {
            paramCount++;
            conditions.push(`so.status = $${paramCount}`);
            params.push(status.toUpperCase());
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY so.criado_em DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar solicitações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// =====================================================================
// PROPOSTA ENDPOINTS
// =====================================================================

// Criar proposta
app.post('/api/propostas', async (req, res) => {
    try {
        const { 
            solicitacao_id, 
            profissional_id, 
            valor_mao_obra_cents, 
            valor_material_cents = 0,
            data_inicio_prevista, 
            data_fim_prevista, 
            validade_ate, 
            mensagem 
        } = req.body;

        if (!solicitacao_id || !profissional_id || !valor_mao_obra_cents || !validade_ate) {
            return res.status(400).json({
                success: false,
                message: 'Solicitação, profissional, valor da mão de obra e validade são obrigatórios'
            });
        }

        const result = await pool.query(
            `INSERT INTO wb.proposta 
             (solicitacao_id, profissional_id, valor_mao_obra_cents, valor_material_cents, 
              data_inicio_prevista, data_fim_prevista, validade_ate, mensagem) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING *`,
            [
                solicitacao_id, 
                profissional_id, 
                parseInt(valor_mao_obra_cents), 
                parseInt(valor_material_cents),
                data_inicio_prevista || null, 
                data_fim_prevista || null, 
                validade_ate, 
                mensagem || null
            ]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Proposta enviada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao criar proposta:', error);
        if (error.code === '23505') { // Unique violation
            res.status(400).json({
                success: false,
                message: 'Profissional já enviou proposta para esta solicitação'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            });
        }
    }
});

// Listar propostas
app.get('/api/propostas', async (req, res) => {
    try {
        const { 
            solicitacao_id, 
            profissional_id, 
            status, 
            page = 1, 
            limit = 10 
        } = req.query;

        let query = `
            SELECT p.*, 
                   u.nome_completo as profissional_nome,
                   u.foto_url as profissional_foto,
                   so.titulo as solicitacao_titulo
            FROM wb.proposta p
            JOIN wb.usuario u ON p.profissional_id = u.id
            JOIN wb.solicitacao_orcamento so ON p.solicitacao_id = so.id
        `;
        let params = [];
        let conditions = [];
        let paramCount = 0;

        if (solicitacao_id) {
            paramCount++;
            conditions.push(`p.solicitacao_id = $${paramCount}`);
            params.push(solicitacao_id);
        }

        if (profissional_id) {
            paramCount++;
            conditions.push(`p.profissional_id = $${paramCount}`);
            params.push(profissional_id);
        }

        if (status) {
            paramCount++;
            conditions.push(`p.status = $${paramCount}`);
            params.push(status.toUpperCase());
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY p.criado_em DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar propostas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Aceitar proposta
app.put('/api/propostas/:id/aceitar', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Atualizar status da proposta
        const propostaResult = await pool.query(
            'UPDATE wb.proposta SET status = $1, atualizado_em = NOW() WHERE id = $2 RETURNING *',
            ['ACEITA', id]
        );

        if (propostaResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Proposta não encontrada'
            });
        }

        const proposta = propostaResult.rows[0];

        // Criar job
        const jobResult = await pool.query(
            `INSERT INTO wb.job 
             (proposta_id, contratante_id, profissional_id, cidade_id, titulo) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [
                id,
                proposta.solicitacao_id, // Será necessário buscar o contratante_id da solicitação
                proposta.profissional_id,
                null, // Será necessário buscar da solicitação
                proposta.solicitacao_id // Será necessário buscar o título da solicitação
            ]
        );

        res.json({
            success: true,
            data: {
                proposta: proposta,
                job: jobResult.rows[0]
            },
            message: 'Proposta aceita e job criado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao aceitar proposta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// =====================================================================
// JOB ENDPOINTS
// =====================================================================

// Listar jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const { 
            contratante_id, 
            profissional_id, 
            status, 
            page = 1, 
            limit = 10 
        } = req.query;

        let query = `
            SELECT j.*, 
                   u_contratante.nome_completo as contratante_nome,
                   u_profissional.nome_completo as profissional_nome,
                   c.nome as cidade_nome, uf.sigla as uf_sigla,
                   p.valor_mao_obra_cents, p.valor_material_cents
            FROM wb.job j
            JOIN wb.proposta p ON j.proposta_id = p.id
            JOIN wb.usuario u_contratante ON j.contratante_id = u_contratante.id
            JOIN wb.usuario u_profissional ON j.profissional_id = u_profissional.id
            LEFT JOIN wb.cidade c ON j.cidade_id = c.id
            LEFT JOIN wb.uf uf ON c.uf_sigla = uf.sigla
        `;
        let params = [];
        let conditions = [];
        let paramCount = 0;

        if (contratante_id) {
            paramCount++;
            conditions.push(`j.contratante_id = $${paramCount}`);
            params.push(contratante_id);
        }

        if (profissional_id) {
            paramCount++;
            conditions.push(`j.profissional_id = $${paramCount}`);
            params.push(profissional_id);
        }

        if (status) {
            paramCount++;
            conditions.push(`j.status = $${paramCount}`);
            params.push(status.toUpperCase());
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY j.criado_em DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// =====================================================================
// CHAT ENDPOINTS
// =====================================================================

// Criar conversa
app.post('/api/conversas', async (req, res) => {
    try {
        const { solicitacao_id, job_id } = req.body;

        if (!solicitacao_id && !job_id) {
            return res.status(400).json({
                success: false,
                message: 'Solicitação ou job é obrigatório'
            });
        }

        const result = await pool.query(
            'INSERT INTO wb.conversa (solicitacao_id, job_id) VALUES ($1, $2) RETURNING *',
            [solicitacao_id || null, job_id || null]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Conversa criada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao criar conversa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Enviar mensagem
app.post('/api/mensagens', async (req, res) => {
    try {
        const { conversa_id, autor_id, corpo, anexos_json } = req.body;

        if (!conversa_id || !autor_id || !corpo) {
            return res.status(400).json({
                success: false,
                message: 'Conversa, autor e corpo da mensagem são obrigatórios'
            });
        }

        const result = await pool.query(
            'INSERT INTO wb.mensagem (conversa_id, autor_id, corpo, anexos_json) VALUES ($1, $2, $3, $4) RETURNING *',
            [conversa_id, autor_id, corpo, anexos_json || null]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Mensagem enviada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Listar mensagens de uma conversa
app.get('/api/conversas/:id/mensagens', async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const result = await pool.query(`
            SELECT m.*, u.nome_completo as autor_nome, u.foto_url as autor_foto
            FROM wb.mensagem m
            JOIN wb.usuario u ON m.autor_id = u.id
            WHERE m.conversa_id = $1
            ORDER BY m.criado_em ASC
            LIMIT $2 OFFSET $3
        `, [id, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// =====================================================================
// AVALIAÇÃO ENDPOINTS
// =====================================================================

// Avaliar profissional
app.post('/api/avaliacoes/profissional', async (req, res) => {
    try {
        const { 
            job_id, 
            autor_contratante_id, 
            qualidade, 
            pontualidade, 
            limpeza, 
            comunicacao, 
            comentario 
        } = req.body;

        if (!job_id || !autor_contratante_id || !qualidade || !pontualidade || !limpeza || !comunicacao || !comentario) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
        }

        const result = await pool.query(
            `INSERT INTO wb.avaliacao_profissional 
             (job_id, autor_contratante_id, qualidade, pontualidade, limpeza, comunicacao, comentario) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [job_id, autor_contratante_id, qualidade, pontualidade, limpeza, comunicacao, comentario]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Avaliação enviada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao avaliar profissional:', error);
        if (error.code === '23505') { // Unique violation
            res.status(400).json({
                success: false,
                message: 'Job já foi avaliado'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            });
        }
    }
});

// Avaliar contratante
app.post('/api/avaliacoes/contratante', async (req, res) => {
    try {
        const { 
            job_id, 
            autor_profissional_id, 
            nota_geral, 
            comentario 
        } = req.body;

        if (!job_id || !autor_profissional_id || !nota_geral || !comentario) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
        }

        const result = await pool.query(
            `INSERT INTO wb.avaliacao_contratante 
             (job_id, autor_profissional_id, nota_geral, comentario) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [job_id, autor_profissional_id, nota_geral, comentario]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Avaliação enviada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao avaliar contratante:', error);
        if (error.code === '23505') { // Unique violation
            res.status(400).json({
                success: false,
                message: 'Job já foi avaliado'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            });
        }
    }
});

// =====================================================================
// MIDDLEWARE DE TRATAMENTO DE ERROS
// =====================================================================

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
    console.log(`🚀 Servidor WorkBridge v2.0 rodando na porta ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database Status: http://localhost:${PORT}/api/db-status`);
});

module.exports = app;