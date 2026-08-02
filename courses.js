"use strict";

(function(){
  const courses=Array.isArray(window.TRAINING_COURSES)?window.TRAINING_COURSES:[];
  const accentMap={orange:"#b7c77a",blue:"#b7c77a",green:"#b7c77a",purple:"#b7c77a"};
  const storageKey="khalid-academy-progress-v1";
  const $=id=>document.getElementById(id);
  let state=loadProgress();
  let activeCourse=null;
  let activeModule=null;

  function loadProgress(){
    try{const value=JSON.parse(localStorage.getItem(storageKey)||"{}");return value&&typeof value==="object"?value:{};}catch{return {};}
  }
  function saveProgress(){
    try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{}
    updateGlobalProgress();
  }
  function courseState(id){
    if(!state[id]||typeof state[id]!=="object")state[id]={completed:[],answers:{}};
    if(!Array.isArray(state[id].completed))state[id].completed=[];
    if(!state[id].answers||typeof state[id].answers!=="object")state[id].answers={};
    return state[id];
  }
  function node(tag,className,text){
    const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;
  }
  function clear(el){while(el.firstChild)el.removeChild(el.firstChild);}
  function validCompleted(course){return courseState(course.id).completed.filter(id=>course.modules.some(module=>module.id===id));}
  function pct(course){return course.modules.length?Math.round(validCompleted(course).length/course.modules.length*100):0;}
  function lessonCount(course){return course.modules.reduce((total,module)=>total+module.lessons.length+(Array.isArray(module.guides)?module.guides.length:0),0);}
  function updateGlobalProgress(){
    const total=courses.reduce((n,c)=>n+c.modules.length,0);
    const done=courses.reduce((n,c)=>n+courseState(c.id).completed.filter(id=>c.modules.some(m=>m.id===id)).length,0);
    const value=total?Math.round(done/total*100):0;
    $("global-progress").textContent=value+"%";$("global-progress-fill").style.width=value+"%";
  }
  function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");window.setTimeout(()=>el.classList.remove("show"),2200);}
  function createCourseNav(){
    const box=$("course-nav");clear(box);
    courses.forEach(course=>{const b=node("button");b.type="button";b.dataset.course=course.id;b.append(node("span","nav-icon",course.code),node("span","",course.arTitle));b.addEventListener("click",()=>go(course.id,course.modules[0]?.id));box.append(b);});
  }
  function renderCatalog(){
    activeCourse=null;activeModule=null;$("catalog-view").hidden=false;$("course-view").hidden=true;$("catalog-nav").classList.add("active");
    document.querySelectorAll("#course-nav button").forEach(b=>b.classList.remove("active"));
    const grid=$("course-grid");clear(grid);
    courses.forEach(course=>{
      const card=node("article","course-card");card.style.setProperty("--accent",accentMap[course.accent]||"#b7c77a");
      const top=node("div","course-top");top.append(node("span","course-badge",course.code),node("span","level-badge",course.level));
      card.append(top,node("h3","",course.arTitle),node("p","",course.description));
      const meta=node("div","card-meta");meta.append(node("span","",course.modules.length+" وحدات"),node("span","",lessonCount(course)+" درسًا وشرحًا"),node("span","",course.subtitle));card.append(meta);
      const progress=node("div","card-progress"),track=node("div","card-progress-track"),fill=node("span"),label=node("small","",pct(course)+"%");fill.style.width=pct(course)+"%";track.append(fill);progress.append(track,label);card.append(progress);
      const action=node("button","course-action",pct(course)?"متابعة الدورة ←":"استعراض الدورة ←");action.type="button";action.addEventListener("click",()=>go(course.id,firstIncomplete(course)));card.append(action);grid.append(card);
    });
    updateGlobalProgress();document.title="الدورات التدريبية — Khalid Tech Hub";window.scrollTo({top:0,behavior:"smooth"});
  }
  function firstIncomplete(course){return course.modules.find(m=>!courseState(course.id).completed.includes(m.id))?.id||course.modules[0]?.id;}
  function go(courseId,moduleId){location.hash=courseId+(moduleId?"/"+moduleId:"");}
  function route(){
    const parts=location.hash.replace(/^#/,"").split("/").filter(Boolean);const course=courses.find(c=>c.id===parts[0]);
    if(!course){renderCatalog();return;}
    const module=course.modules.find(m=>m.id===parts[1])||course.modules[0];renderCourse(course,module);
  }
  function renderCourse(course,module){
    activeCourse=course;activeModule=module;$("catalog-view").hidden=true;$("course-view").hidden=false;$("catalog-nav").classList.remove("active");
    document.querySelectorAll("#course-nav button").forEach(b=>b.classList.toggle("active",b.dataset.course===course.id));
    $("course-code").textContent=course.code;$("course-level").textContent=course.level;$("course-title").textContent=course.arTitle;$("course-description").textContent=course.description;
    const meta=$("course-meta");clear(meta);meta.append(node("span","",course.modules.length+" وحدات"),node("span","",lessonCount(course)+" درسًا وشرحًا"),node("span","",course.subtitle));
    const outcomes=$("course-outcomes");clear(outcomes);course.outcomes.forEach(x=>outcomes.append(node("li","",x)));
    $("course-source").textContent=course.source;const source=$("official-source");if(course.officialUrl){source.href=course.officialUrl;source.hidden=false;}else{source.hidden=true;source.removeAttribute("href");}
    renderModuleList(course,module);renderModule(course,module);updateCourseProgress(course);document.title=module.title+" — "+course.arTitle;
  }
  function updateCourseProgress(course){
    const value=pct(course),done=validCompleted(course).length;$("course-progress").textContent=value+"%";$("course-progress-fill").style.width=value+"%";$("course-progress-label").textContent=done+" من "+course.modules.length+" وحدات مكتملة";updateGlobalProgress();
  }
  function renderModuleList(course,current){
    const box=$("module-list");clear(box);const done=courseState(course.id).completed;
    course.modules.forEach((module,i)=>{const b=node("button","module-nav-button"+(module.id===current.id?" active":"")+(done.includes(module.id)?" completed":""));b.type="button";
      const count=module.lessons.length+(Array.isArray(module.guides)?module.guides.length:0);const check=node("span","module-check",done.includes(module.id)?"✓":String(i+1));const labels=node("span");labels.append(node("strong","",module.title),node("small","",count+" محاور تعليمية"));b.append(check,labels,node("span","","←"));b.addEventListener("click",()=>go(course.id,module.id));box.append(b);});
  }
  function renderModule(course,module){
    const index=course.modules.findIndex(m=>m.id===module.id);$("module-number").textContent="MODULE "+String(index+1).padStart(2,"0");$("module-title").textContent=module.title;$("module-summary").textContent=module.summary;
    const stack=$("lesson-stack");clear(stack);const lessons=module.lessons.concat(Array.isArray(module.guides)?module.guides:[]);lessons.forEach((lesson,i)=>{const card=node("article","lesson-card");card.append(node("span","lesson-index","LESSON "+String(i+1).padStart(2,"0")),node("h3","",lesson.title),node("p","",lesson.body));const list=node("ul","key-points");lesson.points.forEach(point=>list.append(node("li","",point)));card.append(list);stack.append(card);});
    $("module-lab").textContent=module.lab;renderQuiz(course,module);const completed=courseState(course.id).completed.includes(module.id),button=$("complete-module");button.classList.toggle("completed",completed);button.textContent=completed?"الوحدة مكتملة ✓":"تحديد الوحدة كمكتملة ✓";
    $("prev-module").disabled=index===0;$("next-module").disabled=index===course.modules.length-1;$("prev-module").dataset.target=course.modules[index-1]?.id||"";$("next-module").dataset.target=course.modules[index+1]?.id||"";
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function renderQuiz(course,module){
    const quiz=module.quiz,answers=courseState(course.id).answers,selected=Number.isInteger(answers[module.id])?answers[module.id]:null;$("quiz-question").textContent=quiz.question;const box=$("quiz-options");clear(box);
    quiz.choices.forEach((choice,i)=>{const b=node("button","quiz-option",String.fromCharCode(65+i)+". "+choice);b.type="button";if(selected!==null&&i===quiz.answer)b.classList.add("correct");else if(selected!==null&&i===selected)b.classList.add("wrong");b.addEventListener("click",()=>answerQuiz(course,module,i));box.append(b);});
    const feedback=$("quiz-feedback"),status=$("quiz-status");if(selected===null){feedback.hidden=true;feedback.textContent="";status.textContent="";}else{feedback.hidden=false;feedback.textContent=(selected===quiz.answer?"إجابة صحيحة. ":"الإجابة الصحيحة: "+quiz.choices[quiz.answer]+". ")+quiz.explanation;status.textContent=selected===quiz.answer?"أحسنت ✓":"راجع الإجابة";}
  }
  function answerQuiz(course,module,index){courseState(course.id).answers[module.id]=index;saveProgress();renderQuiz(course,module);toast(index===module.quiz.answer?"إجابة صحيحة — أحسنت!":"راجع التفسير وحاول ربطه بالمفهوم.");}
  function toggleComplete(){
    if(!activeCourse||!activeModule)return;const completed=courseState(activeCourse.id).completed,index=completed.indexOf(activeModule.id);if(index>=0)completed.splice(index,1);else completed.push(activeModule.id);saveProgress();renderCourse(activeCourse,activeModule);toast(index>=0?"أزيلت علامة الإكمال.":"تم حفظ تقدمك في هذه الوحدة.");
  }
  function closeMenu(){const side=$("academy-sidebar");side.classList.remove("open");$("menu-button").setAttribute("aria-expanded","false");}
  $("catalog-nav").addEventListener("click",()=>{history.pushState(null,"",location.pathname);renderCatalog();closeMenu();});
  $("back-catalog").addEventListener("click",()=>{history.pushState(null,"",location.pathname);renderCatalog();});
  $("start-first").addEventListener("click",()=>{if(courses[0])go(courses[0].id,firstIncomplete(courses[0]));});
  $("complete-module").addEventListener("click",toggleComplete);
  $("prev-module").addEventListener("click",e=>{if(activeCourse&&e.currentTarget.dataset.target)go(activeCourse.id,e.currentTarget.dataset.target);});
  $("next-module").addEventListener("click",e=>{if(activeCourse&&e.currentTarget.dataset.target)go(activeCourse.id,e.currentTarget.dataset.target);});
  $("menu-button").addEventListener("click",()=>{const side=$("academy-sidebar"),open=side.classList.toggle("open");$("menu-button").setAttribute("aria-expanded",String(open));});
  window.addEventListener("hashchange",()=>{route();closeMenu();});
  createCourseNav();route();
  if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("/sw.js").catch(()=>{});
})();
