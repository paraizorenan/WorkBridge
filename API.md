# 🔌 API Documentation - WorkBridge

## 📋 Base URL
```
http://localhost:3000/api
```

## 🔐 Authentication
Atualmente a API não requer autenticação. Futuras versões implementarão JWT tokens.

## 📊 Response Format

### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical error details"
}
```

### Paginated Response:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🏥 Health Endpoints

### GET /health
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "message": "WorkBridge API funcionando!",
  "timestamp": "2025-01-22T15:30:00.000Z",
  "version": "1.0.0"
}
```

### GET /db-status
Check database connection status.

**Response:**
```json
{
  "success": true,
  "database": "connected",
  "data": {
    "current_time": "2025-01-22T15:30:00.000Z",
    "postgres_version": "PostgreSQL 13.7"
  }
}
```

---

## 👥 Users Endpoints

### GET /users
Retrieve all users.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com",
      "profession": "Desenvolvedor Full Stack",
      "phone": "(11) 99999-9999",
      "location": "São Paulo, SP",
      "bio": "Desenvolvedor com 5 anos de experiência",
      "skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
      "experience_level": "senior",
      "availability": "available",
      "created_at": "2025-01-22T15:30:00.000Z",
      "updated_at": "2025-01-22T15:30:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /users
Create a new user.

**Request Body:**
```json
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "profession": "Designer UX/UI",
  "phone": "(21) 99999-9999",
  "location": "Rio de Janeiro, RJ",
  "bio": "Designer especializada em interfaces modernas",
  "skills": ["Figma", "Adobe XD", "Sketch"],
  "experience_level": "mid-level",
  "availability": "available"
}
```

**Required Fields:**
- `name` (string): User's full name
- `email` (string): User's email address (must be unique)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Maria Santos",
    "email": "maria@email.com",
    "profession": "Designer UX/UI",
    "phone": "(21) 99999-9999",
    "location": "Rio de Janeiro, RJ",
    "bio": "Designer especializada em interfaces modernas",
    "skills": ["Figma", "Adobe XD", "Sketch"],
    "experience_level": "mid-level",
    "availability": "available",
    "created_at": "2025-01-22T15:30:00.000Z",
    "updated_at": "2025-01-22T15:30:00.000Z"
  },
  "message": "Usuário criado com sucesso!"
}
```

### GET /users/:id
Retrieve a specific user by ID.

**Path Parameters:**
- `id` (integer): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "profession": "Desenvolvedor Full Stack",
    "phone": "(11) 99999-9999",
    "location": "São Paulo, SP",
    "bio": "Desenvolvedor com 5 anos de experiência",
    "skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
    "experience_level": "senior",
    "availability": "available",
    "created_at": "2025-01-22T15:30:00.000Z",
    "updated_at": "2025-01-22T15:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Usuário não encontrado"
}
```

---

## 🏢 Companies Endpoints

### GET /companies
Retrieve all companies.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "TechCorp Brasil",
      "description": "Empresa de tecnologia focada em soluções inovadoras",
      "website": "https://techcorp.com.br",
      "location": "São Paulo, SP",
      "industry": "Tecnologia",
      "size": "Grande",
      "logo_url": null,
      "created_at": "2025-01-22T15:30:00.000Z",
      "updated_at": "2025-01-22T15:30:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /companies
Create a new company.

**Request Body:**
```json
{
  "name": "StartupXYZ",
  "description": "Startup disruptiva no mercado de fintech",
  "website": "https://startupxyz.com",
  "location": "São Paulo, SP",
  "industry": "Fintech",
  "size": "Pequena",
  "logo_url": "https://example.com/logo.png"
}
```

**Required Fields:**
- `name` (string): Company name

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "StartupXYZ",
    "description": "Startup disruptiva no mercado de fintech",
    "website": "https://startupxyz.com",
    "location": "São Paulo, SP",
    "industry": "Fintech",
    "size": "Pequena",
    "logo_url": "https://example.com/logo.png",
    "created_at": "2025-01-22T15:30:00.000Z",
    "updated_at": "2025-01-22T15:30:00.000Z"
  },
  "message": "Empresa criada com sucesso!"
}
```

---

## 💼 Jobs Endpoints

### GET /jobs
Retrieve all active jobs with optional filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title and description
- `location` (optional): Filter by location
- `experience_level` (optional): Filter by experience level (junior, mid-level, senior)

**Example:**
```
GET /jobs?search=react&location=São Paulo&experience_level=senior&page=1&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Desenvolvedor React Senior",
      "description": "Procuramos desenvolvedor React com experiência em projetos grandes",
      "company_id": 1,
      "company_name": "TechCorp Brasil",
      "location": "São Paulo, SP",
      "salary_min": 8000.00,
      "salary_max": 12000.00,
      "salary_currency": "BRL",
      "employment_type": "CLT",
      "experience_level": "senior",
      "skills_required": ["React", "JavaScript", "TypeScript", "Redux"],
      "benefits": ["Vale refeição", "Plano de saúde", "Home office"],
      "remote_work": true,
      "status": "active",
      "created_at": "2025-01-22T15:30:00.000Z",
      "updated_at": "2025-01-22T15:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "pages": 1
  }
}
```

### POST /jobs
Create a new job posting.

**Request Body:**
```json
{
  "title": "Desenvolvedor React Senior",
  "description": "Procuramos desenvolvedor React com experiência em projetos de grande escala. Conhecimento em TypeScript, Redux e testes automatizados é essencial.",
  "company_id": 1,
  "company_name": "TechCorp Brasil",
  "location": "São Paulo, SP",
  "salary_min": 8000.00,
  "salary_max": 12000.00,
  "salary_currency": "BRL",
  "employment_type": "CLT",
  "experience_level": "senior",
  "skills_required": ["React", "TypeScript", "Redux", "Jest", "Node.js"],
  "benefits": ["Vale refeição", "Plano de saúde", "Home office"],
  "remote_work": true
}
```

**Required Fields:**
- `title` (string): Job title
- `description` (string): Job description

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Desenvolvedor React Senior",
    "description": "Procuramos desenvolvedor React com experiência em projetos de grande escala...",
    "company_id": 1,
    "company_name": "TechCorp Brasil",
    "location": "São Paulo, SP",
    "salary_min": 8000.00,
    "salary_max": 12000.00,
    "salary_currency": "BRL",
    "employment_type": "CLT",
    "experience_level": "senior",
    "skills_required": ["React", "TypeScript", "Redux", "Jest", "Node.js"],
    "benefits": ["Vale refeição", "Plano de saúde", "Home office"],
    "remote_work": true,
    "status": "active",
    "created_at": "2025-01-22T15:30:00.000Z",
    "updated_at": "2025-01-22T15:30:00.000Z"
  },
  "message": "Vaga criada com sucesso!"
}
```

### GET /jobs/:id
Retrieve a specific job by ID with company information.

**Path Parameters:**
- `id` (integer): Job ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Desenvolvedor React Senior",
    "description": "Procuramos desenvolvedor React com experiência em projetos grandes",
    "company_id": 1,
    "company_name": "TechCorp Brasil",
    "company_description": "Empresa de tecnologia focada em soluções inovadoras",
    "company_website": "https://techcorp.com.br",
    "location": "São Paulo, SP",
    "salary_min": 8000.00,
    "salary_max": 12000.00,
    "salary_currency": "BRL",
    "employment_type": "CLT",
    "experience_level": "senior",
    "skills_required": ["React", "JavaScript", "TypeScript", "Redux"],
    "benefits": ["Vale refeição", "Plano de saúde", "Home office"],
    "remote_work": true,
    "status": "active",
    "created_at": "2025-01-22T15:30:00.000Z",
    "updated_at": "2025-01-22T15:30:00.000Z"
  }
}
```

---

## 📝 Applications Endpoints

### GET /applications
Retrieve applications with optional filtering.

**Query Parameters:**
- `user_id` (optional): Filter by user ID
- `job_id` (optional): Filter by job ID

**Example:**
```
GET /applications?user_id=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "job_id": 1,
      "status": "pending",
      "cover_letter": "Tenho interesse nesta vaga pois possuo experiência sólida em React...",
      "resume_url": "https://drive.google.com/file/curriculo.pdf",
      "applied_at": "2025-01-22T15:30:00.000Z",
      "reviewed_at": null,
      "notes": null,
      "user_name": "João Silva",
      "user_email": "joao@email.com",
      "job_title": "Desenvolvedor React Senior"
    }
  ],
  "count": 1
}
```

### POST /applications
Create a new job application.

**Request Body:**
```json
{
  "user_id": 1,
  "job_id": 1,
  "cover_letter": "Olá! Tenho interesse nesta vaga pois possuo experiência sólida em React e TypeScript. Trabalhei em projetos similares e acredito que posso contribuir significativamente para a equipe.",
  "resume_url": "https://drive.google.com/file/curriculo.pdf"
}
```

**Required Fields:**
- `user_id` (integer): User ID
- `job_id` (integer): Job ID

**Validation:**
- User cannot apply to the same job twice
- User and job must exist

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "job_id": 1,
    "status": "pending",
    "cover_letter": "Olá! Tenho interesse nesta vaga...",
    "resume_url": "https://drive.google.com/file/curriculo.pdf",
    "applied_at": "2025-01-22T15:30:00.000Z",
    "reviewed_at": null,
    "notes": null
  },
  "message": "Candidatura realizada com sucesso!"
}
```

**Error Response (400) - Duplicate Application:**
```json
{
  "success": false,
  "message": "Você já se candidatou para esta vaga"
}
```

---

## ⚠️ Error Codes

### HTTP Status Codes:

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data or validation error
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Common Error Messages:

#### Validation Errors:
```json
{
  "success": false,
  "message": "Nome e email são obrigatórios"
}
```

#### Not Found Errors:
```json
{
  "success": false,
  "message": "Usuário não encontrado"
}
```

#### Server Errors:
```json
{
  "success": false,
  "message": "Erro interno do servidor",
  "error": "Database connection failed"
}
```

---

## 🔧 Rate Limiting

Currently no rate limiting is implemented. Future versions will include:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

---

## 📝 Examples

### Complete Workflow Example:

1. **Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@email.com"}'
```

2. **Create a company:**
```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -d '{"name": "TechCorp", "description": "Tech company"}'
```

3. **Create a job:**
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title": "Developer", "description": "Great opportunity", "company_id": 1}'
```

4. **Apply for the job:**
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "job_id": 1, "cover_letter": "I am interested..."}'
```

5. **Check applications:**
```bash
curl http://localhost:3000/api/applications?user_id=1
```

---

## 🔄 Future Endpoints

### Planned Endpoints:

- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PUT /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job
- `PUT /applications/:id` - Update application status
- `GET /favorites` - Get user favorites
- `POST /favorites` - Add job to favorites
- `DELETE /favorites/:id` - Remove from favorites
- `GET /messages` - Get messages
- `POST /messages` - Send message

---

**This API documentation provides comprehensive information about all available endpoints, request/response formats, and usage examples for the WorkBridge platform.**
