"use strict";
/* "Where did you hear about me?" card. Main page only. Answers go to the same anonymous Sheet. Skipped answers are not saved. */
(async()=>{
  if(!document.getElementById("work")||!window.KKT||!KKT.isOn())return;
  const ls=(k,v)=>{try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){return null}};
  const ss=(k,v)=>{try{return v===undefined?sessionStorage.getItem(k):sessionStorage.setItem(k,v)}catch(e){return null}};
  const S=await load("survey"),head=S[0]||{},opts=S.slice(1).filter(o=>o.label);
  if(!opts.length||ls("kk_ans")==="1"||ss("kk_snooze")==="1")return;
  const max=parseInt(head.max_asks,10)||0,asked=parseInt(ls("kk_asks")||"0",10);if(max>0&&asked>=max)return;
  let shown=false,card=null;
  const close=skip=>{if(!card)return;card.remove();card=null;if(skip)ss("kk_snooze","1")};
  const answer=a=>{a=String(a||"").replace(/[\u0000-\u001f<>]/g,"").trim().slice(0,60);if(!a||!card)return;KKT.track("survey_answer",a);KKT.flush();ls("kk_ans","1");card.replaceChildren(h("p","thx",head.thanks||"Thank you!"));setTimeout(()=>close(false),2200)};
  const other=()=>{const c=card.querySelector(".chips"),i=document.createElement("input");i.type="text";i.maxLength=60;i.placeholder=head.other_placeholder||"Tell me where";i.setAttribute("aria-label",i.placeholder);
    const b=h("button","send",head.send_label||"Send");b.type="button";b.addEventListener("click",()=>answer(i.value));i.addEventListener("keydown",e=>{if(e.key==="Enter")answer(i.value)});c.replaceChildren(i,b);i.focus()};
  const show=()=>{if(shown||document.hidden||document.querySelector("dialog[open]"))return;shown=true;ls("kk_asks",String(asked+1));
    card=h("aside","survey");card.setAttribute("role","dialog");card.setAttribute("aria-label",head.title||"Quick question");
    const x=h("button","x","×");x.type="button";x.setAttribute("aria-label","Close");x.addEventListener("click",()=>close(true));
    card.append(x,h("h3",0,head.title||"Where did you hear about me?"));if(head.subtitle)card.append(h("p",0,head.subtitle));
    const chips=h("div","chips");opts.forEach(o=>{const b=h("button",0,o.label);b.type="button";b.addEventListener("click",()=>/^y/i.test(o.input||"")?other():answer(o.label));chips.append(b)});
    const sk=h("button","skip",head.skip_label||"Skip");sk.type="button";sk.addEventListener("click",()=>close(true));
    card.append(chips,sk);document.body.append(card)};
  setTimeout(show,Math.max(5,parseInt(head.delay_seconds,10)||25)*1000);
  const sv=document.getElementById("services");if(sv&&"IntersectionObserver" in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();setTimeout(show,2500)}},{threshold:.3});io.observe(sv)}
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&card)close(true)});
})();
