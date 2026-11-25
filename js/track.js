"use strict";
/* ANONYMOUS VISIT STATISTICS. Sends only to YOUR Google Sheet (address in data/analytics.js). No cookies, no IP address, no names.
   Does nothing until an address is set. Respects Do Not Track and the Statistics switch in the footer. */
(()=>{
const cfg=(window.DATA&&DATA.analytics&&parse(DATA.analytics)[0])||{};
const ls=(k,v)=>{try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){return null}};
const configured=/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(cfg.endpoint||"")&&!!cfg.token&&!/^n/i.test(cfg.enabled||"yes");
const on=()=>configured&&navigator.doNotTrack!=="1"&&ls("kk_nt")!=="1";
const rnd=n=>[...crypto.getRandomValues(new Uint8Array(n))].map(b=>(b%36).toString(36)).join("");
const why=()=>!configured?"not set up (endpoint or token missing, or enabled: no)":navigator.doNotTrack==="1"?"your browser sends Do Not Track":ls("kk_nt")==="1"?"switched off with the footer switch":"";
console.info("[stats]",on()?"ON, sending to your Google Sheet":"OFF: "+why());
let vid=ls("kk_id"),isNew=0;if(!/^[a-z0-9]{8,32}$/.test(vid||"")){vid=rnd(16);ls("kk_id",vid);isNew=1}
let sid;try{sid=sessionStorage.getItem("kk_sid");if(!sid){sid=rnd(10);sessionStorage.setItem("kk_sid",sid)}}catch(e){sid=rnd(10)}
const name=(location.pathname.split("/").pop()||"index").replace(/\.html$/,"")||"index";
const page=["index","welcome","sohof","library"].includes(name)?name:"other";
let tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}
let ref="";try{if(document.referrer){const u=new URL(document.referrer);if(u.host!==location.host)ref=u.hostname}}catch(e){}
const q=[],t0=Date.now();
function flush(){if(!q.length||!on())return;const evs=q.splice(0,25);const body=JSON.stringify({k:cfg.token,v:vid,s:sid,p:page,d:document.documentElement.dataset.device||"desktop",z:tz,l:navigator.language||"",r:ref,n:isNew,ev:evs});
  console.info("[stats] sending",evs.length,"event(s):",evs.map(e=>e.t).join(", "));
  try{if(!(navigator.sendBeacon&&navigator.sendBeacon(cfg.endpoint,body)))fetch(cfg.endpoint,{method:"POST",mode:"no-cors",body,keepalive:true})}catch(e){}}
function track(t,x){if(!on())return;q.push({t,x:String(x==null?"":x).slice(0,80)});if(q.length>=10)flush()}
if(configured){setInterval(flush,8000);
  let seg=Date.now();const leave=()=>{const s=Math.round((Date.now()-seg)/1000);if(s<1)return;track("leave",Math.min(1800,s));flush();seg=Date.now()};
  document.addEventListener("visibilitychange",()=>{document.hidden?leave():seg=Date.now()});addEventListener("pagehide",leave);
  track("view");
  if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){track("section_view",e.target.id);io.unobserve(e.target)}}),{threshold:.4});document.querySelectorAll("main>section[id]").forEach(s=>io.observe(s))}
  const MAP=[[".mail","email_click"],["[data-href=linkedin]","linkedin_click"],["[data-href=behance]","behance_click"],["#wa","whatsapp_click"],["[data-href=sohof_linkedin]","sohof_linkedin_click"],["[data-share]","copy_link"],["#pricebtn","pricing_open"],[".gift","treat_click"],["#pill","offer_pill"],["a[href='sohof.html']","sohof_visit"],["a[href='library.html']","library_open"],[".edge","portfolio_arrow"],["#fnext","fact_next"],["#candle","candle"],["#bPu","plush_punch"],["#bSq","plush_squeeze"],["#plush","plush_tap"]];
  const txt=(el,s)=>{const n=el.querySelector(s);return n?n.textContent:""};
  document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;
    const tg=t.closest(".tgb");if(tg){setTimeout(()=>track("toggle",(tg.title||"switch")+": "+(tg.getAttribute("aria-pressed")==="true"?"on":"off")),0);return}
    let el;if(el=t.closest(".card")){track("portfolio_click",txt(el,"b"));return}
    if(el=t.closest(".cell")){track("service_click",txt(el,"h3"));return}
    if(el=t.closest(".offer")){track("offer_click",txt(el,"h3"));return}
    if(el=t.closest("nav .lk")){track("nav_click",el.getAttribute("href"));return}
    for(const[s,n]of MAP)if(t.closest(s)){track(n);return}},true);
  /* footer: privacy line and the visitor's own on/off switch */
  const ob=document.getElementById("optout"),pv=document.querySelector(".priv");
  if(ob&&pv){pv.hidden=false;const dnt=navigator.doNotTrack==="1";const lab=()=>{ob.textContent=dnt?"Statistics: off (Do Not Track)":(ls("kk_nt")==="1"?"Statistics: off":"Statistics: on")};lab();ob.disabled=dnt;ob.addEventListener("click",()=>{ls("kk_nt",ls("kk_nt")==="1"?"0":"1");lab()})}
}
window.KKT={track,flush,isOn:on,configured};
})();
