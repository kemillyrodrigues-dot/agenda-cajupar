import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';
import * as D from '../lib/dados.mjs';

const SEGREDO = process.env.SESSION_SECRET || '';

function b64url(b) { return Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }

function verifica(token) {
  if (!token || !SEGREDO) return null;
  const i = token.lastIndexOf('.');
  if (i < 1) return null;
  const corpo = token.slice(0, i);
  const mac = token.slice(i + 1);
  const h = crypto.createHmac('sha256', SEGREDO).update(corpo).digest();
  const opcoes = [b64url(h), h.toString('hex'), h.toString('base64')];
  if (!opcoes.some(o => o.length === mac.length && crypto.timingSafeEqual(Buffer.from(o), Buffer.from(mac)))) return null;
  try {
    const p = JSON.parse(Buffer.from(corpo.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
    const exp = p.exp || p.e || p.v;
    if (typeof exp === 'number' && exp > 1e9 && exp * (exp < 1e12 ? 1000 : 1) < Date.now()) return null;
    return p;
  } catch (e) { return null; }
}

function daRequisicao(req) {
  const h = req.headers.get('authorization') || '';
  const m = /^Bearer\s+(.+)$/i.exec(h.trim());
  return verifica(m ? m[1] : '');
}

function loja(t) { return t.marca || t.m || t.u || t.unidade || null; }
function perfilDe(t) { return t.p || t.perfil || null; }

function lojas() {
  const un = D.UN || {};
  const ordem = (D.ORDEM && D.ORDEM.length ? D.ORDEM : Object.keys(un));
  return ordem.filter(id => un[id]).map(id => ({ id, nome: un[id].nome || un[id].rotulo || id }));
}

const loja_store = () => getStore({ name: 'agenda-regras', consistency: 'strong' });

async function ler() {
  try { return (await loja_store().get('regras', { type: 'json' })) || {}; }
  catch (e) { return {}; }
}

const json = (o, s = 200) => new Response(JSON.stringify(o), {
  status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

export default async (req) => {
  const t = daRequisicao(req);
  if (!t) return json({ ok: false, erro: 'sessao' }, 401);
  const perfil = perfilDe(t);
  const todas = await ler();

  if (req.method === 'GET') {
    if (perfil === 'unidade') {
      const id = loja(t);
      return json({ ok: true, perfil, marca: id, regras: { [id]: todas[id] || [] } });
    }
    return json({ ok: true, perfil, lojas: lojas(), regras: todas });
  }

  if (req.method === 'POST') {
    if (perfil !== 'admin') return json({ ok: false, erro: 'sem permissao' }, 403);
    let c = {};
    try { c = await req.json(); } catch (e) { return json({ ok: false, erro: 'corpo' }, 400); }
    const id = String(c.marca || '');
    if (!lojas().some(l => l.id === id)) return json({ ok: false, erro: 'loja' }, 400);
    const itens = (Array.isArray(c.itens) ? c.itens : [])
      .map(s => String(s).trim()).filter(Boolean).slice(0, 40).map(s => s.slice(0, 400));
    if (itens.length) todas[id] = itens; else delete todas[id];
    await loja_store().setJSON('regras', todas);
    return json({ ok: true, lojas: lojas(), regras: todas });
  }

  return json({ ok: false, erro: 'metodo' }, 405);
};
