"use strict";

(function(){
  const raw=Array.isArray(window.WEBSEC_TOPICS)?window.WEBSEC_TOPICS:[];
  const topics=raw.map(([id,title,category,risk,description,signs,checks,defenses])=>({id,title,category,risk,description,signs,checks,defenses}));
  const labels={all:"الكل",Injection:"Injection",Client:"Client-side",Server:"Server-side",Access:"Access Control",Config:"Configuration",API:"API Security"};
  const $=id=>document.getElementById(id),grid=$("atlas-grid"),filters=$("atlas-filters"),search=$("atlas-search");let active="all";
  function el(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
  function riskClass(risk){return risk==="عالي"?"high":"medium";}
  function renderFilters(){filters.replaceChildren();Object.keys(labels).forEach(key=>{const count=key==="all"?topics.length:topics.filter(t=>t.category===key).length;const button=el("button","atlas-filter"+(key===active?" active":""));button.type="button";button.append(el("span","",labels[key]),el("span","",String(count)));button.addEventListener("click",()=>{active=key;renderFilters();render();});filters.append(button);});}
  function render(){const q=search.value.trim().toLowerCase();const visible=topics.filter(t=>(active==="all"||t.category===active)&&(!q||(t.title+" "+t.description+" "+labels[t.category]).toLowerCase().includes(q)));grid.replaceChildren();visible.forEach(topic=>{const card=el("article","atlas-card");const top=el("div","atlas-card-top");top.append(el("span","atlas-category",labels[topic.category]),el("span","risk-badge "+riskClass(topic.risk),topic.risk));const button=el("button","","فتح الشرح");button.type="button";button.addEventListener("click",()=>openTopic(topic));card.append(top,el("h3","",topic.title),el("p","",topic.description),button);grid.append(card);});$("atlas-count").textContent=visible.length+" من "+topics.length+" موضوعًا";}
  function fillList(id,items){const list=$(id);list.replaceChildren();items.forEach(item=>list.append(el("li","",item)));}
  function openTopic(topic){document.querySelector(".atlas-directory").hidden=true;const section=$("atlas-detail-section");section.hidden=false;$("detail-category").textContent=labels[topic.category];$("detail-title").textContent=topic.title;const badge=$("detail-risk");badge.className="risk-badge "+riskClass(topic.risk);badge.textContent="الخطورة: "+topic.risk;$("detail-description").textContent=topic.description;fillList("detail-signs",topic.signs);fillList("detail-checks",topic.checks);fillList("detail-defenses",topic.defenses);history.replaceState(null,"",location.pathname+"#"+topic.id);section.scrollIntoView({behavior:"smooth",block:"start"});}
  $("atlas-back").addEventListener("click",()=>{$("atlas-detail-section").hidden=true;document.querySelector(".atlas-directory").hidden=false;history.replaceState(null,"",location.pathname);document.querySelector(".atlas-directory").scrollIntoView({behavior:"smooth"});});search.addEventListener("input",render);renderFilters();render();
  const initial=location.hash.slice(1),topic=topics.find(item=>item.id===initial);if(topic)openTopic(topic);
})();
