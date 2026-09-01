import { getStore } from '@netlify/blobs';
import { tokenDaRequisicao } from '../lib/acesso.mjs';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

async function chave(endpoint) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 40);
}

export default async (req) => {
  if (req.method !== 'POST') return json({ erro: 'use POST' }, 405);
  const t = tokenDaRequisicao(req);
  if (!t) return json({ erro: 'sessao invalida' }, 401);

  let body; try { body = await req.json(); } catch { return json({ erro: 'json invalido' }, 400); }
  const sub = body && body.subscription;
  if (!sub || !sub.endpoint) return json({ erro: 'assinatura sem endpoint' }, 400);

  const store = getStore({ name: 'agenda-subs', consistency: 'strong' });
  const key = await chave(sub.endpoint);

  if (body.acao === 'remover') {
    await store.delete(key);
    return json({ ok: true, acao: 'removida' });
  }
  /* a marca vem do login, nunca do cliente */
  const marca = t.p === 'unidade' ? t.m : 'todas';
  await store.setJSON(key, { subscription: sub, marca, perfil: t.p,
    atualizadoEm: new Date().toISOString(), ua: req.headers.get('user-agent') || '' });
  return json({ ok: true, acao: 'salva', marca });
};
