(()=>{
const CFG=window.AZIZ={tz:'Asia/Lahore',days:[1,2,3,4,5,6],open:9,close:18,endpoint:'/api/contact',wa:'923104241477'}; // edit office hours here
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* nav */
const nav=$('#nav'),mb=$('.menu-btn'),top=$('.top');
mb.addEventListener('click',()=>{const o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');mb.setAttribute('aria-expanded',false)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');mb.setAttribute('aria-expanded',false)}});
const tt=$('.to-top');addEventListener('scroll',()=>{top.classList.toggle('scrolled',scrollY>10);tt.classList.toggle('show',scrollY>700)},{passive:true});
tt.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));
$$('#yr').forEach(e=>e.textContent=new Date().getFullYear());
/* live Lahore clock + office status */
const fmt=new Intl.DateTimeFormat('en-GB',{timeZone:CFG.tz,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,weekday:'short'});
function tick(){const p=Object.fromEntries(fmt.formatToParts(new Date()).map(x=>[x.type,x.value]));
 const dn=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday),h=+p.hour+ +p.minute/60;
 const open=CFG.days.includes(dn)&&h>=CFG.open&&h<CFG.close,t=`${p.hour}:${p.minute}:${p.second}`;
 const tw=x=>{const H=x%12||12;return H+(x<12?' am':' pm')};
 const msg=open?`Open now, until ${tw(CFG.close)}`:`Closed, opens ${tw(CFG.open)} on working days`;
 $$('[data-live]').forEach(el=>{el.classList.toggle('open',open);$('.t',el).textContent=`Lahore ${t}`;$('.s',el).textContent=msg})}
if($('[data-live]')){tick();setInterval(tick,1000)}
/* counters + reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target;
 if(el.classList.contains('reveal'))el.classList.add('in');
 if(el.dataset.count){const n=+el.dataset.count,s=el.dataset.suffix||'';if(reduce){el.textContent=n+s;return}
  const t0=performance.now();(function f(t){const p=Math.min((t-t0)/1500,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(f)})(t0)}}),{threshold:.25});
$$('.reveal,[data-count]').forEach(el=>io.observe(el));
/* scroll-spy (home) */
const spy=$$('nav a[href^="#"],nav a[href^="index.html#"]').map(a=>[a,$(a.getAttribute('href').replace('index.html',''))]).filter(x=>x[1]);
if(spy.length&&!$('nav a[aria-current="page"]')){const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)spy.forEach(([a,s])=>s===e.target?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current'))}),{rootMargin:'-40% 0px -55% 0px'});spy.forEach(([,s])=>so.observe(s))}
/* live course explorer */
const q=$('#q');if(q){const cards=$$('.course'),chips=$$('.chip'),cnt=$('#count'),em=$('.empty');let cat='all';
 const run=()=>{const v=q.value.trim().toLowerCase();let n=0;cards.forEach(c=>{const ok=(cat==='all'||c.dataset.cat===cat)&&(!v||c.textContent.toLowerCase().includes(v));c.hidden=!ok;if(ok)n++});
  cnt.textContent=`${n} ${n===1?'program':'programs'} shown`;em.style.display=n?'none':'block'};
 q.addEventListener('input',run);chips.forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.cat;chips.forEach(x=>x.setAttribute('aria-pressed',x===b));run()}));run();
 $$('[data-pick]').forEach(b=>b.addEventListener('click',()=>{const s=$('#topic');if(s)s.value='AASK';const m=$('#message');if(m&&!m.value)m.value=`I would like to enquire about: ${b.dataset.pick}`;m&&m.dispatchEvent(new Event('input'))}))}
/* enquiry form: live validation, counter, API with email fallback */
const f=$('#enquiry');if(f){const msg=$('#message'),max=800,st=$('.status',f),btn=$('button[type=submit]',f);
 const emails={General:'Info@azizholdings.pk',PACS:'pacs@azizholdings.pk','GradePro':'Gradepro@azizholdings.pk',AASK:'AASk@azizholdings.pk',AAWF:'AAWF@azizholdings.pk'};
 const rules={name:v=>v.trim().length>=2||'Please enter your name.',email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||'Enter a valid email address.',phone:v=>!v||/^[+\d][\d\s()-]{6,}$/.test(v)||'Enter a valid phone number.',message:v=>v.trim().length>=10||'Please write at least 10 characters.'};
 const check=el=>{const r=rules[el.name];if(!r)return true;const res=r(el.value),ok=res===true;el.setAttribute('aria-invalid',!ok);$('.err',el.closest('label')).textContent=ok?'':res;return ok};
 $$('input,textarea',f).forEach(el=>{el.addEventListener('blur',()=>check(el));el.addEventListener('input',()=>{if(el.getAttribute('aria-invalid')==='true')check(el)})});
 msg.addEventListener('input',()=>{$('#left').textContent=`${msg.value.length}/${max}`});
 f.addEventListener('submit',async e=>{e.preventDefault();st.className='status';const ok=$$('input,textarea',f).map(check).every(Boolean);if(!ok){$('[aria-invalid=true]',f).focus();return}
  const d=Object.fromEntries(new FormData(f));if(d.company)return;btn.disabled=true;btn.textContent='Sending...';
  try{const r=await fetch(CFG.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});if(!r.ok)throw 0;
   st.className='status ok';st.textContent='Thank you. Your enquiry has been sent and the team will reply by email.';f.reset();$('#left').textContent=`0/${max}`}
  catch{const to=emails[d.topic]||emails.General;st.className='status fail';st.textContent='Our online inbox is unavailable right now, so we opened your email app instead.';
   location.href=`mailto:${to}?subject=${encodeURIComponent('Website enquiry: '+d.topic)}&body=${encodeURIComponent(d.message+'\n\n'+d.name+(d.phone?' | '+d.phone:'')+' | '+d.email)}`}
  finally{btn.disabled=false;btn.textContent='Send enquiry'}})}
})();
