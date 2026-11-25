(async()=>{applySite((await load("site"))[0]||{});$("img[data-opt]").forEach(optImg);
  /* falling petals on the library page (same as the welcome page) */
  const pb=document.getElementById("petals");if(pb)for(let i=0;i<14;i++){const p=h("span","petal"),s=8+Math.random()*9;p.style.left=Math.random()*100+"%";p.style.width=s+"px";p.style.height=s+"px";p.style.animationDuration=(16+Math.random()*14)+"s";p.style.animationDelay=(-Math.random()*30)+"s";pb.append(p)}
})();
