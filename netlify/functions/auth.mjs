import { identificar, assinar, podeTentar, registrarFalha, limparFalhas } from '../lib/acesso.mjs';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });
const DIAS30 = 30 * 24 * 3600 * 1000;

export default async (req) => {
  if (req.method !== 'POST') return json({ erro: 'use POST' }, 405);
  let body; try { body = await req.json(); } catch { return json({ erro: 'json invalido' }, 400); }

  const ip = req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || 'sem-ip';
  const freio = await podeTentar(ip);
  if (!freio.ok) return json({ erro: 'Muitas tentativas. Tente de novo em ' + Math.ceil(freio.esperar / 60) + ' minutos.' }, 429);

  const quem = await identificar(body.senha);
  if (!quem) {
    await registrarFalha(freio.chave, freio.registro);
    return json({ erro: 'Senha não reconhecida.' }, 401);
  }
  await limparFalhas(freio.chave);
  const token = assinar({ p: quem.perfil, m: quem.marca, exp: Date.now() + DIAS30 });
  return json({ token, perfil: quem.perfil, marca: quem.marca, rotulo: quem.rotulo });
};
