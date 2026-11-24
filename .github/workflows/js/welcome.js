"use strict";
(async()=>{
  const W=(await load("welcome"))[0]||{};applySite(W);
  const snd=n=>window.KK&&KK.sfx(n);
  /* FACTS: one per line in data/facts.js */
  const facts=((window.DATA||{}).facts||"").split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&s[0]!=="#");
  const ft=$("#ftext")[0],fc=$("#fact")[0];let last=-1;
  const next=()=>{if(!facts.length){ft.textContent="Add facts in data/facts.js";return}let i;do{i=Math.floor(Math.random()*facts.length)}while(facts.length>1&&i===last);last=i;ft.textContent=facts[i];fc.classList.remove("pop");void fc.offsetWidth;fc.classList.add("pop")};
  $("#fnext")[0].addEventListener("click",next);next();
  /* CANDLE + BREATHING */
  const cd=$("#candle")[0],tg=()=>{cd.classList.toggle("lit");snd("diamond")};
  cd.addEventListener("click",tg);cd.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();tg()}});
  /* BREATHING: one clock drives the circle, the candle glow and the words, so they are always in step. It runs even when animations are off. */
  const ring=$(".ring")[0],bt=$("#btext")[0],CY=10000,IN=4000,ease=x=>.5-.5*Math.cos(Math.PI*x);let lastW="";
  (function loop(){const t=performance.now()%CY,b=t<IN?ease(t/IN):1-ease((t-IN)/(CY-IN)),w=t<IN?"Breathe in…":"Breathe out…";
    ring.style.transform="scale("+(.68+.32*b)+")";cd.style.setProperty("--b",b.toFixed(3));if(w!==lastW){bt.textContent=w;lastW=w}requestAnimationFrame(loop)})();
  /* PLUSHIE: hold to squeeze, tap to punch */
  const pl=$("#plush")[0],box=$("#plushbox")[0],cnt=$("#cnt")[0];let n=0,t0=0;
  const spark=()=>{for(let i=0;i<7;i++){const s=h("span","spark","✦"),a=i/7*Math.PI*2+Math.random()*.6,d=70+Math.random()*40;s.style.setProperty("--x",Math.cos(a)*d+"px");s.style.setProperty("--y",Math.sin(a)*d+"px");box.append(s);setTimeout(()=>s.remove(),750)}};
  const hit=()=>{pl.classList.remove("hit");void pl.getBoundingClientRect();pl.classList.add("hit");spark();cnt.textContent=++n;snd("thump")};
  pl.addEventListener("pointerdown",e=>{e.preventDefault();t0=performance.now();pl.classList.add("squeeze");snd("squeak")});
  const rel=()=>{if(!pl.classList.contains("squeeze"))return;pl.classList.remove("squeeze");if(performance.now()-t0<220)hit()};
  ["pointerup","pointerleave","pointercancel"].forEach(ev=>pl.addEventListener(ev,rel));
  $("#bSq")[0].addEventListener("click",()=>{pl.classList.add("squeeze");snd("squeak");setTimeout(()=>pl.classList.remove("squeeze"),900)});
  $("#bPu")[0].addEventListener("click",hit);
  /* FALLING PETALS */
  const pb=$("#petals")[0];for(let i=0;i<14;i++){const p=h("span","petal"),s=8+Math.random()*9;p.style.left=Math.random()*100+"%";p.style.width=s+"px";p.style.height=s+"px";p.style.animationDuration=(16+Math.random()*14)+"s";p.style.animationDelay=(-Math.random()*30)+"s";pb.append(p)}
})();
