import { getStore } from '@netlify/blobs';
import { tokenDaRequisicao } from '../lib/acesso.mjs';
import { agendaPara, dataBR } from '../lib/dados.mjs';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

export default async (req) => {
  const t = tokenDaRequisicao(req);
  if (!t) return json({ erro: 'sessao invalida' }, 401);
  const dados = agendaPara(t.p, t.m);
  const data = dataBR();
  let feitos = {};
  if (t.p === 'unidade') {
    feitos = (await getStore({ name: 'agenda-feito', consistency: 'strong' }).get(data + '__' + t.m, { type: 'json' }).catch(() => null)) || {};
  }
  return json({ perfil: t.p, marca: t.m, data, feitos, ...dados });
};
