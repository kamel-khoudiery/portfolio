"use strict";
/* Sounds, the three top-bar switches and the animation switch. Shared by every page. */
(()=>{
const K={sfx:"kk_sfx",amb:"kk_amb",anim:"kk_anim"};
const get=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const put=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const st={sfx:get(K.sfx)!=="0",amb:get(K.amb)!=="0",anim:get(K.anim)===null?!reduce:get(K.anim)!=="0"};
const cfg=(window.DATA&&DATA.sounds&&parse(DATA.sounds)[0])||{};
const file=n=>/^[\w.-]+\.(mp3|ogg|wav)$/i.test(n||"")?"sounds/"+n:null;
const ss=(k,v)=>{try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}};
const cache={};let amb=null,unlocked=ss("kk_ok")==="1",playing=false;
document.documentElement.classList.toggle("no-anim",!st.anim);

function sfx(key){if(!st.sfx)return;const f=file(cfg[key]);if(!f)return;let a=cache[f];if(!a){a=cache[f]=new Audio(f);a.preload="auto"}const c=a.cloneNode();c.volume=.35;c.play().catch(()=>{})}
function fade(a,to){const s=a.volume;let k=0;const i=setInterval(()=>{k+=.05;a.volume=Math.max(0,Math.min(1,s+(to-s)*k));if(k>=1)clearInterval(i)},80)}
function ambient(){if(!st.amb||!unlocked)return;const f=file(cfg.ambient);if(!f)return;
  if(!amb){amb=new Audio(f);amb.loop=true;amb.volume=0;const at=parseFloat(ss("kk_t"))||0;amb.addEventListener("loadedmetadata",()=>{if(at&&amb.duration)amb.currentTime=at%amb.duration},{once:true})}
  amb.play().then(()=>{if(!playing){playing=true;fade(amb,parseFloat(cfg.ambient_volume)||.25)}}).catch(()=>{playing=false})}
function stopAmbient(){if(amb){amb.pause();amb.removeAttribute("src");amb.load();amb=null;playing=false}}
const unlock=()=>{ss("kk_ok","1");unlocked=true;if(!playing)ambient()};
["pointerdown","keydown"].forEach(ev=>addEventListener(ev,unlock));
document.addEventListener("visibilitychange",()=>{if(!amb)return;document.hidden?amb.pause():amb.play().catch(()=>{})});

/* the three switches */
const ICON={sfx:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9c1.5 1.5 1.5 4.5 0 6M18.5 6.5c3 3 3 8 0 11"/>',amb:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',anim:'<path d="M13 3l1.6 4.4L19 9l-4.4 1.6L13 15l-1.6-4.4L7 9l4.4-1.6z"/><path d="M3 15h5M2 19h9M5 22h4"/>'};
const LAB={sfx:"Click sounds",amb:"Ambient sound",anim:"Animations"};
const nav=document.querySelector("header nav");
if(nav){const box=document.createElement("div");box.className="tg";
  ["sfx","amb","anim"].forEach(k=>{const b=document.createElement("button");b.type="button";b.className="tgb";b.title=LAB[k]+" on/off";b.setAttribute("aria-label",LAB[k]);
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+ICON[k]+'</svg>';
    const sync=()=>b.setAttribute("aria-pressed",String(st[k]));sync();
    b.addEventListener("click",e=>{e.stopPropagation();st[k]=!st[k];put(K[k],st[k]?"1":"0");sync();
      if(k==="amb"){if(st.amb){ss("kk_ok","1");unlocked=true;ambient()}else stopAmbient()}
      if(k==="anim")document.documentElement.classList.toggle("no-anim",!st.anim);
      if(k==="sfx"&&st.sfx)sfx("button")});
    box.append(b)});
  nav.insertBefore(box,nav.querySelector(".btn.sm"))}

/* which click makes which sound */
const MAP=[[".edge","card"],["header .lk,header .btn,header .pill,header .logo","whoosh"],[".card","card"],[".cell,.offer","diamond"],["[data-share]","diamond"],[".btn,.pill,.logo,.mail,.links a","button"]];
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;for(const[s,k]of MAP)if(t.closest(s)){sfx(k);return}});
addEventListener("pagehide",()=>{if(amb)ss("kk_t",String(amb.currentTime))});
ambient(); /* on a new page the sound simply carries on, if the browser allows it */
window.KK={st,sfx};
})();

/* TOUCH SCREENS: a SHORT tap plays the same effect as a mouse hover for about 2 seconds. A long press or a swipe does nothing. */
(()=>{const SEL=".btn,.pill,.edge,nav .lk,a.logo,.card,.cell,.offer,.chip,.brand,.mail,.tgb,.reason,.links a";let d=null;
addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"){d=null;return}d={t:performance.now(),x:e.clientX,y:e.clientY,el:e.target.closest?e.target.closest(SEL):null}},{passive:true});
addEventListener("pointerup",e=>{if(!d||!d.el)return;const ok=performance.now()-d.t<350&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<12,el=d.el;d=null;if(!ok)return;el.classList.add("tapped");setTimeout(()=>el.classList.remove("tapped"),2000)},{passive:true});
addEventListener("pointercancel",()=>{d=null},{passive:true})})();
