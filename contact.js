// Cloudflare Pages Function: POST /api/contact
// Setup: Pages project > Settings > Variables and Secrets: RESEND_API_KEY (secret) and MAIL_FROM (e.g. "Aziz Holdings <no-reply@azizholdings.pk>", domain verified in Resend).
const TO = {General:'Info@azizholdings.pk',PACS:'pacs@azizholdings.pk',GradePro:'Gradepro@azizholdings.pk',AASK:'AASk@azizholdings.pk',AAWF:'AAWF@azizholdings.pk'};
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export async function onRequestPost({ request, env }) {
  let d; try { d = await request.json(); } catch { return new Response('Bad request', { status: 400 }); }
  if (d.company) return new Response('ok'); // honeypot
  const name = String(d.name||'').slice(0,100), email = String(d.email||'').slice(0,150), msg = String(d.message||'').slice(0,800);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || msg.length < 10) return new Response('Invalid', { status: 422 });
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) return new Response('Not configured', { status: 503 });
  const to = TO[d.topic] || TO.General;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], reply_to: email, subject: `Website enquiry (${d.topic||'General'}) from ${name}`,
      html: `<p><b>${esc(name)}</b> &lt;${esc(email)}&gt; ${esc(d.phone||'')}</p><p>${esc(msg).replace(/\n/g,'<br>')}</p>` })
  });
  return new Response(r.ok ? 'ok' : 'Mail error', { status: r.ok ? 200 : 502 });
}
