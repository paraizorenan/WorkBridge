// Work Bridge - Épico 2: Perfil do Profissional
// Estruturado para futura integração com API (ex.: GET /api/profissionais/:id)

// Dados simulados (devem ser mantidos sincronizados com busca.js em ambiente local).
const profissionais = [
  {
    id: 1,
    nome: "Renato Silva",
    especialidade: "Pedreiro",
    especialidades: ["Pedreiro", "Azulejista"],
    cidade: "São Paulo",
    estado: "SP",
    nota: 4.7,
    servicosConcluidos: 120,
    foto: "https://images.unsplash.com/photo-1611672585731-6ac61f6b3e1f?auto=format&fit=crop&w=400&q=80",
    descricao: "Profissional com 10 anos de experiência em alvenaria e reforma.",
    portfolio: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop"
    ],
    avaliacoes: [
      { nome: "Carlos", nota: 5, comentario: "Excelente trabalho e pontualidade!" },
      { nome: "Mariana", nota: 4, comentario: "Ficou muito bom, recomendo." }
    ]
  },
  {
    id: 2,
    nome: "Amanda Rocha",
    especialidade: "Eletricista",
    especialidades: ["Eletricista"],
    cidade: "Campinas",
    estado: "SP",
    nota: 4.9,
    servicosConcluidos: 200,
    foto: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
    descricao: "Especialista em instalações e manutenções residenciais.",
    portfolio: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80&auto=format&fit=crop"
    ],
    avaliacoes: [
      { nome: "Bianca", nota: 5, comentario: "Muito atenciosa e profissional." },
      { nome: "Rafael", nota: 5, comentario: "Resolveu tudo rapidamente." }
    ]
  },
  {
    id: 3,
    nome: "João Pedro",
    especialidade: "Encanador",
    especialidades: ["Encanador", "Hidráulica"],
    cidade: "Rio de Janeiro",
    estado: "RJ",
    nota: 4.5,
    servicosConcluidos: 80,
    foto: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
    descricao: "Atendimento rápido para emergências e reformas.",
    portfolio: [
      "https://images.unsplash.com/photo-1523419409543-a7cf3c4d6110?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541976076758-347942db1970?w=800&q=80&auto=format&fit=crop"
    ],
    avaliacoes: [
      { nome: "Patrícia", nota: 4, comentario: "Bom serviço." },
      { nome: "Eduardo", nota: 5, comentario: "Recomendadíssimo!" }
    ]
  },
  {
    id: 4,
    nome: "Fernanda Alves",
    especialidade: "Pintor(a)",
    especialidades: ["Pintor", "Texturização"],
    cidade: "Belo Horizonte",
    estado: "MG",
    nota: 4.8,
    servicosConcluidos: 150,
    foto: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=400&q=80",
    descricao: "Acabamentos finos e pintura decorativa.",
    portfolio: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693539379-53a3bfb62d43?w=800&q=80&auto=format&fit=crop"
    ],
    avaliacoes: [
      { nome: "Luiz", nota: 5, comentario: "Excelente acabamento." },
      { nome: "Sofia", nota: 4, comentario: "Muito caprichosa." }
    ]
  },
  {
    id: 5,
    nome: "Carla Mendes",
    especialidade: "Azulejista",
    especialidades: ["Azulejista", "Pedreiro"],
    cidade: "Curitiba",
    estado: "PR",
    nota: 4.6,
    servicosConcluidos: 95,
    foto: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80",
    descricao: "Especialista em assentamento de azulejos e acabamentos cerâmicos.",
    portfolio: [
      "https://images.unsplash.com/photo-1581090464808-7a4a7b8b4e58?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581091215367-6a2a26c6cf9a?w=800&q=80&auto=format&fit=crop"
    ],
    avaliacoes: [
      { nome: "Thiago", nota: 5, comentario: "Assentamento perfeito!" },
      { nome: "Julia", nota: 4, comentario: "Muito caprichosa." }
    ]
  },
  {
    id: 6,
    nome: "Marcos Lima",
    especialidade: "Pintor",
    especialidades: ["Pintor", "Texturização"],
    cidade: "Salvador",
    estado: "BA",
    nota: 4.8,
    servicosConcluidos: 140,
    foto: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=400&q=80",
    descricao: "Pintura residencial, comercial e efeitos decorativos.",
    portfolio: [
      "https://images.unsplash.com/photo-1581091014534-79d5bb1dfb39?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560184897-67f4b5423a4d?w=800&q=80&auto=format&fit=crop"
    ],
    avaliacoes: [
      { nome: "Renata", nota: 5, comentario: "Acabamento impecável." },
      { nome: "Paulo", nota: 5, comentario: "Entrega no prazo e muito profissional." }
    ]
  }
];

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function stars(nota) {
  const full = Math.round(nota);
  const filled = '★'.repeat(full);
  const empty = '☆'.repeat(5 - full);
  return `${filled}${empty}`;
}

function renderProfile(p) {
  const header = document.getElementById('profileHeader');
  header.innerHTML = `
    <img class="profile__photo" src="${p.foto}" alt="Foto de ${p.nome}">
    <div>
      <h1 class="profile__title">${p.nome}</h1>
      <div class="badges">${p.especialidades.map(e => `<span class="badge">${e}</span>`).join('')}</div>
      <div class="card__meta" style="margin-top:6px;">${p.cidade}/${p.estado}</div>
      <div class="rating" style="margin-top:8px;"><span class="stars">${stars(p.nota)}</span><small>${p.nota.toFixed(1)} • ${p.servicosConcluidos} serviços</small></div>
    </div>
  `;
  header.setAttribute('aria-busy', 'false');

  const descricao = document.getElementById('descricao');
  descricao.textContent = p.descricao;

  const port = document.getElementById('portfolio');
  port.innerHTML = p.portfolio.map(src => `<img src="${src}" alt="Trabalho de ${p.nome}">`).join('');

  const aval = document.getElementById('avaliacoes');
  aval.innerHTML = p.avaliacoes.map(a => `
    <div class="review">
      <div class="review__head">
        <span class="review__name">${a.nome}</span>
        <span class="stars">${stars(a.nota)}</span>
      </div>
      <div class="review__comment">${a.comentario}</div>
    </div>
  `).join('');
}

function setup() {
  const id = Number(getParam('id'));
  // Futuro: substituir por fetch(`/api/profissionais/${id}`)
  const p = profissionais.find(x => x.id === id);
  const header = document.getElementById('profileHeader');
  if (!p) {
    header.innerHTML = '<p>Profissional não encontrado.</p>';
    header.setAttribute('aria-busy', 'false');
    return;
  }
  renderProfile(p);

  document.getElementById('btnOrcamento').addEventListener('click', () => {
    alert('Solicitação de orçamento enviada! (placeholder)');
  });
}

document.addEventListener('DOMContentLoaded', setup);



