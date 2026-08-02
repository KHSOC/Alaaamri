"use strict";

(function(){
  const labs=[
    {id:"phishing",code:"LAB-01",level:"مبتدئ",title:"تحقيق رسالة Phishing",summary:"حلل رسالة تزعم أنها من خدمة Microsoft 365 وحدد المؤشرات ونطاق التأثر والإجراء الأول.",tags:["Email","Identity","IOC"],evidence:[
      ["Envelope","From: security@micros0ft-alert.example\nReply-To: reset@external-mail.example"],
      ["Authentication","SPF: fail | DKIM: none | DMARC: fail"],
      ["URL","https://login-m365-check.example/session"],
      ["Identity log","المستخدم فتح الرابط، ثم ظهر Login failed من عنوان جديد بعد دقيقتين"]
    ],tasks:["قارن From وReply-To والنطاق الحقيقي.","راجع SPF وDKIM وDMARC ولا تعتمد على اسم العرض.","ابحث عن مستلمين آخرين ونقرات على الرابط.","اربط وقت النقر بسجلات الهوية والجهاز."],question:"ما الإجراء الأول الأكثر توازنًا بعد تأكيد النقر وظهور محاولة دخول مشبوهة؟",choices:["حذف الرسالة فقط","تعطيل الحساب مؤقتًا، إبطال الجلسات، حظر المؤشر، ثم تحديد النطاق","إعادة تشغيل جهاز المستخدم","نشر عنوان البريد في الإنترنت"],answer:1,explanation:"الاحتواء يجب أن يحمي الهوية والجلسات ويمنع المؤشر، ثم يستمر التحقيق لتحديد المستلمين والأجهزة المتأثرة."},
    {id:"bruteforce",code:"LAB-02",level:"متوسط",title:"محاولات دخول ثم نجاح",summary:"ميّز بين خطأ مستخدم وهجوم Password Spraying بعد نجاح تسجيل دخول لحساب حساس.",tags:["Authentication","SIEM","Risk"],evidence:[
      ["SIEM","42 حسابًا، محاولة واحدة لكل حساب خلال 18 دقيقة من IP واحد"],
      ["Success","نجاح للحساب svc-reports بعد 4 دقائق من آخر فشل"],
      ["Geo","المصدر من دولة لم تستخدمها المؤسسة سابقًا"],
      ["Account","الحساب لا يملك MFA وكلمة مروره لم تتغير منذ 420 يومًا"]
    ],tasks:["افحص نمط المحاولات عبر الحسابات لا عدد الفشل لحساب واحد.","حدد صلاحيات الحساب واستخدامه الطبيعي.","راجع ما حدث بعد تسجيل الدخول الناجح.","ابحث عن نفس المصدر أوUser-Agent في خدمات أخرى."],question:"أي وصف يطابق النمط بصورة أفضل؟",choices:["Brute force على حساب واحد","Password spraying منخفض السرعة","تعطل DNS","فحص منافذ داخلي"],answer:1,explanation:"محاولة عدد قليل من كلمات المرور عبر حسابات كثيرة لتجنب Lockout هي سمة Password Spraying."},
    {id:"dns",code:"LAB-03",level:"متوسط",title:"DNS Beaconing مشبوه",summary:"حلل نمط DNS دوريًا من جهاز موظف وحدد هل هو تحديث مشروع أم قناة تحكم محتملة.",tags:["DNS","Network","Beaconing"],evidence:[
      ["DNS log","استعلام كل 60 ثانية تقريبًا إلى sync-node.example"],
      ["Domain age","تم تسجيل النطاق قبل 3 أيام"],
      ["Endpoint","العملية: C:\\Users\\Public\\update-check.exe"],
      ["Flow","ردود صغيرة واتصال TLS قصير بعد كل استعلام"]
    ],tasks:["قِس دورية الاتصال والانحراف بين الفواصل.","اربط Domain بالعملية وParent process.","قارن السلوك مع أجهزة أخرى وبرامج معتمدة.","اجمع Hash وSigner ومسار الملف قبل الحجر."],question:"ما الدليل الذي يرفع الثقة أكثر بأن السلوك ضار؟",choices:["استخدام DNS وحده","دورية الاتصال فقط","ملف غير موقّع في Public مع Parent مشبوه واتصال بنطاق حديث","صغر حجم الرد"],answer:2,explanation:"تجميع سياق العملية والمسار والتوقيع وعمر النطاق يعطي دليلًا أقوى من مؤشر منفرد قد يكون مشروعًا."},
    {id:"powershell",code:"LAB-04",level:"متقدم",title:"PowerShell وتنفيذ مشفر",summary:"ابنِ خطًا زمنيًا لتنفيذ PowerShell بعد ملف Office وحدد النطاق والاحتواء المناسب.",tags:["Endpoint","PowerShell","ATT&CK"],evidence:[
      ["Process tree","WINWORD.EXE → powershell.exe -enc ... → rundll32.exe"],
      ["Network","powershell.exe اتصل بعنوان خارجي على 443"],
      ["Persistence","إنشاء Scheduled Task باسم UpdateTelemetry"],
      ["Identity","محاولة وصول SMB إلى جهازين باستخدام حساب المستخدم"]
    ],tasks:["رتب Process وNetwork وPersistence وLateral Movement زمنيًا.","افك ترميز الأمر في بيئة تحليل آمنة دون تنفيذه.","ابحث عن اسم المهمة والـHash والعنوان على بقية الأجهزة.","حدد الأدلة التي يجب حفظها قبل العزل."],question:"ما خطة الاحتواء الأنسب؟",choices:["حذف Scheduled Task فقط","عزل الجهاز، تعطيل الجلسات المتأثرة، حفظ الأدلة، والبحث عن المؤشرات على النطاق","حظر PowerShell في المؤسسة فورًا بلا اختبار","انتظار تنبيه ثانٍ"],answer:1,explanation:"الخطة تعالج الجهاز والهوية والنطاق وتحافظ على الأدلة، بدل إزالة مؤشر واحد وترك بقية السلسلة."}
  ];
  const $=id=>document.getElementById(id),grid=$("lab-grid"),workspace=$("workspace");
  let saved=[];try{saved=JSON.parse(localStorage.getItem("khalid-security-labs-v1")||"[]");}catch{saved=[];}const completed=new Set(Array.isArray(saved)?saved:[]);
  function el(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
  function renderCards(){grid.replaceChildren();labs.forEach(lab=>{const card=el("article","lab-card"+(completed.has(lab.id)?" completed":""));const top=el("div","lab-card-top");top.append(el("span","lab-code",lab.code),el("span","lab-level",lab.level));const tags=el("div","lab-tags");lab.tags.forEach(tag=>tags.append(el("span","",tag)));const button=el("button","",completed.has(lab.id)?"إعادة المختبر":"ابدأ المختبر");button.type="button";button.addEventListener("click",()=>openLab(lab));card.append(top,el("h3","",lab.title),el("p","",lab.summary),tags,button);grid.append(card);});}
  function openLab(lab){$("labs").hidden=true;workspace.hidden=false;$("lab-code").textContent=lab.code+" · "+lab.level;$("lab-title").textContent=lab.title;$("lab-summary").textContent=lab.summary;const evidence=$("evidence-list");evidence.replaceChildren();lab.evidence.forEach(([name,value])=>{const item=el("div","evidence-item");item.append(el("strong","",name),el("code","",value));evidence.append(item);});const tasks=$("task-list");tasks.replaceChildren();lab.tasks.forEach(task=>tasks.append(el("li","",task)));$("lab-question").textContent=lab.question;const options=$("decision-options"),feedback=$("decision-feedback");options.replaceChildren();feedback.hidden=true;feedback.textContent="";lab.choices.forEach((choice,index)=>{const button=el("button","",String.fromCharCode(65+index)+". "+choice);button.type="button";button.addEventListener("click",()=>{options.querySelectorAll("button").forEach((b,i)=>{b.disabled=true;if(i===lab.answer)b.classList.add("correct");else if(i===index)b.classList.add("wrong");});feedback.hidden=false;feedback.textContent=(index===lab.answer?"إجابة صحيحة. ":"راجع القرار. ")+lab.explanation;if(index===lab.answer){completed.add(lab.id);localStorage.setItem("khalid-security-labs-v1",JSON.stringify([...completed]));}});options.append(button);});workspace.scrollIntoView({behavior:"smooth",block:"start"});}
  $("lab-back").addEventListener("click",()=>{workspace.hidden=true;$("labs").hidden=false;renderCards();$("labs").scrollIntoView({behavior:"smooth"});});renderCards();
})();
