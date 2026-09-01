/* Gravação inicial / reset de emergência das senhas. Exige TEST_TOKEN.
   POST ?token=... com {credenciais:{...}} grava. GET ?token=... só diz se já existe. */
import { lerCredenciais, salvarCredenciais } from '../lib/acesso.mjs';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

export default async (req) => {
  const url = new URL(req.url);
  if (!process.env.TEST_TOKEN || url.searchParams.get('token') !== process.env.TEST_TOKEN) {
    return json({ erro: 'token invalido' }, 401);
  }
  if (req.method === 'GET') {
    const c = await lerCredenciais();
    return json({ configurado: true, acessos: ['admin', 'compradores', ...Object.keys(c.unidades)] });
  }
  if (req.method === 'POST') {
    let b; try { b = await req.json(); } catch { return json({ erro: 'json invalido' }, 400); }
    if (!b || !b.credenciais || !b.credenciais.admin || !b.credenciais.unidades) return json({ erro: 'credenciais incompletas' }, 400);
    await salvarCredenciais(b.credenciais);
    return json({ ok: true, gravado: Object.keys(b.credenciais.unidades).length + 2 });
  }
  return json({ erro: 'use GET ou POST' }, 405);
};
