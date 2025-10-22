// Work Bridge - Épico 2: Busca de Profissionais
// Estruturado para futura integração com API (ex.: GET /api/profissionais)

// Dados simulados (mock). No futuro, substituir por fetch('/api/profissionais')
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
    foto: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
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

const ESPECIALIDADES = ["Pedreiro", "Eletricista", "Encanador", "Pintor", "Azulejista", "Hidráulica", "Texturização"];

function renderChips(container) {
  container.innerHTML = '';
  ESPECIALIDADES.forEach(esp => {
    const chip = document.createElement('label');
    chip.className = 'chip';
    chip.innerHTML = `<input type="checkbox" value="${esp}"><span>${esp}</span>`;
    chip.addEventListener('change', (e) => {
      chip.classList.toggle('chip--active', e.target.checked);
    });
    container.appendChild(chip);
  });
}

function getSelectedEspecialidades(container) {
  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);
}

function normalize(str) {
  return (str || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function stars(nota) {
  const full = Math.round(nota);
  const filled = '★'.repeat(full);
  const empty = '☆'.repeat(5 - full);
  return `${filled}${empty}`;
}

function relevanceScore(p) {
  // Heurística simples de relevância: peso serviços + nota
  return p.servicosConcluidos * 0.7 + p.nota * 100;
}

function filtrarOrdenar(profs, termoLocal, especialidades, ordenacao) {
  const t = normalize(termoLocal);
  let lista = profs.filter(p => {
    const local = normalize(`${p.cidade}/${p.estado}`);
    const matchesLocal = t ? local.includes(t) : true;
    const matchesEsp = especialidades.length
      ? especialidades.some(e => p.especialidades.map(normalize).includes(normalize(e)))
      : true;
    return matchesLocal && matchesEsp;
  });

  if (ordenacao === 'avaliacao') {
    lista.sort((a, b) => b.nota - a.nota);
  } else {
    lista.sort((a, b) => relevanceScore(b) - relevanceScore(a));
  }
  return lista;
}

function renderResultados(container, countEl, lista) {
  countEl.textContent = `${lista.length} resultado(s)`;
  container.innerHTML = '';
  if (!lista.length) {
    container.innerHTML = '<p style="color:#6b7280;">Nenhum profissional encontrado.</p>';
    return;
  }
  lista.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="card__photo" src="${p.foto}" alt="Foto de ${p.nome}">
      <div>
        <h3 class="card__title">${p.nome}</h3>
        <div class="card__meta">${p.especialidade} • ${p.cidade}/${p.estado}</div>
        <div class="card__footer">
          <div class="rating"><span class="stars">${stars(p.nota)}</span><small>${p.nota.toFixed(1)}</small></div>
          <a class="btn" href="./perfil.html?id=${p.id}">Ver Perfil</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function setup() {
  const chipsContainer = document.getElementById('chipsEspecialidades');
  const cidadeEstado = document.getElementById('cidadeEstado');
  const ordenacao = document.getElementById('ordenacao');
  const btnBuscar = document.getElementById('btnBuscar');
  const btnLimpar = document.getElementById('btnLimpar');
  const listaResultados = document.getElementById('listaResultados');
  const resultadoCount = document.getElementById('resultadoCount');

  renderChips(chipsContainer);

  function executarBusca() {
    // Futuro: substituir blocos abaixo por chamada fetch('/api/profissionais?...')
    const especialidadesSel = getSelectedEspecialidades(chipsContainer);
    const termo = cidadeEstado.value;
    const ord = ordenacao.value;
    const lista = filtrarOrdenar(profissionais, termo, especialidadesSel, ord);
    renderResultados(listaResultados, resultadoCount, lista);
  }

  btnBuscar.addEventListener('click', executarBusca);
  btnLimpar.addEventListener('click', () => {
    cidadeEstado.value = '';
    ordenacao.value = 'relevancia';
    chipsContainer.querySelectorAll('input[type="checkbox"]').forEach(i => {
      i.checked = false; i.dispatchEvent(new Event('change'));
    });
    executarBusca();
  });
  ordenacao.addEventListener('change', executarBusca);
  cidadeEstado.addEventListener('keyup', (e) => { if (e.key === 'Enter') executarBusca(); });

  // Busca inicial
  executarBusca();
}

document.addEventListener('DOMContentLoaded', setup);



