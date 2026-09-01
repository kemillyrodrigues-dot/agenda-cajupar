/* Marcação "já subi" por unidade e por dia.
   GET  -> unidade: o que ela já marcou hoje | compradores/admin: situação de todas as lojas
   POST -> {item, feito:true|false}  (só perfil unidade) */
import { getStore } from '@netlify/blobs';
import { tokenDaRequisicao } from '../lib/acesso.mjs';
import { dataBR, diaBR, itensDoDia, ORDEM, UN } from '../lib/dados.mjs';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });
const STORE = 'agenda-feito';
const chave = (data, marca) => data + '__' + marca;

async function lerMarcas(data, marca) {
  return (await getStore({ name: STORE, consistency: 'strong' }).get(chave(data, marca), { type: 'json' }).catch(() => null)) || {};
}

export default async (req) => {
  const t = tokenDaRequisicao(req);
  if (!t) return json({ erro: 'sessao invalida' }, 401);
  const data = dataBR();
  const dia = diaBR();

  if (req.method === 'GET') {
    if (t.p === 'unidade') {
      return json({ data, feitos: await lerMarcas(data, t.m) });
    }
    /* visão de acompanhamento para compradores e admin */
    const lojas = [];
    for (const id of ORDEM) {
      const itens = itensDoDia(id, dia).map(e => e.it);
      if (!itens.length) continue;
      const marcas = await lerMarcas(data, id);
      lojas.push({
        id, nome: UN[id].nome,
        itens: itens.map(it => ({ it, feito: !!marcas[it], em: marcas[it] ? marcas[it].em : null })),
        feitos: itens.filter(it => marcas[it]).length, total: itens.length
      });
    }
    return json({ data, dia, lojas });
  }

  if (req.method === 'POST') {
    if (t.p !== 'unidade') return json({ erro: 'só as lojas marcam' }, 403);
    let b; try { b = await req.json(); } catch { return json({ erro: 'json invalido' }, 400); }
    const item = String(b.item || '').trim().slice(0, 60);
    if (!item) return json({ erro: 'item obrigatorio' }, 400);
    const validos = itensDoDia(t.m, dia).map(e => e.it);
    if (!validos.includes(item)) return json({ erro: 'este item nao e de hoje' }, 400);

    const store = getStore({ name: STORE, consistency: 'strong' });
    const atual = await lerMarcas(data, t.m);
    if (b.feito) atual[item] = { em: new Date().toISOString() };
    else delete atual[item];
    await store.setJSON(chave(data, t.m), atual);
    return json({ ok: true, feitos: atual });
  }

  return json({ erro: 'metodo' }, 405);
};
