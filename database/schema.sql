-- =====================================================================
-- Work Bridge - Esquema PostgreSQL (Neon-ready)
-- =====================================================================

-- Extensões (Neon geralmente permite estas sem superuser)
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;     -- e-mail case-insensitive

CREATE SCHEMA IF NOT EXISTS wb;
SET search_path TO wb;

-- Tabelas de apoio
CREATE TABLE uf (
  sigla CHAR(2) PRIMARY KEY,
  nome  VARCHAR(60) NOT NULL
);

CREATE TABLE cidade (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       VARCHAR(120) NOT NULL,
  uf_sigla   CHAR(2)       NOT NULL REFERENCES uf(sigla) ON UPDATE CASCADE,
  UNIQUE (nome, uf_sigla)
);

CREATE TABLE especialidade (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(80) NOT NULL UNIQUE
);

-- Usuários
CREATE TABLE usuario (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo     VARCHAR(160)        NOT NULL,
  tipo              VARCHAR(20)         NOT NULL CHECK (tipo IN ('CONTRATANTE','PROFISSIONAL')),
  cpf_cnpj          VARCHAR(20)         NOT NULL,
  email             CITEXT              NOT NULL UNIQUE,
  telefone          VARCHAR(20)         NOT NULL,
  cidade_id         UUID                REFERENCES cidade(id),
  foto_url          TEXT,
  senha_hash        TEXT,
  senha_needs_reset BOOLEAN             NOT NULL DEFAULT FALSE,
  aceitou_termos_em  timestamptz,
  aceitou_privacidade_em timestamptz,
  criado_em         timestamptz         NOT NULL DEFAULT now(),
  atualizado_em     timestamptz         NOT NULL DEFAULT now()
);
CREATE INDEX ON usuario (tipo);
CREATE UNIQUE INDEX usuario_cpf_cnpj_uk ON usuario (cpf_cnpj);

CREATE TABLE usuario_auth_provedor (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id   UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  provedor     VARCHAR(30) NOT NULL CHECK (provedor IN ('GOOGLE','FACEBOOK','APPLE')),
  provedor_uid VARCHAR(191) NOT NULL,
  criado_em    timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (provedor, provedor_uid),
  UNIQUE (usuario_id, provedor)
);

-- Profissional / Contratante
CREATE TABLE profissional (
  usuario_id        UUID PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
  descricao         TEXT,
  nota_media        NUMERIC(3,2)        NOT NULL DEFAULT 0.00,
  servicos_concluidos INTEGER           NOT NULL DEFAULT 0,
  raio_km           INTEGER,
  atualizado_em     timestamptz         NOT NULL DEFAULT now()
);

CREATE TABLE profissional_especialidade (
  profissional_id  UUID NOT NULL REFERENCES profissional(usuario_id) ON DELETE CASCADE,
  especialidade_id UUID NOT NULL REFERENCES especialidade(id),
  PRIMARY KEY (profissional_id, especialidade_id)
);

CREATE TABLE profissional_cidade (
  profissional_id UUID NOT NULL REFERENCES profissional(usuario_id) ON DELETE CASCADE,
  cidade_id       UUID NOT NULL REFERENCES cidade(id),
  PRIMARY KEY (profissional_id, cidade_id)
);

CREATE TABLE portfolio_item (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id  UUID NOT NULL REFERENCES profissional(usuario_id) ON DELETE CASCADE,
  titulo           VARCHAR(120) NOT NULL,
  descricao        TEXT,
  imagem_url       TEXT         NOT NULL,
  criado_em        timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE contratante (
  usuario_id   UUID PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

-- Orçamento / Proposta / Job
CREATE TABLE solicitacao_orcamento (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contratante_id     UUID NOT NULL REFERENCES contratante(usuario_id) ON DELETE RESTRICT,
  profissional_id    UUID NOT NULL REFERENCES profissional(usuario_id) ON DELETE RESTRICT,
  titulo             VARCHAR(140) NOT NULL,
  descricao          TEXT         NOT NULL,
  cidade_id          UUID REFERENCES cidade(id),
  data_desejada_ini  date,
  status             VARCHAR(20)  NOT NULL DEFAULT 'PENDENTE'
                     CHECK (status IN ('PENDENTE','CANCELADA','RESPONDIDA','EXPIRADA')),
  criado_em          timestamptz  NOT NULL DEFAULT now(),
  atualizado_em      timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX ON solicitacao_orcamento (profissional_id, status);
CREATE INDEX ON solicitacao_orcamento (contratante_id, status);

CREATE TABLE solicitacao_anexo (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id  UUID NOT NULL REFERENCES solicitacao_orcamento(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  tipo            VARCHAR(20) CHECK (tipo IN ('IMAGEM','VIDEO','OUTRO')) DEFAULT 'IMAGEM',
  criado_em       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE proposta (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id       UUID NOT NULL REFERENCES solicitacao_orcamento(id) ON DELETE CASCADE,
  profissional_id      UUID NOT NULL REFERENCES profissional(usuario_id) ON DELETE RESTRICT,
  valor_mao_obra_cents BIGINT    NOT NULL CHECK (valor_mao_obra_cents >= 0),
  valor_material_cents BIGINT    NOT NULL DEFAULT 0 CHECK (valor_material_cents >= 0),
  data_inicio_prevista date,
  data_fim_prevista    date,
  validade_ate         date       NOT NULL,
  status               VARCHAR(20) NOT NULL DEFAULT 'ENVIADA'
                       CHECK (status IN ('ENVIADA','ACEITA','RECUSADA','EXPIRADA','CANCELADA')),
  mensagem             TEXT,
  criado_em            timestamptz NOT NULL DEFAULT now(),
  atualizado_em        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (solicitacao_id, profissional_id)
);
CREATE INDEX ON proposta (solicitacao_id, status);
CREATE INDEX ON proposta (profissional_id, status);

CREATE TABLE job (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposta_id        UUID NOT NULL UNIQUE REFERENCES proposta(id) ON DELETE RESTRICT,
  contratante_id     UUID NOT NULL REFERENCES contratante(usuario_id) ON DELETE RESTRICT,
  profissional_id    UUID NOT NULL REFERENCES profissional(usuario_id) ON DELETE RESTRICT,
  cidade_id          UUID REFERENCES cidade(id),
  titulo             VARCHAR(140) NOT NULL,
  status             VARCHAR(25)  NOT NULL DEFAULT 'PAGAMENTO_PENDENTE'
                     CHECK (status IN ('PAGAMENTO_PENDENTE','PAGAMENTO_CONFIRMADO','EM_ANDAMENTO','CONCLUIDO','CANCELADO')),
  criado_em          timestamptz  NOT NULL DEFAULT now(),
  atualizado_em      timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX ON job (profissional_id, status);
CREATE INDEX ON job (contratante_id, status);

-- Pagamentos / Escrow / Carteira
CREATE TABLE pagamento_intent (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id            UUID NOT NULL REFERENCES job(id) ON DELETE CASCADE,
  parcela           SMALLINT NOT NULL CHECK (parcela IN (1,2)),
  metodo            VARCHAR(20) NOT NULL CHECK (metodo IN ('CARTAO','PIX')),
  valor_cents       BIGINT NOT NULL CHECK (valor_cents > 0),
  gateway           VARCHAR(30) NOT NULL CHECK (gateway IN ('STRIPE','MERCADO_PAGO','PAGARME')),
  gateway_ref       VARCHAR(191),
  status            VARCHAR(20) NOT NULL DEFAULT 'CRIADA'
                    CHECK (status IN ('CRIADA','PAGA','FALHOU','CANCELADA')),
  criado_em         timestamptz NOT NULL DEFAULT now(),
  atualizado_em     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, parcela)
);

CREATE TABLE escrow (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL UNIQUE REFERENCES job(id) ON DELETE CASCADE,
  total_cents     BIGINT NOT NULL CHECK (total_cents >= 0),
  retido_cents    BIGINT NOT NULL CHECK (retido_cents >= 0),
  liberado_cents  BIGINT NOT NULL CHECK (liberado_cents >= 0),
  status          VARCHAR(20) NOT NULL DEFAULT 'EM_GARANTIA'
                  CHECK (status IN ('EM_GARANTIA','PARCIAL_LIBERADO','LIBERADO','ESTORNADO')),
  criado_em       timestamptz NOT NULL DEFAULT now(),
  atualizado_em   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE carteira_profissional (
  profissional_id        UUID PRIMARY KEY REFERENCES profissional(usuario_id) ON DELETE CASCADE,
  saldo_pendente_cents   BIGINT NOT NULL DEFAULT 0 CHECK (saldo_pendente_cents >= 0),
  saldo_disponivel_cents BIGINT NOT NULL DEFAULT 0 CHECK (saldo_disponivel_cents >= 0),
  atualizado_em          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE carteira_lancamento (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id  UUID NOT NULL REFERENCES profissional(usuario_id) ON DELETE CASCADE,
  job_id           UUID REFERENCES job(id) ON DELETE SET NULL,
  tipo             VARCHAR(25) NOT NULL CHECK (tipo IN ('CREDITO_LIBERACAO','DEBITO_COMISSAO','DEBITO_SAQUE','AJUSTE')),
  valor_cents      BIGINT NOT NULL,
  descricao        TEXT,
  criado_em        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON carteira_lancamento (profissional_id, criado_em);

CREATE TABLE comissao (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id       UUID NOT NULL UNIQUE REFERENCES job(id) ON DELETE CASCADE,
  percentual   NUMERIC(5,2) NOT NULL CHECK (percentual >= 0 AND percentual <= 100),
  valor_cents  BIGINT NOT NULL CHECK (valor_cents >= 0),
  calculada_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE saque (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id   UUID NOT NULL REFERENCES profissional(usuario_id) ON DELETE RESTRICT,
  valor_cents       BIGINT NOT NULL CHECK (valor_cents > 0),
  destino           VARCHAR(20) NOT NULL CHECK (destino IN ('PIX','CONTA_BANCARIA')),
  chave_pix         VARCHAR(200),
  banco_nome        VARCHAR(120),
  banco_agencia     VARCHAR(20),
  banco_conta       VARCHAR(30),
  status            VARCHAR(20) NOT NULL DEFAULT 'SOLICITADO'
                    CHECK (status IN ('SOLICITADO','PROCESSANDO','PAGO','RECUSADO','CANCELADO')),
  criado_em         timestamptz NOT NULL DEFAULT now(),
  atualizado_em     timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (destino='PIX' AND chave_pix IS NOT NULL)
    OR (destino='CONTA_BANCARIA' AND banco_nome IS NOT NULL AND banco_agencia IS NOT NULL AND banco_conta IS NOT NULL)
  )
);
CREATE INDEX ON saque (profissional_id, status);

-- Conclusão
CREATE TABLE conclusao_job (
  job_id        UUID PRIMARY KEY REFERENCES job(id) ON DELETE CASCADE,
  confirmado_por UUID NOT NULL REFERENCES contratante(usuario_id),
  confirmado_em timestamptz NOT NULL DEFAULT now(),
  observacoes   TEXT
);

-- Avaliações (bilateral)
CREATE TABLE avaliacao_profissional (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id               UUID NOT NULL UNIQUE REFERENCES job(id) ON DELETE CASCADE,
  autor_contratante_id UUID NOT NULL REFERENCES contratante(usuario_id) ON DELETE RESTRICT,
  qualidade        SMALLINT NOT NULL CHECK (qualidade BETWEEN 1 AND 5),
  pontualidade     SMALLINT NOT NULL CHECK (pontualidade BETWEEN 1 AND 5),
  limpeza          SMALLINT NOT NULL CHECK (limpeza BETWEEN 1 AND 5),
  comunicacao      SMALLINT NOT NULL CHECK (comunicacao BETWEEN 1 AND 5),
  comentario       TEXT NOT NULL,
  publicado        BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE avaliacao_contratante (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id                 UUID NOT NULL UNIQUE REFERENCES job(id) ON DELETE CASCADE,
  autor_profissional_id  UUID NOT NULL REFERENCES profissional(usuario_id) ON DELETE RESTRICT,
  nota_geral         SMALLINT NOT NULL CHECK (nota_geral BETWEEN 1 AND 5),
  comentario         TEXT NOT NULL,
  publicado          BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em          timestamptz NOT NULL DEFAULT now()
);

-- Chat
CREATE TABLE conversa (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id  UUID REFERENCES solicitacao_orcamento(id) ON DELETE CASCADE,
  job_id          UUID REFERENCES job(id) ON DELETE CASCADE,
  UNIQUE (solicitacao_id),
  UNIQUE (job_id),
  CHECK ( (solicitacao_id IS NOT NULL) OR (job_id IS NOT NULL) )
);

CREATE TABLE conversa_participante (
  conversa_id   UUID NOT NULL REFERENCES conversa(id) ON DELETE CASCADE,
  usuario_id    UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  PRIMARY KEY (conversa_id, usuario_id)
);

CREATE TABLE mensagem (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id    UUID NOT NULL REFERENCES conversa(id) ON DELETE CASCADE,
  autor_id       UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  corpo          TEXT NOT NULL,
  anexos_json    JSONB,
  lida           BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON mensagem (conversa_id, criado_em);

-- Notificações
CREATE TABLE notificacao (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  tipo          VARCHAR(40) NOT NULL,
  payload       JSONB,
  enviada_em    timestamptz,
  lida_em       timestamptz,
  criado_em     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON notificacao (usuario_id, tipo, criado_em);

-- LGPD / Auditoria
CREATE TABLE consentimento (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id       UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  tipo             VARCHAR(40) NOT NULL CHECK (tipo IN ('TERMOS_DE_USO','PRIVACIDADE','MARKETING')),
  versao_documento VARCHAR(20),
  dado_em          timestamptz NOT NULL DEFAULT now(),
  revogado_em      timestamptz
);

CREATE TABLE auditoria_evento (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID REFERENCES usuario(id) ON DELETE SET NULL,
  entidade      VARCHAR(40) NOT NULL,
  entidade_id   UUID,
  acao          VARCHAR(30) NOT NULL,
  detalhes      JSONB,
  criado_em     timestamptz NOT NULL DEFAULT now()
);

-- Dados básicos
INSERT INTO uf (sigla,nome) VALUES
  ('SP','São Paulo'), ('RJ','Rio de Janeiro'), ('MG','Minas Gerais')
ON CONFLICT DO NOTHING;

INSERT INTO especialidade (id, nome) VALUES
  (gen_random_uuid(), 'Alvenaria'),
  (gen_random_uuid(), 'Acabamento'),
  (gen_random_uuid(), 'Hidráulica'),
  (gen_random_uuid(), 'Elétrica'),
  (gen_random_uuid(), 'Pintura')
ON CONFLICT DO NOTHING;

-- Índices úteis
CREATE INDEX profissional_rank_idx ON profissional (nota_media DESC, servicos_concluidos DESC);
CREATE INDEX usuario_cidade_idx    ON usuario (cidade_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_usuario_updated_at BEFORE UPDATE ON usuario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profissional_updated_at BEFORE UPDATE ON profissional FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contratante_updated_at BEFORE UPDATE ON contratante FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solicitacao_orcamento_updated_at BEFORE UPDATE ON solicitacao_orcamento FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposta_updated_at BEFORE UPDATE ON proposta FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_updated_at BEFORE UPDATE ON job FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagamento_intent_updated_at BEFORE UPDATE ON pagamento_intent FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_escrow_updated_at BEFORE UPDATE ON escrow FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carteira_profissional_updated_at BEFORE UPDATE ON carteira_profissional FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saque_updated_at BEFORE UPDATE ON saque FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();