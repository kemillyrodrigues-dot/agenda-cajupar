/* Fonte única da agenda — organizada por LOJA (não por marca).
   Usada pela API, pelo checklist e pelas notificações. */

/* ---------------- lojas ---------------- */
export const UN = {
  /* Caminito */
  'cam-asa-sul':   { nome: 'Caminito Asa Sul',            cor: '#d97706', reg: 'Caminito' },
  'cam-asa-norte': { nome: 'Caminito Asa Norte',          cor: '#c2410c', reg: 'Caminito · única com shimeji e tilápia' },
  'cam-nazo-ac':   { nome: 'Caminito/Nazo Águas Claras',  cor: '#ea580c', reg: 'Caminito + Nazo · quadro único' },
  'cam-nazo-sig':  { nome: 'Caminito/Nazo SIG',           cor: '#ea580c', reg: 'Caminito + Nazo · quadro único' },
  /* Caju Limão */
  'caju-asa-norte':{ nome: 'Caju Limão Asa Norte',        cor: '#5f9b25', reg: 'Caju Limão · Brasília' },
  'caju-sudoeste': { nome: 'Caju Limão Sudoeste',         cor: '#4d8020', reg: 'Caju Limão · Brasília' },
  'caju-iam-sp':   { nome: 'Caju Limão Itaim (SP)',         cor: '#7cb342', reg: 'Caju Limão · São Paulo · calendário próprio' },
  /* Nazo */
  'nazo-asa-sul':  { nome: 'Nazo Asa Sul',                cor: '#b3382c', reg: 'Nazo · compras gerais via CPD' },
  'nazo-gyn':      { nome: 'Nazo GYN',                    cor: '#d05a3e', reg: 'Nazo · Goiânia · sem vinhos, shimeji e alface' },
  /* Fosters */
  'fb01':          { nome: 'Fosters Asa Sul (FB 01)',     cor: '#0f766e', reg: 'Fosters · hamburgueria' },
  'fb02':          { nome: 'Fosters Bosque (FB 02)',      cor: '#0f766e', reg: 'Fosters · hamburgueria' },
  'fb03':          { nome: 'Fosters Águas Claras (FB 03)',cor: '#0f766e', reg: 'Fosters · hamburgueria' },
  'fb04':          { nome: 'Fosters Sudoeste (FB 04)',    cor: '#0f766e', reg: 'Fosters · hamburgueria' },
  'fb05':          { nome: 'Fosters Asa Norte (FB 05)',   cor: '#0f766e', reg: 'Fosters · hamburgueria' },
  /* Responsa */
  'responsa':      { nome: 'Responsa',                    cor: '#6d28d9', reg: 'Sem vinhos' }
};

export const ORDEM = [
  'cam-asa-sul', 'cam-asa-norte', 'cam-nazo-ac', 'cam-nazo-sig',
  'caju-asa-norte', 'caju-sudoeste', 'caju-iam-sp',
  'nazo-asa-sul', 'nazo-gyn',
  'fb01', 'fb02', 'fb03', 'fb04', 'fb05',
  'responsa'
];
export const FKEY = {}; /* sem apelidos: cada loja é uma entrada */
export const DIAS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

/* ---------------- grupos ---------------- */
const CAMINITOS = ['cam-asa-sul', 'cam-asa-norte', 'cam-nazo-ac', 'cam-nazo-sig'];
const CAJUS_BSB = ['caju-asa-norte', 'caju-sudoeste'];
const CAJU_SP = ['caju-iam-sp'];
const FOSTERS = ['fb01', 'fb02', 'fb03', 'fb04', 'fb05'];
const CAJUS = [...CAJUS_BSB, ...CAJU_SP];   /* VPJ vale para todos os Cajus */
const TODAS = ORDEM;

/* solicitação geral de compras */
const COMPRAS_DOM = [...CAJUS_BSB, ...CAJU_SP, 'nazo-gyn', ...FOSTERS, 'responsa'];
const COMPRAS_QUA = [...CAJU_SP, 'nazo-gyn', ...FOSTERS, 'responsa'];
/* hortifruti */
const HORTI_SEG = [...CAJUS_BSB, ...CAJU_SP, 'nazo-gyn'];              /* domingo → segunda */
const HORTI_TER = [...CAMINITOS, 'nazo-asa-sul', ...FOSTERS, 'responsa']; /* domingo → terça à tarde */
const HORTI_QUA_QUI = HORTI_SEG;                                        /* quarta → quinta */
const HORTI_QUA_SEX = HORTI_TER;                                        /* quarta → sexta */
/* alface higienizado */
const ALFACE_PAD = [...CAMINITOS, ...CAJUS_BSB, 'nazo-asa-sul', ...FOSTERS];        /* ter→qua e sex→seg · Responsa não trabalha com alface */
const ALFACE_QUA = [...ALFACE_PAD, ...CAJU_SP];                                          /* qua→sex */
/* vinhos */
const VINHOS_QUA = [...CAMINITOS, 'nazo-asa-sul'];
const VINHOS_DOM = CAJU_SP;
/* sushi e peixes */
const SHIMEJI = ['cam-asa-norte', 'nazo-asa-sul'];
const CONJUNTAS = ['cam-nazo-ac', 'cam-nazo-sig'];   /* Caminito/Nazo: também pedem atum e tilápia */
const TILAPIA = ['cam-asa-norte', 'nazo-asa-sul', 'nazo-gyn', ...CONJUNTAS];
const ATUM = ['nazo-asa-sul', 'nazo-gyn', ...CONJUNTAS];
const SALMAO_GYN = ['nazo-gyn'];
const SALMAO_SUL = ['nazo-asa-sul'];
const SALMAO = [...SALMAO_GYN, ...SALMAO_SUL];
const FARINHA = CAJU_SP;   /* farinha amarela: só Caju Itaim */
/* Casa do Holandês */
const HOL_BSB = CAJUS_BSB;
const HOL_SP = CAJU_SP;

/* ---------------- janelas por item ----------------
   Regra geral: nada é solicitado na segunda nem na quinta.
   O que era pedido na segunda passou para domingo; o que era pedido
   na quinta passou para quarta. As entregas seguem nos mesmos dias. */
const R_COMPRAS = 'Identificar no grupo operacional. Ex.: Proteínas: 1234';
const R_HORTI = 'Identificar no grupo operacional. Ex.: Hortifruti: 4321';
const W_ALFACE_PAD = [{ s: 'Terça', r: 'Quarta' }, { s: 'Quarta', r: 'Sexta' }, { s: 'Sexta', r: 'Segunda' }];
const W_ALFACE_SP = [{ s: 'Domingo', r: 'Terça' }, { s: 'Quarta', r: 'Sexta' }];
const W_SHIMEJI = [{ s: 'Quarta', r: 'Segunda', next: 1 }, { s: 'Quarta', r: 'Quarta', next: 1 }];
const W_TILAPIA = [{ s: 'Quarta', r: 'Dia a combinar', next: 1 }];
const W_SALMAO_GYN = [{ s: 'Quarta', r: 'Terça', next: 1 }, { s: 'Quarta', r: 'Quinta', next: 1 }];
const W_SALMAO_SUL = [{ s: 'Quarta', r: 'Segunda a quinta', next: 1 }];
const W_ATUM = [{ s: 'Quarta', r: 'Até terça-feira', next: 1 }];
const W_FARINHA = [{ s: 'Domingo', r: 'Domingo', n: '7 dias depois', next: 1 }];
const W_VPJ = [{ s: 'Domingo', r: 'Terça-feira', next: 1 }];
const W_BREAD = [{ s: 'Quarta', r: 'Dia a definir', next: 1 }];

/* monta as linhas de cada loja a partir dos grupos */
function linhasDaLoja(id) {
  const L = [];
  const tem = g => g.includes(id);
  if (tem(COMPRAS_DOM) || tem(COMPRAS_QUA)) {
    const w = [];
    if (tem(COMPRAS_DOM)) w.push({ s: 'Domingo', r: 'Terça-feira' });
    if (tem(COMPRAS_QUA)) w.push({ s: 'Quarta', r: 'Sexta-feira' });
    L.push({ it: 'Solicitação geral de compras', nota: R_COMPRAS, w });
  }
  const wh = [];
  if (tem(HORTI_SEG)) wh.push({ s: 'Domingo', r: 'Segunda-feira' });
  if (tem(HORTI_TER)) wh.push({ s: 'Domingo', r: 'Terça-feira · à tarde' });
  if (tem(HORTI_QUA_QUI)) wh.push({ s: 'Quarta', r: 'Quinta-feira' });
  if (tem(HORTI_QUA_SEX)) wh.push({ s: 'Quarta', r: 'Sexta-feira' });
  if (wh.length) L.push({ it: 'Hortifruti', nota: R_HORTI, w: wh });

  if (tem(CAJUS)) L.push({ it: 'VPJ', only: 'Exclusivo Cajus', w: W_VPJ });
  if (tem(FOSTERS)) L.push({ it: 'Bread Maker', only: 'Exclusivo Fosters', w: W_BREAD });
  if (tem(FARINHA)) L.push({ it: 'Farinha amarela', only: 'Exclusivo Caju Itaim', w: W_FARINHA });

  if (tem(VINHOS_QUA)) L.push({ it: 'Vinhos', w: [{ s: 'Quarta', r: 'Sexta-feira' }] });
  if (tem(VINHOS_DOM)) L.push({ it: 'Vinhos', w: [{ s: 'Domingo', r: 'Até sexta-feira' }] });

  if (tem(HOL_BSB)) L.push({ it: 'Casa do Holandês', only: 'Exclusivo Cajus', w: [{ s: 'Domingo', r: 'Sexta-feira', n: 'da mesma semana' }] });
  if (tem(HOL_SP)) L.push({ it: 'Casa do Holandês', only: 'Exclusivo Cajus', w: [{ s: 'Domingo', r: 'Até terça-feira', next: 1 }] });

  if (tem(SALMAO_GYN)) L.push({ it: 'Salmão', w: W_SALMAO_GYN });
  if (tem(SALMAO_SUL)) L.push({ it: 'Salmão', nota: 'Janela de entrega de segunda a quinta', w: W_SALMAO_SUL });
  if (tem(SHIMEJI)) L.push({ it: 'Shimeji', w: W_SHIMEJI });
  if (tem(TILAPIA)) L.push({ it: 'Tilápia', nota: 'Entrega na semana seguinte, no dia que a loja escolher', w: W_TILAPIA });
  if (tem(ATUM)) L.push({ it: 'Atum', w: W_ATUM });

  if (tem(ALFACE_PAD)) L.push({ it: 'Alface higienizado', nota: 'Três janelas na semana', w: W_ALFACE_PAD });
  else if (tem(ALFACE_QUA)) L.push({ it: 'Alface higienizado', nota: 'Calendário próprio da SP', w: W_ALFACE_SP });
  return L;
}
export const LINHAS = Object.fromEntries(ORDEM.map(id => [id, linhasDaLoja(id)]));

/* ---------------- semana ---------------- */
export const SEMANA = [
  { n: 'Domingo', sol: [
      { it: 'Solicitação geral de compras', un: COMPRAS_DOM, ex: 'Entrega terça-feira · avisar no grupo: Proteínas: 1234' },
      { it: 'Hortifruti', un: TODAS, ex: 'Entrega segunda (CPD/Cajus/GYN) ou terça à tarde (demais) · avisar no grupo: Hortifruti: 4321' },
      { it: 'VPJ', un: CAJUS, ex: 'Recebe terça da semana seguinte', next: 1 },
      { it: 'Casa do Holandês', un: HOL_BSB, ex: 'Recebe sexta desta mesma semana' },
      { it: 'Casa do Holandês', un: HOL_SP, ex: 'Recebe até terça da semana seguinte', next: 1 },
      { it: 'Vinhos', un: VINHOS_DOM, ex: 'Recebe até sexta-feira' },
      { it: 'Alface higienizado', un: CAJU_SP, ex: 'Entrega terça-feira' },
      { it: 'Farinha amarela', un: FARINHA, ex: 'Recebe 7 dias depois, no domingo seguinte', next: 1 }
    ], rec: [
      { it: 'Farinha amarela', un: FARINHA, ex: 'Pedido do domingo da semana anterior', next: 1 }
    ] },

  { n: 'Segunda', sol: [], rec: [
      { it: 'Salmão', un: SALMAO_SUL, ex: 'Abre a janela de entrega (segunda a quinta) · pedido da quarta da semana anterior', next: 1 },
      { it: 'Hortifruti', un: HORTI_SEG, ex: '+ CPD · pedido de domingo' },
      { it: 'Alface higienizado', un: ALFACE_PAD, ex: 'Pedido de sexta' },
      { it: 'Shimeji', un: SHIMEJI, ex: 'Pedido da quarta da semana anterior', next: 1 }
    ] },

  { n: 'Terça', sol: [
      { it: 'Alface higienizado', un: ALFACE_PAD, ex: 'Entrega quarta-feira' }
    ], rec: [
      { it: 'Solicitação geral de compras', un: COMPRAS_DOM, ex: 'Pedido de domingo' },
      { it: 'Hortifruti', un: HORTI_TER, ex: 'Período da tarde · pedido de domingo' },
      { it: 'Alface higienizado', un: CAJU_SP, ex: 'Pedido de domingo' },
      { it: 'VPJ', un: CAJUS, ex: 'Pedido do domingo da semana anterior', next: 1 },
      { it: 'Salmão', un: SALMAO, ex: 'Pedido da quarta da semana anterior', next: 1 },
      { it: 'Atum', un: ATUM, ex: 'Prazo final · pedido da quarta da semana anterior', next: 1 },
      { it: 'Casa do Holandês', un: HOL_SP, ex: 'Prazo final · pedido do domingo da semana anterior', next: 1 }
    ] },

  { n: 'Quarta', sol: [
      { it: 'Solicitação geral de compras', un: COMPRAS_QUA, ex: 'Entrega sexta-feira · avisar no grupo: Proteínas: 1234' },
      { it: 'Hortifruti', un: HORTI_QUA_QUI, ex: 'Entrega quinta-feira · avisar no grupo: Hortifruti: 4321' },
      { it: 'Hortifruti', un: HORTI_QUA_SEX, ex: 'Entrega sexta-feira · avisar no grupo: Hortifruti: 4321' },
      { it: 'Vinhos', un: VINHOS_QUA, ex: 'Entrega sexta-feira' },
      { it: 'Bread Maker', un: FOSTERS, ex: 'Recebe na semana seguinte', next: 1 },
      { it: 'Atum', un: ATUM, ex: 'Recebe até terça da semana seguinte', next: 1 },
      { it: 'Salmão', un: SALMAO_GYN, ex: 'Recebe terça + quinta da semana seguinte', next: 1 },
      { it: 'Salmão', un: SALMAO_SUL, ex: 'Recebe de segunda a quinta da semana seguinte', next: 1 },
      { it: 'Shimeji', un: SHIMEJI, ex: 'Recebe segunda + quarta da semana seguinte', next: 1 },
      { it: 'Tilápia', un: TILAPIA, ex: 'Recebe na semana seguinte, no dia que a loja escolher', next: 1 },
      { it: 'Alface higienizado', un: ALFACE_QUA, ex: 'Entrega sexta-feira' }
    ], rec: [
      { it: 'Alface higienizado', un: ALFACE_PAD, ex: 'Pedido de terça' },
      { it: 'Shimeji', un: SHIMEJI, ex: 'Pedido da quarta da semana anterior', next: 1 }
    ] },

  { n: 'Quinta', sol: [], rec: [
      { it: 'Hortifruti', un: HORTI_QUA_QUI, ex: 'Pedido de quarta' },
      { it: 'Salmão', un: SALMAO_GYN, ex: 'Pedido da quarta da semana anterior', next: 1 },
      { it: 'Salmão', un: SALMAO_SUL, ex: 'Fecha a janela de entrega (segunda a quinta) · pedido da quarta da semana anterior', next: 1 }
    ] },

  { n: 'Sexta', sol: [
      { it: 'Alface higienizado', un: ALFACE_PAD, ex: 'Entrega segunda-feira' }
    ], rec: [
      { it: 'Solicitação geral de compras', un: COMPRAS_QUA, ex: 'Pedido de quarta' },
      { it: 'Hortifruti', un: HORTI_QUA_SEX, ex: 'Pedido de quarta' },
      { it: 'Vinhos', un: VINHOS_QUA, ex: 'Pedido de quarta' },
      { it: 'Vinhos', un: VINHOS_DOM, ex: 'Prazo final · pedido de domingo' },
      { it: 'Alface higienizado', un: ALFACE_QUA, ex: 'Pedido de quarta' },
      { it: 'Casa do Holandês', un: HOL_BSB, ex: 'Pedido de domingo desta mesma semana' }
    ] },

  { n: 'Sábado', sol: [], rec: [] }
];

/* ---------------- utilidades ---------------- */
export const pertence = (lista, id) => lista.some(u => (FKEY[u] || u) === id);

export function diaBR(date = new Date()) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short' }).format(date);
  const m = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return m[f] !== undefined ? m[f] : date.getUTCDay();
}
export function dataBR(date = new Date()) {
  /* YYYY-MM-DD no fuso de Brasília */
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
export function horaBR(date = new Date()) {
  return parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false }).format(date), 10);
}

export function agendaPara(perfil, marca) {
  const visiveis = perfil === 'unidade' ? [marca] : ORDEM;
  const un = {};
  for (const id of Object.keys(UN)) if (visiveis.includes(FKEY[id] || id)) un[id] = UN[id];
  const linhas = {};
  for (const id of visiveis) if (LINHAS[id]) linhas[id] = LINHAS[id];
  const semana = SEMANA.map(d => ({
    n: d.n,
    sol: d.sol.filter(e => e.un.some(u => visiveis.includes(FKEY[u] || u)))
              .map(e => ({ ...e, un: e.un.filter(u => visiveis.includes(FKEY[u] || u)) })),
    rec: d.rec.filter(e => e.un.some(u => visiveis.includes(FKEY[u] || u)))
              .map(e => ({ ...e, un: e.un.filter(u => visiveis.includes(FKEY[u] || u)) }))
  }));
  return { un, ordem: visiveis, linhas, semana, dias: DIAS, hoje: diaBR() };
}

export function itensDoDia(marca, dia) {
  const lista = (SEMANA[dia] ? SEMANA[dia].sol : []).filter(e => marca === 'todas' || pertence(e.un, marca));
  const vistos = new Set(); const out = [];
  for (const e of lista) { if (vistos.has(e.it)) continue; vistos.add(e.it); out.push(e); }
  return out;
}

export function montaMensagem(marca, dia, hora) {
  const itens = itensDoDia(marca, dia);
  if (!itens.length) return null;
  const nomes = itens.map(e => e.it).join(', ');
  const temNext = itens.some(e => e.next);
  const tarde = hora >= 12;
  const quem = marca === 'todas' ? 'Compradores' : (UN[marca] ? UN[marca].nome : marca);
  return {
    title: (tarde ? 'Ainda falta subir · ' : 'Solicitar hoje · ') + quem,
    body: (tarde ? 'Confira se já subiu: ' : DIAS[dia] + ': ') + nomes + '.'
      + (temNext ? ' Atenção: há item com entrega na semana seguinte.' : '')
      + ' Identifique a requisição no grupo da unidade.',
    tag: 'agenda-' + dia + '-' + (tarde ? 'pm' : 'am'),
    url: '/'
  };
}
