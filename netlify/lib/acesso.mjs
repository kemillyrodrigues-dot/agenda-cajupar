/* Credenciais por unidade, token de sessão e pedidos de acesso. */
import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';
import { ORDEM, UN } from './dados.mjs';

const STORE = 'agenda-config';
const CHAVE = 'credenciais';

const SILABAS = ['ca', 'ju', 'par', 'ma', 're', 'lo', 'ta', 'vi', 'no', 'sa', 'be', 'mi', 'do', 'ra', 'fe', 'li'];

function senhaFacil() {
  const n = crypto.randomBytes(4);
  const p = SILABAS[n[0] % SILABAS.length] + SILABAS[n[1] % SILABAS.length] + SILABAS[n[2] % SILABAS.length];
  return p.charAt(0).toUpperCase() + p.slice(1) + (100 + (n[3] % 900));
}

export async function lerCredenciais() {
  const store = getStore({ name: STORE, consistency: 'strong' });
  let c = await store.get(CHAVE, { type: 'json' }).catch(() => null);
  if (!c) {
    c = {
      admin: { senha: senhaFacil(), rotulo: 'Administração (Kemilly)' },
      compradores: { senha: senhaFacil(), rotulo: 'Compradores — vê todas as lojas' },
      unidades: {}
    };
    for (const id of ORDEM) c.unidades[id] = { senha: senhaFacil(), rotulo: UN[id].nome };
    c.criadoEm = new Date().toISOString();
    await store.setJSON(CHAVE, c);
  }
  return c;
}

export async function salvarCredenciais(c) {
  c.atualizadoEm = new Date().toISOString();
  await getStore({ name: STORE, consistency: 'strong' }).setJSON(CHAVE, c);
  return c;
}

/* ---------- token ---------- */
const b64u = b => Buffer.from(b).toString('base64url');
const desb64u = s => Buffer.from(s, 'base64url').toString('utf8');

function segredo() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET nao configurado — assinatura de sessao indisponivel');
  return s;
}

export function assinar(payload) {
  const corpo = b64u(JSON.stringify(payload));
  const mac = crypto.createHmac('sha256', segredo()).update(corpo).digest('base64url');
  return corpo + '.' + mac;
}

export function verificar(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [corpo, mac] = token.split('.');
  const esperado = crypto.createHmac('sha256', segredo()).update(corpo).digest('base64url');
  const a = Buffer.from(mac || '');
  const b = Buffer.from(esperado);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(desb64u(corpo));
    if (!p.exp || p.exp < Date.now()) return null;
    return p;
  } catch { return null; }
}

export function tokenDaRequisicao(req) {
  const h = req.headers.get('authorization') || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null;
  return verificar(t);
}

/* compara em tempo constante, sem diferenciar maiúsculas/minúsculas nem espaços */
export function mesmaSenha(digitada, guardada) {
  const norm = s => String(s || '').trim();
  const a = Buffer.from(norm(digitada).toLowerCase());
  const b = Buffer.from(norm(guardada).toLowerCase());
  if (!a.length || a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function identificar(senha) {
  const c = await lerCredenciais();
  if (mesmaSenha(senha, c.admin.senha)) return { perfil: 'admin', marca: null, rotulo: c.admin.rotulo };
  if (mesmaSenha(senha, c.compradores.senha)) return { perfil: 'compradores', marca: null, rotulo: 'Compradores' };
  for (const id of Object.keys(c.unidades)) {
    if (mesmaSenha(senha, c.unidades[id].senha)) {
      return { perfil: 'unidade', marca: id, rotulo: (UN[id] && UN[id].nome) || id };
    }
  }
  return null;
}

/* ---------- freio de tentativas ---------- */
export async function podeTentar(ip) {
  const store = getStore({ name: STORE, consistency: 'strong' });
  const k = 'tentativas-' + Buffer.from(String(ip || 'sem-ip')).toString('base64url').slice(0, 24);
  const agora = Date.now();
  const r = (await store.get(k, { type: 'json' }).catch(() => null)) || { n: 0, ate: 0 };
  if (r.ate > agora) return { ok: false, esperar: Math.ceil((r.ate - agora) / 1000) };
  return { ok: true, chave: k, registro: r };
}
export async function registrarFalha(chave, registro) {
  const store = getStore({ name: STORE, consistency: 'strong' });
  const n = (registro.n || 0) + 1;
  const bloqueio = n >= 8 ? Date.now() + 10 * 60 * 1000 : 0;
  await store.setJSON(chave, { n: bloqueio ? 0 : n, ate: bloqueio });
}
export async function limparFalhas(chave) {
  await getStore({ name: STORE, consistency: 'strong' }).setJSON(chave, { n: 0, ate: 0 });
}

/* ---------- pedidos de acesso ---------- */
const PEDIDOS = 'agenda-pedidos';

export async function novoPedido(p) {
  const store = getStore({ name: PEDIDOS, consistency: 'strong' });
  const id = Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
  await store.setJSON(id, { ...p, id, situacao: 'pendente', criadoEm: new Date().toISOString() });
  return id;
}
export async function listarPedidos() {
  const store = getStore({ name: PEDIDOS, consistency: 'strong' });
  const { blobs } = await store.list();
  const out = [];
  for (const b of blobs) {
    const p = await store.get(b.key, { type: 'json' }).catch(() => null);
    if (p) out.push(p);
  }
  return out.sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''));
}
export async function mudarPedido(id, situacao) {
  const store = getStore({ name: PEDIDOS, consistency: 'strong' });
  if (situacao === 'apagar') { await store.delete(id); return { ok: true }; }
  const p = await store.get(id, { type: 'json' }).catch(() => null);
  if (!p) return { ok: false };
  p.situacao = situacao;
  p.decididoEm = new Date().toISOString();
  await store.setJSON(id, p);
  return { ok: true, pedido: p };
}
