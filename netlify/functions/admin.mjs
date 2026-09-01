import { tokenDaRequisicao, lerCredenciais, salvarCredenciais, listarPedidos, mudarPedido } from '../lib/acesso.mjs';
import { ORDEM, UN } from '../lib/dados.mjs';
import { getStore } from '@netlify/blobs';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

export default async (req) => {
  const t = tokenDaRequisicao(req);
  if (!t || t.p !== 'admin') return json({ erro: 'acesso restrito' }, 403);
  if (req.method !== 'POST') return json({ erro: 'use POST' }, 405);
  let b; try { b = await req.json(); } catch { return json({ erro: 'json invalido' }, 400); }

  if (b.acao === 'estado') {
    const c = await lerCredenciais();
    const pedidos = await listarPedidos();
    let inscricoes = [];
    try {
      const { blobs } = await getStore({ name: 'agenda-subs', consistency: 'strong' }).list();
      for (const bl of blobs) {
        const r = await getStore({ name: 'agenda-subs', consistency: 'strong' }).get(bl.key, { type: 'json' }).catch(() => null);
        if (r) inscricoes.push({ marca: r.marca, em: r.atualizadoEm });
      }
    } catch { inscricoes = []; }
    const porMarca = {};
    for (const i of inscricoes) porMarca[i.marca] = (porMarca[i.marca] || 0) + 1;
    return json({ credenciais: c, pedidos, avisos: { total: inscricoes.length, porMarca },
      unidades: ORDEM.map(id => ({ id, nome: UN[id].nome })) });
  }

  if (b.acao === 'trocar-senha') {
    const nova = String(b.senha || '').trim();
    if (nova.length < 4) return json({ erro: 'A senha precisa de ao menos 4 caracteres.' }, 400);
    const c = await lerCredenciais();
    if (b.alvo === 'admin') c.admin.senha = nova;
    else if (b.alvo === 'compradores') c.compradores.senha = nova;
    else if (c.unidades[b.alvo]) c.unidades[b.alvo].senha = nova;
    else return json({ erro: 'destino desconhecido' }, 400);
    await salvarCredenciais(c);
    return json({ ok: true, credenciais: c });
  }

  if (b.acao === 'pedido') {
    const r = await mudarPedido(String(b.id || ''), String(b.situacao || ''));
    const pedidos = await listarPedidos();
    return json({ ok: r.ok, pedidos });
  }

  return json({ erro: 'acao desconhecida' }, 400);
};
