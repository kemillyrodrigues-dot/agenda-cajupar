/* Teste manual: /.netlify/functions/test-alert?token=SEGREDO[&dia=4][&hora=8][&marca=nazo-bsb] */
import { enviarAlertas } from './send-alerts.mjs';
import { diaBR, horaBR } from '../lib/dados.mjs';

export default async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (!process.env.TEST_TOKEN || token !== process.env.TEST_TOKEN) {
    return new Response(JSON.stringify({ erro: 'token invalido' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const agora = new Date();
  const dia = url.searchParams.get('dia') !== null ? Number(url.searchParams.get('dia')) : diaBR(agora);
  const hora = url.searchParams.get('hora') !== null ? Number(url.searchParams.get('hora')) : horaBR(agora);
  const marca = url.searchParams.get('marca');
  const resumo = await enviarAlertas({ dia, hora, teste: true, somenteMarca: marca });
  return new Response(JSON.stringify(resumo, null, 2), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
