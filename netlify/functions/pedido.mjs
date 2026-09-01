import { novoPedido } from '../lib/acesso.mjs';
import { UN } from '../lib/dados.mjs';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });
const limpa = (v, max) => String(v || '').trim().slice(0, max);

export default async (req) => {
  if (req.method !== 'POST') return json({ erro: 'use POST' }, 405);
  let b; try { b = await req.json(); } catch { return json({ erro: 'json invalido' }, 400); }

  const nome = limpa(b.nome, 80);
  const email = limpa(b.email, 120);
  const unidade = limpa(b.unidade, 30);
  const cargo = limpa(b.cargo, 40);
  const obs = limpa(b.obs, 300);

  if (nome.length < 3) return json({ erro: 'Informe seu nome completo.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ erro: 'Informe um e-mail válido.' }, 400);
  if (unidade !== 'compradores' && !UN[unidade]) return json({ erro: 'Escolha a sua unidade.' }, 400);

  await novoPedido({ nome, email, unidade, cargo, obs,
    unidadeNome: unidade === 'compradores' ? 'Compradores' : UN[unidade].nome });
  return json({ ok: true });
};
