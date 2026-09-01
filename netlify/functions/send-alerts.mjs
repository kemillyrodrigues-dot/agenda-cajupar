import { getStore } from '@netlify/blobs';
import webpush from 'web-push';
import { diaBR, horaBR, montaMensagem } from '../lib/dados.mjs';

/* 11:00 e 19:00 UTC = 08:00 e 16:00 em Brasília (UTC-3, sem horário de verão) */
export const config = { schedule: '0 11,19 * * *' };

export async function enviarAlertas({ dia, hora, teste = false, somenteMarca = null } = {}) {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return { erro: 'VAPID nao configurado' };
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:kemillyrodrigues@cajupar.com', pub, priv);

  const store = getStore({ name: 'agenda-subs', consistency: 'strong' });
  const { blobs } = await store.list();
  const resumo = { dia, hora, total: blobs.length, enviados: 0, semItens: 0, removidos: 0, falhas: 0 };

  for (const b of blobs) {
    const reg = await store.get(b.key, { type: 'json' }).catch(() => null);
    if (!reg || !reg.subscription) continue;
    if (somenteMarca && reg.marca !== somenteMarca) continue;
    const msg = montaMensagem(reg.marca, dia, hora);
    if (!msg) { resumo.semItens++; continue; }
    if (teste) msg.title = '[teste] ' + msg.title;
    try {
      await webpush.sendNotification(reg.subscription, JSON.stringify(msg), { TTL: 6 * 3600 });
      resumo.enviados++;
    } catch (e) {
      const code = e && e.statusCode;
      if (code === 404 || code === 410) { await store.delete(b.key); resumo.removidos++; }
      else resumo.falhas++;
    }
  }
  return resumo;
}

export default async () => {
  const agora = new Date();
  const resumo = await enviarAlertas({ dia: diaBR(agora), hora: horaBR(agora) });
  console.log('send-alerts', JSON.stringify(resumo));
  return new Response(JSON.stringify(resumo), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
