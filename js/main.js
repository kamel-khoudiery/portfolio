"use strict";
/* Marquee: endless sliding row, used for logos and skills. make(i, isClone) returns one item. */
class Marquee{
  constructor(el,make,n,o={}){this.el=el;this.make=make;this.n=n;this.speed=o.speed||40;this.rev=!!o.reverse}
  async run(){
    const t=h("div","track");this.el.replaceChildren(t);
    const fill=k=>{t.replaceChildren();for(let r=0;r<k*2;r++)for(let i=0;i<this.n;i++)t.append(this.make(i,r>=k))};
    const ready=()=>Promise.all($("img",t).map(i=>i.decode().catch(()=>0)));
    fill(1);await ready();
    const k=Math.max(1,Math.ceil(this.el.clientWidth/(t.scrollWidth/2)));
    if(k>1){fill(k);await ready()}
    t.style.setProperty("--dur",Math.max(20,t.scrollWidth/2/this.speed)+"s");if(this.rev)t.classList.add("rev");
  }
}
(async()=>{
  const S=(await load("site"))[0]||{};applySite(S);
  const hd=$("header")[0],hero=$(".hero")[0];
  const f=()=>hd.classList.toggle("at-top",scrollY<hero.offsetHeight-hd.offsetHeight);f();addEventListener("scroll",f,{passive:true});addEventListener("resize",f);
  const wa=$("#wa")[0],wn=(S.whatsapp_number||"").replace(/\D/g,"");
  if(wa&&/^\d{8,15}$/.test(wn)){wa.href="https://wa.me/"+wn;wa.target="_blank";wa.rel="noopener noreferrer";wa.hidden=false}
  $(".portrait img").forEach(optImg);$("img[data-opt]").forEach(optImg);
  $("[data-share]").forEach(b=>b.addEventListener("click",async()=>{const t=b.textContent,u=location.href.split("#")[0];
    try{await navigator.clipboard.writeText(u)}catch(e){const x=document.createElement("input");x.value=u;document.body.append(x);x.select();document.execCommand("copy");x.remove()}
    b.textContent="Link copied";setTimeout(()=>b.textContent=t,1800)}));

  /* LOGOS: data/logos.txt lists the files in photos/logos (kept up to date by the GitHub Action) */
  const files=[...new Set(((window.DATA||{}).logos||"").split(/\r?\n/).map(x=>x.trim()).filter(safeFile))];
  const url=fn=>"photos/logos/"+encodeURIComponent(fn);
  const probe=fn=>new Promise(r=>{const i=new Image(),tm=setTimeout(()=>r(null),12000);i.onload=()=>{clearTimeout(tm);r(fn)};i.onerror=()=>{clearTimeout(tm);r(null)};i.src=url(fn)});
  const brands=(await Promise.all(files.map(probe))).filter(Boolean);
  const failed=files.filter(f=>!brands.includes(f));console.info("[logos] listed:",files.length,"loaded:",brands.length);if(failed.length)console.warn("[logos] these files did not load (check the name and folder):",failed);
  if(brands.length)new Marquee($("#logos")[0],(i,c)=>{const im=new Image();im.src=url(brands[i]);im.className="brand";im.alt=c?"":brands[i].replace(/\.\w+$/,"");if(c)im.setAttribute("aria-hidden","true");return im},brands.length,{speed:35}).run();
  else $("#brands")[0].hidden=true;

  /* NUMBERS: count up from zero when scrolled into view (always runs, no toggle) */
  const grid=$("#numbers .grid")[0],items=[];
  (await load("numbers")).forEach(n=>{const v=n.auto==="brands"?String(brands.length):n.value;if(!v||v==="0")return;
    const m=/^(\D*)(\d[\d,.]*)(.*)$/.exec(v),d=h("div","num"),bb=h("b",0,m?m[1]+"0"+m[3]:v);
    d.append(bb,h("span",0,n.label||""));grid.append(d);if(m)items.push([d,bb,m[1],parseFloat(m[2].replace(/,/g,"")),m[3]])});
  if(!grid.children.length)$("#numbers")[0].hidden=true;
  const count=([,b,pre,to,suf])=>{const t0=performance.now(),dur=1400;const tick=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);b.textContent=pre+Math.round(to*e).toLocaleString("en-US")+suf;if(k<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)};
  const nio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const it=items.find(x=>x[0]===e.target);if(it)count(it);nio.unobserve(e.target)}}),{threshold:.6});
  items.forEach(it=>nio.observe(it[0]));

  /* WORK: endless carousel. Cards come from data/work.js plus any image found in photos/work (listed by the GitHub Action in data/workfiles.js).
     The cards are repeated in three sets; when you stop near an end the view jumps one set, so it never runs out. */
  const rail=$("#rail")[0],works=await load("work"),used=new Set(works.map(w=>w.image));
  ((window.DATA||{}).workfiles||"").split(/\r?\n/).map(x=>x.trim()).filter(safeFile).forEach(f=>{if(!used.has(f)){const t=f.replace(/\.\w+$/,"").replace(/[-_]+/g," ");works.push({title:t.charAt(0).toUpperCase()+t.slice(1),type:"",image:f,color:"#2a2a2e"})}});
  const n=works.length,sets=n>1?3:1,cards=[];let touched=false,down=false,tmr;
  const make=(w,clone)=>{
    const ph=()=>{const p=h("div","ph",(w.title||"?")[0]);p.style.setProperty("--c",color(w.color));return p};
    const fg=h("figure","card"),art=h("div","art");
    if(safeFile(w.image)){const im=new Image();im.alt=clone?"":(w.title||"");im.decoding="async";im.addEventListener("error",()=>im.replaceWith(ph()));im.src="photos/work/"+encodeURIComponent(w.image);art.append(im)}else art.append(ph());
    const cap=h("figcaption");cap.append(h("b",0,w.title||""),h("span",0,w.type||""));fg.append(art,cap);if(clone)fg.setAttribute("aria-hidden","true");return fg};
  for(let r=0;r<sets;r++)works.forEach(w=>{const c=make(w,sets>1&&r!==1);rail.append(c);cards.push(c)});
  const mid=sets>1?n:0;let cur=mid;
  const to=(i,smooth=true)=>{i=Math.max(0,Math.min(cards.length-1,i));const el=cards[i];rail.scrollTo({left:el.offsetLeft+el.offsetWidth/2-rail.clientWidth/2,behavior:smooth?"smooth":"auto"})};
  const fx=()=>{const c=rail.scrollLeft+rail.clientWidth/2;let bd=1e9;cards.forEach((el,i)=>{const d=Math.abs(el.offsetLeft+el.offsetWidth/2-c),k=Math.min(1,d/(rail.clientWidth*.45));
    el.style.transform="scale("+(1-k*.32)+")";el.style.opacity=1-k*.7;el.style.zIndex=100-Math.round(k*50);if(d<bd){bd=d;cur=i}})};
  const settle=()=>{if(sets<2)return;if(down){tmr=setTimeout(settle,160);return}
    if(cur<n)rail.scrollLeft+=cards[cur+n].offsetLeft-cards[cur].offsetLeft;else if(cur>=2*n)rail.scrollLeft-=cards[cur].offsetLeft-cards[cur-n].offsetLeft};
  if(cards.length){const ro=new ResizeObserver(()=>{if(!touched)to(mid,false);fx()});ro.observe(rail);cards.forEach(c=>ro.observe(c))}
  rail.addEventListener("scroll",()=>{fx();clearTimeout(tmr);tmr=setTimeout(settle,160)},{passive:true});
  let vt,lastV=-1;rail.addEventListener("scroll",()=>{if(!touched)return;clearTimeout(vt);vt=setTimeout(()=>{const id=cur%n;if(id!==lastV&&window.KKT&&works[id]){lastV=id;KKT.track("portfolio_view",works[id].title)}},1400)},{passive:true});
  ["pointerdown","touchstart"].forEach(ev=>rail.addEventListener(ev,()=>{touched=true;down=true},{passive:true}));
  ["pointerup","pointercancel","touchend","pointerleave"].forEach(ev=>rail.addEventListener(ev,()=>{down=false},{passive:true}));
  rail.addEventListener("wheel",()=>{touched=true},{passive:true});
  cards.forEach((el,i)=>el.addEventListener("click",()=>{touched=true;if(i!==cur)to(i)}));
  $("#prev")[0].onclick=()=>{touched=true;to(cur-1)};$("#next")[0].onclick=()=>{touched=true;to(cur+1)};
  rail.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();touched=true;to(cur+1)}if(e.key==="ArrowLeft"){e.preventDefault();touched=true;to(cur-1)}});

  /* SERVICES, REASONS */
  (await load("services")).forEach(s=>{const d=h("div","cell"),ic=h("div","ic");
    if(safeName(s.icon)){const im=new Image();im.alt="";im.addEventListener("error",()=>im.remove());im.src="icons/"+s.icon+".svg";ic.append(im)}
    d.append(ic,h("h3",0,s.title),h("p",0,s.text));$("#svc")[0].append(d)});
  (await load("reasons")).forEach(r=>{const d=h("div","reason");d.append(h("h3",0,r.title),h("p",0,r.text));$("#reasons")[0].append(d)});

  /* OFFERS: seasonal by date (from / until, YYYY-MM-DD) */
  const today=new Date().toISOString().slice(0,10);
  const offers=(await load("offers")).filter(o=>(!o.from||o.from<=today)&&(!o.until||o.until>=today));
  offers.forEach((o,i)=>{const d=h("article","offer");d.append(h("h3",0,o.title),h("p",0,o.text));if(o.note)d.append(h("em",0,o.note));$("#offerlist")[0].append(d)});
  if(!offers.length)$("#offers")[0].hidden=true;
  const bo=offers.find(o=>/^y/i.test(o.banner||""));
  if(bo){const pl=$("#pill")[0];pl.replaceChildren(h("span","long",bo.banner_text||bo.title),h("span","short","Offers"));pl.hidden=false}

  /* SKILLS: two rows moving in opposite directions */
  const sk=await load("skills");
  const chip=(s,c)=>{const e=h("span","chip"),b=h("i","bd",(s.name||"?").slice(0,2));e.append(b);
    if(safeName(s.icon)){const im=new Image();im.alt="";im.addEventListener("load",()=>b.replaceWith(im));im.src="icons/"+s.icon+".svg"}
    e.append(h("span",0,s.name));if(c)e.setAttribute("aria-hidden","true");return e};
  [[sk.filter((_,i)=>i%2===0),"#sk1",false],[sk.filter((_,i)=>i%2===1),"#sk2",true]].forEach(([r,q,rev])=>{if(r.length)new Marquee($(q)[0],(i,c)=>chip(r[i],c),r.length,{speed:30,reverse:rev}).run();else $(q)[0].hidden=true});

  /* PRICING POLICY dialog (texts in data/pricing.js) */
  const P=await load("pricing"),hd2=P[0]||{},dlg=$("#pricing")[0];
  $("#pt")[0].textContent=hd2.title||"Pricing";$("#pi")[0].textContent=hd2.intro||"";$("#ps")[0].textContent=hd2.standard||"";$("#pf")[0].textContent=hd2.note||"";
  P.slice(1).forEach(p=>{if(!p.point)return;const li=h("li");if(p.heading)li.append(h("b",0,p.heading+" "));li.append(document.createTextNode(p.point));$("#pl")[0].append(li)});
  $("#pricebtn")[0].addEventListener("click",()=>{if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","")});
  $(".pclose")[0].addEventListener("click",()=>dlg.close());
  dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
})();
