"use strict";

window.TRAINING_COURSES.unshift({
  id:"fortigate-74",code:"FGT",accent:"green",title:"FortiGate 7.4",subtitle:"FortiOS Administration & Security",arTitle:"دورة FortiGate 7.4",level:"مبتدئ إلى متقدم",
  description:"مسار عملي متكامل لإدارة FortiGate على FortiOS 7.4، من الإعداد والشبكات والسياسات إلى Security Profiles وSD-WAN وVPN وHA والتشخيص والأتمتة. قد تختلف بعض القوائم حسب الطراز والترخيص والإصدار الفرعي.",
  outcomes:["إعداد FortiGate وتحصين مستوى الإدارة وبناء مخطط واجهات واضح","كتابة سياسات دقيقة وتطبيق NAT وSecurity Profiles وفحص SSL","تشغيل SD-WAN وIPsec VPN والوصول البعيد وZTNA بطريقة قابلة للاختبار","إدارة HA والسجلات والنسخ والتحديثات وتشخيص الجلسات والحزم","تحويل الأعمال المتكررة إلى Runbooks وأتمتة آمنة"],
  modules:[
    {
      id:"fg-01",title:"FortiOS 7.4 والإعداد الآمن",summary:"افهم معمارية FortiGate، ثم جهّز الجهاز بإعداد أولي آمن يمكن نسخه ومراجعته والتراجع عنه.",
      lessons:[
        {title:"معمارية FortiGate ومسارات المعالجة",body:"يفصل FortiGate بين مستوى الإدارة ومستوى التحكم ومعالجة الترافيك. تمر الحزمة عبر التحقق من الجلسة والمسار والسياسة وNAT وملفات الحماية، بينما تدير عمليات النظام الإعداد والتسجيل والمراقبة. فهم هذا الفصل يحدد الأداة الصحيحة عند التشخيص.",points:["Management Plane لإدارة الجهاز","Control Plane يبني معلومات الشبكة","Data Plane يعالج الجلسات","NPU وCP قد تسرعان وظائف مدعومة"]},
        {title:"الإعداد الأولي والوصول الإداري",body:"ابدأ بتغيير بيانات الإدارة، وضبط Hostname وTimezone وNTP وDNS، ثم حدّد واجهة إدارة ومصادر موثوقة للوصول. لا تجعل HTTPS أو SSH متاحًا من كل شبكة، واختبر الوصول من مسار احتياطي قبل تضييق الإدارة.",points:["استخدم حسابًا فرديًا لكل مسؤول","قيد الإدارة بـTrusted Hosts","فعّل HTTPS وSSH عند الحاجة فقط","اضبط NTP قبل تحليل السجلات"]},
        {title:"العمل بين GUI وCLI",body:"الواجهة الرسومية تسهّل القراءة والمهام المتكررة، بينما يكشف CLI الخيارات الكاملة ويسمح بالتحقق الدقيق. استخدم show لعرض الإعداد المخصص وshow full-configuration عند الحاجة، وget وdiagnose لقراءة الحالة دون خلطها مع الإعداد.",points:["config وedit وset لتعديل الإعداد","get يعرض حالة مختصرة","diagnose للتحليل التشغيلي","نفذ التغيير في نطاق واضح"]},
        {title:"النسخ والمراجعات وصلاحيات الإدارة",body:"احفظ نسخة مشفرة قبل التغيير، وسجل إصدار FortiOS والطراز وحالة الترخيص. استخدم Administrator Profiles لتقسيم الصلاحيات، وراجع Audit Log لمعرفة من غيّر ماذا ومتى بدل الاعتماد على حساب admin مشترك.",points:["افصل Read-only عن Read-write","احمِ مفاتيح النسخ الاحتياطية","وثق نقطة الرجوع","راجع الحسابات غير المستخدمة"]}
      ],
      guides:[
        {title:"Baseline آمن قبل الإنتاج",body:"أنشئ قائمة تحقق تشمل الحسابات والخدمات الإدارية وNTP وDNS والتسجيل والنسخ والتراخيص وتحديثات FortiGuard. التقط نسخة من الإعداد وحالة الواجهات والمسارات قبل توصيل شبكات العمل.",points:["غيّر كلمات المرور الافتراضية","أوقف الإدارة من WAN","اختبر إرسال السجلات","وثق Serial والإصدار"]},
        {title:"سير تغيير قابل للتراجع",body:"اكتب الهدف والإعداد السابق والأوامر أو الخطوات والاختبار وشروط التراجع. غيّر متغيرًا واحدًا في كل مرحلة، ثم تحقق من الإدارة والترافيك والسجلات قبل الانتقال للمرحلة التالية.",points:["حدد نافذة التغيير","احفظ Backup حديثًا","اكتب Test cases","جهز أوامر Backout"]},
        {title:"استخدام VDOM بوعي",body:"VDOM يقسم الجهاز إلى جدران حماية منطقية لكل منها واجهات وسياسات ومسارات ومسؤولون. استخدمه عند وجود حاجة فعلية للعزل الإداري أو التشغيلي، مع تخطيط الموارد والروابط بين VDOMs والمراقبة المركزية.",points:["حدد مالك كل VDOM","خطط Inter-VDOM links","راقب استهلاك الموارد","لا تستخدمه لمجرد فصل بسيط"]},
        {title:"ترقية FortiOS 7.4 بأمان",body:"راجع مسار الترقية وملاحظات الإصدار والتوافق مع FortiManager وFortiAnalyzer وFortiClient والتراخيص. خذ Backup، ثم اختبر الإدارة والسياسات والـVPN والتسجيل وHA بعد الإقلاع بدل اعتبار نجاح الترقية دليلًا كافيًا.",points:["اتبع Upgrade Path المعتمد","راجع Known Issues","حدد زمن Rollback","تحقق من الوظائف الحرجة"]}
      ],
      lab:"أنشئ Checklist لإعداد FortiGate جديد: حسابات الإدارة وTrusted Hosts وNTP وDNS والنسخ والتسجيل. أضف اختبار نجاح واختبار فشل لكل عنصر.",
      quiz:{question:"ما أفضل ممارسة للوصول الإداري إلى FortiGate؟",choices:["السماح بـHTTPS من أي مصدر","حساب مشترك لجميع المسؤولين","حسابات فردية مع Trusted Hosts وصلاحيات محددة","تعطيل سجل الإدارة"],answer:2,explanation:"الحسابات الفردية والصلاحيات المحددة والمصادر الموثوقة تقلل سطح الهجوم وتحافظ على قابلية التدقيق."}
    },
    {
      id:"fg-02",title:"الواجهات وVLAN والخدمات الشبكية",summary:"ابنِ طبقة الشبكة المحلية بطريقة منظمة، من الواجهات والعنونة إلى VLAN وZones وDHCP وDNS وحماية الإدارة.",
      lessons:[
        {title:"أنواع الواجهات وحالة الرابط",body:"قد تكون الواجهة Physical أو Aggregate أو Redundant أو Software Switch بحسب التصميم والطراز. راجع Link وSpeed وDuplex والأخطاء وMTU، ولا تفترض أن ظهور الواجهة Up يعني أن المسار أو VLAN أو Gateway صحيح.",points:["ثبت Speed فقط عند الحاجة","راقب Drops وErrors","استخدم LACP للطرفين","وثق وظيفة كل منفذ"]},
        {title:"VLAN وZones",body:"تنشئ VLAN Interface بوابة Layer 3 فوق رابط Trunk، بينما تجمع Zone واجهات ذات سياسة متشابهة لتقليل تكرار القواعد. حافظ على تطابق VLAN ID وNative VLAN وAllowed VLANs مع السويتش، ولا تجمع شبكات مختلفة الثقة في Zone واحدة.",points:["كل VLAN تحتاج Subnet فريدة","اختبر Tagging من الطرفين","Zone تبسط السياسة","افصل الإدارة والضيوف والخوادم"]},
        {title:"DHCP وDNS وخدمات البنية",body:"يمكن لـFortiGate توزيع العناوين والبوابة وDNS وخيارات DHCP أو ترحيل الطلب إلى خادم مركزي. راقب Scope والاستخدام والتعارض، وحدد هل يستخدم العملاء FortiGate كـDNS Forwarder أم خوادم داخلية بحسب الحاجة.",points:["استبعد العناوين الثابتة","حدد Lease مناسبًا","وثق DHCP Options","اختبر Name resolution"]},
        {title:"Administrative Access وLocal-in",body:"الخدمات التي تنتهي على FortiGate مثل HTTPS وSSH وPING وBGP وVPN تعامل كترافيك Local-in، وليست Forward Traffic عاديًا. قيّد Access على الواجهة واستخدم Local-in Policy عند الحاجة للتحكم الأدق.",points:["لا تعتمد على Firewall Policy للإدارة","حدد البروتوكولات لكل واجهة","قيد مصادر SNMP","راقب محاولات الإدارة"]}
      ],
      guides:[
        {title:"مخطط عنونة قابل للتوسع",body:"اربط كل شبكة باسم ووظيفة وVLAN وSubnet وGateway وDHCP وZone ومالك. اترك مجالًا للنمو ولا تكرر الشبكات بين الفروع أو المختبرات إذا كانت ستتصل لاحقًا.",points:["استخدم Naming ثابتًا","تجنب Subnet overlap","وثق العناوين المحجوزة","اربط الشبكة بسياساتها"]},
        {title:"تحصين مستوى الإدارة",body:"خصص شبكة إدارة أو Out-of-band عند الإمكان، واسمح بالوصول من Jump Host أو شبكة موثوقة فقط. استخدم شهادة صحيحة وSNMPv3 وSyslog خارجيًا، وراقب تغير الإعداد ومحاولات الدخول.",points:["لا تدِر الجهاز من شبكة الضيوف","أوقف HTTP وTelnet","استخدم MFA للمسؤولين","أرسل Audit logs خارجيًا"]},
        {title:"تشخيص ARP وVLAN",body:"ابدأ من Link وحالة Trunk، ثم تحقق من عنوان الواجهة وARP وMAC Table وPacket Sniffer. إذا وصل ARP ولم تعد الإجابة فراجع VLAN والواجهة والعنوان؛ وإذا لم يصل فابدأ بالسويتش والمسار الفيزيائي.",points:["حدد نقطة فقد الحزمة","قارن VLAN tag","راجع Duplicate IP","التقط ARP من الطرفين"]},
        {title:"فصل شبكة الضيوف وIoT",body:"ضع الضيوف وIoT في واجهات أو VLANs مستقلة مع وصول محدود للإنترنت والخدمات المطلوبة. امنع الإدارة والوصول الجانبي، وطبّق DNS وWeb Security وسجل المحاولات المرفوضة لاكتشاف السلوك غير المعتاد.",points:["امنع East-West غير الضروري","استخدم DHCP منفصلًا","حدد Bandwidth عند الحاجة","اختبر العزل فعليًا"]}
      ],
      lab:"صمم ثلاث شبكات: Users وServers وGuest. حدّد VLAN وSubnet وZone وDHCP والخدمات الإدارية المسموحة، ثم اكتب اختبارات تثبت أن Guest لا يصل للإدارة أو الخوادم.",
      quiz:{question:"ما الذي تتحكم به Local-in Policy؟",choices:["الترافيك العابر بين واجهتين فقط","الترافيك المتجه إلى FortiGate نفسه","ملفات المستخدم المحلية","توزيع جلسات الخوادم"],answer:1,explanation:"Local-in Policy تتحكم في الخدمات والاتصالات التي تنتهي على FortiGate نفسه."}
    },
    {
      id:"fg-03",title:"Routing وSD-WAN",summary:"افهم قرار المسار أولًا، ثم استخدم SD-WAN لتوجيه التطبيقات ومراقبة جودة الروابط والتحول بينها بصورة قابلة للقياس.",
      lessons:[
        {title:"قراءة Routing Table",body:"يختار FortiGate المسار الأكثر تحديدًا، ثم يقارن Administrative Distance وPriority عند تساوي Prefix. اعرف مصدر كل Route وحالة Gateway والواجهة، وتذكر أن وجود المسار لا يثبت سماح السياسة أو عودة الترافيك.",points:["Longest Prefix Match أولًا","Distance تفضل مصدر المسار","Priority تفاضل مسارات متساوية","تحقق من المسار العائد"]},
        {title:"Static Route وPolicy Route",body:"Static Route يوجه حسب الوجهة، بينما Policy Route قد يضيف المصدر والخدمة والواجهة إلى القرار. استخدم Policy Route لحاجة محددة ووثقه جيدًا لأنه قد يتجاوز التوقع المبني على جدول التوجيه.",points:["حدد Gateway أو Device صحيحًا","تجنب المسارات المتداخلة بلا سبب","راجع Policy Route قبل الجدول","اختبر من مصدر حقيقي"]},
        {title:"SD-WAN Members وZones",body:"يجمع SD-WAN الروابط كأعضاء داخل Zone تستخدمها السياسات والمسارات. افصل Underlay عنOverlay، وحدد تكلفة وسعة ودور كل رابط، ولا تضع أعضاء غير متكافئين في قاعدة واحدة دون منطق واضح.",points:["استخدم SD-WAN Zone في السياسات","وثق نوع كل Member","راقب Bandwidth الفعلي","خطط لحالة فشل جميع الروابط"]},
        {title:"Performance SLA وSD-WAN Rules",body:"يقيس Performance SLA عناصر مثل Latency وJitter وPacket Loss باستخدام أهداف مناسبة، ثم تختار القاعدة أفضل رابط بحسب الاستراتيجية. الهدف يجب أن يمثل الخدمة لا أن يكون عنوانًا قريبًا يعطي نتيجة مضللة.",points:["استخدم أكثر من Health Check عند الحاجة","حدد Threshold من Baseline","رتب القواعد من المحدد إلى العام","اختبر Recovery بعد الفشل"]}
      ],
      guides:[
        {title:"تصميم Dual-WAN عملي",body:"حدد رابطًا أساسيًا واحتياطيًا أو وزع التطبيقات حسب حساسيتها. أعطِ الصوت أولوية للاستقرار، والتصفح أفضل جودة متاحة، والنسخ رابطًا أقل تكلفة، مع قاعدة Default واضحة عند عدم المطابقة.",points:["صنف التطبيقات","حدد SLA لكل فئة","وثق سلوك Failback","راقب استهلاك كل رابط"]},
        {title:"تشخيص SD-WAN خطوة بخطوة",body:"تحقق من حالة Member وHealth Check ونتيجة SLA والقاعدة المطابقة والمسار والسياسة والجلسة. قد تبقى جلسة قديمة على رابط سابق، لذلك قارن Session جديدة قبل حذف الجلسات عشوائيًا.",points:["ابدأ بحالة SLA","راجع Rule match","افحص Session route","قارن قبل وبعد الفشل"]},
        {title:"OSPF وBGP ضمن التصميم",body:"تستخدم البروتوكولات الديناميكية عندما يصعب الحفاظ على Static Routes أو تحتاج تبادلًا تلقائيًا مع الفروع والمزود. خطط Neighbor وNetworks وFilters وRedistribution، وامنع تسريب Default أو Routes غير مطلوبة.",points:["حدد مصدر Route","استخدم Prefix filtering","راقب Neighbor state","اختبر الانسحاب والتعافي"]},
        {title:"اختبار Failover حقيقي",body:"لا تكتفِ بفصل كابل ونجاح Ping. شغّل مكالمة أو تنزيلًا وDNS وتطبيقًا حساسًا، وسجل زمن الاكتشاف والتحول وفقد الحزم وعودة الرابط، ثم قارن النتائج بالـSLA المطلوب.",points:["اختبر أكثر من تطبيق","قِس زمن التحول","تحقق من NAT العام","راجع السجلات والجلسات"]}
      ],
      lab:"صمم SD-WAN برابطي إنترنت. أنشئ SLA للصوت وRule للتصفح وأخرى للنسخ، ثم اكتب سيناريو فشل يقيس التحول والعودة وجودة كل تطبيق.",
      quiz:{question:"ما الذي يجب أن يمثله هدف Performance SLA؟",choices:["أي عنوان قريب فقط","الخدمة أو المسار الذي تريد قياس جودته فعليًا","عنوان FortiGate الداخلي دائمًا","MAC Address للسويتش"],answer:1,explanation:"الهدف الصحيح يعطي قياسًا حقيقيًا لجودة الخدمة أو المسار الذي تعتمد عليه القاعدة."}
    },
    {
      id:"fg-04",title:"Firewall Policy وNAT",summary:"حوّل تدفقات العمل إلى سياسات دقيقة، وافهم ترتيب المطابقة والجلسات وSource NAT وVIP قبل نشر الخدمات.",
      lessons:[
        {title:"منطق مطابقة Firewall Policy",body:"تطابق السياسة الواجهة الداخلة والخارجة والمصدر والوجهة والخدمة والجدول والهوية عند استخدامها. تُفحص القواعد من الأعلى للأسفل، وأول تطابق يحدد الإجراء والـNAT والملفات والتسجيل.",points:["رتب المحدد قبل العام","استخدم أسماء واضحة","سجل Allowed وDenied المهم","راجع Implicit Deny"]},
        {title:"Address وService Objects",body:"استخدم Objects بدل كتابة IP ومنافذ مبهمة داخل القواعد، واجمع المتشابه في Groups دون توسيع زائد. حافظ على أسماء تعكس البيئة والوظيفة، وحدّث الكائن بدل تعديل قواعد متعددة عند تغير الخدمة.",points:["تجنب نطاقات أكبر من الحاجة","وثق مالك الكائن","راجع Objects غير المستخدمة","استخدم FQDN بحذر"]},
        {title:"Source NAT وIP Pools",body:"يستخدم Interface NAT عنوان الواجهة الخارجة، بينما يحدد IP Pool عنوانًا أو Range مختلفًا وقد يستخدم Overload. راقب Port exhaustion وتأكد أن المسار العائد يعود عبر FortiGate حتى تبقى الجلسة متناظرة.",points:["حدد هل NAT مطلوب أصلًا","وثق العنوان العام","راقب الجلسات والمنافذ","اختبر أكثر من مصدر"]},
        {title:"VIP وDestination NAT",body:"يربط Virtual IP عنوانًا خارجيًا بعنوان داخلي وقد يترجم المنفذ. تحتاج سياسة من الواجهة الخارجية إلى الداخلية بوجهة VIP، مع Security Profiles وتسجيل وحماية الخادم بدل نشر Any Service بلا قيود.",points:["قيد Source عند الإمكان","استخدم Port Forwarding للخدمة المطلوبة","راجع Hairpin NAT","اختبر من خارج الشبكة"]}
      ],
      guides:[
        {title:"Policy Mode وCentral NAT",body:"يؤثر نمط NAT في مكان تعريف الترجمة وطريقة قراءته. قبل تفعيل Central NAT راجع أثره على السياسات الحالية وVIPs وعمليات التشغيل، واستخدم نمطًا واحدًا مفهومًا للفريق بدل خلط التصاميم.",points:["افهم النمط الحالي","وثق قواعد Central SNAT","اختبر DNAT وSNAT","جهز Rollback"]},
        {title:"تنظيف Policy Package",body:"راجع Hit Count وآخر استخدام والسجلات والمالك لتحديد القواعد القديمة أو المتداخلة. ضيّق Any وAll تدريجيًا، وعطّل القاعدة خلال نافذة مراقبة قبل الحذف مع نسخة وتذكرة تغيير.",points:["ابحث عن Shadowing","راجع الخدمات الواسعة","أزل الاستثناءات المنتهية","احتفظ بسبب العمل"]},
        {title:"التسجيل وImplicit Deny",body:"Log at Session End يعطي الحجم والمدة والسبب، بينما Log at Session Start يفيد حالات محددة لكنه يزيد الحجم. راقب Implicit Deny لتحديد تدفق ناقص دون فتح قاعدة واسعة لمجرد إزالة الرسائل.",points:["اضبط NTP","حدد Retention","أرسل السجلات مركزيًا","استخدم Filters دقيقة"]},
        {title:"تشخيص Session وسياسة",body:"ابدأ بالواجهات وعناوين المصدر والوجهة والمنفذ والوقت، ثم افحص Route وPolicy lookup وSession وNAT وForward Traffic Log. استخدم Debug Flow بفلتر ضيق، وأوقفه فور جمع الدليل.",points:["اكتب 5-Tuple","تحقق من Policy ID","راجع NAT translation","لا تحذف كل الجلسات"]}
      ],
      lab:"اكتب سياسة نشر HTTPS لخادم داخلي باستخدام VIP، وسياسة خروج لمجموعة مستخدمين عبر IP Pool. حدّد Objects والتسجيل والملفات واختبارات السماح والرفض.",
      quiz:{question:"عند مطابقة أكثر من Firewall Policy، أي قاعدة تُطبّق؟",choices:["آخر قاعدة في القائمة","أول قاعدة مطابقة من الأعلى","القاعدة ذات الاسم الأقصر","كل القواعد معًا"],answer:1,explanation:"FortiGate يفحص القواعد بالترتيب ويطبق أول قاعدة تطابق شروط الجلسة."}
    },
    {
      id:"fg-05",title:"Security Profiles وSSL Inspection",summary:"طبّق الحماية متعددة الطبقات على السياسات، واضبط الفحص والتواقيع والاستثناءات بناءً على أدلة لا على التخمين.",
      lessons:[
        {title:"Profile-based Security",body:"تربط Security Profiles بسياسة السماح لفحص الترافيك المسموح. تشمل Antivirus وIPS وWeb Filter وDNS Filter وApplication Control وغيرها، ويمكن جمعها في Profile Group لتوحيد الحماية حسب نوع المستخدم أو الخادم.",points:["السماح لا يعني الثقة بالمحتوى","اربط الملف بنوع الأصل","سجل نتيجة الفحص","راجع الترخيص والتحديثات"]},
        {title:"Antivirus وIPS",body:"يفحص Antivirus الملفات والبروتوكولات المدعومة، بينما يكشف IPS محاولات استغلال وسلوكيات شبكة معروفة. ابدأ بالحماية الموصى بها، ثم راجع Severity وAction وFalse Positives قبل استثناء ضيق موثق.",points:["حدّث FortiGuard","راجع Top signatures","تحقق من الأصل المستهدف","لا تعطل Sensor كاملًا"]},
        {title:"Web Filter وDNS Filter",body:"يصنف Web Filter الطلبات والمواقع، بينما يتعامل DNS Filter مع أسماء النطاقات والاستعلامات مبكرًا. استخدم فئات مناسبة للعمل، وحظرًا مخصصًا ضيقًا، وراجع Newly Registered أو Malicious Domains دون تعطيل مواقع مشتركة سليمة.",points:["حدد سياسة Acceptable Use","استخدم Safe Search عند الحاجة","راجع Override","اربط DNS بالعميل"]},
        {title:"Application Control",body:"يتعرف Application Control على التطبيقات وسلوكها حتى عند استخدام منافذ شائعة. افصل التطبيقات المعتمدة عن غير المعتمدة، واستخدم Monitor أولًا عند عدم وضوح الأثر، ثم امنع أو قيّد وفق حاجة العمل.",points:["المنفذ لا يثبت التطبيق","راجع Unknown Applications","حدد Risk وCategory","اختبر التطبيق الحقيقي"]}
      ],
      guides:[
        {title:"Certificate وDeep Inspection",body:"Certificate Inspection يقرأ بيانات TLS الظاهرة، بينما Deep Inspection يفك الاتصال ويعيد تشفيره بشهادة يثق بها العميل. طبّقه حيث يسمح التصميم والسياسة، ووزع CA بأمان مع استثناءات للخدمات الحساسة أو غير المتوافقة.",points:["احمِ مفتاح CA","اختبر Trust على الأجهزة","راقب TLS errors","وثق الاستثناءات"]},
        {title:"تصميم Profile Groups",body:"أنشئ Baseline للمستخدمين وآخر للخوادم وثالث للضيوف بدل ملف واحد للجميع. سمِّ المجموعة حسب الغرض والإصدار، واختبر أي تغيير على مجموعة محدودة قبل تعميمه.",points:["افصل User عنServer profiles","استخدم Version naming","وثق الاستثناءات","راقب الأثر بعد التغيير"]},
        {title:"توليف الحماية وتقليل الضوضاء",body:"صنف الأحداث حسب الشدة والثقة والأصل والتكرار، وحدد هل التنبيه منع هجومًا أم طابق حركة مشروعة. عدّل Signature أو Threshold أو Exception ضيقًا مع مدة مراجعة بدل تعطيل الحماية كاملة.",points:["اجمع PCAP عند الحاجة","قارن بسجل التطبيق","حدد مالك الاستثناء","راجع False positives دوريًا"]},
        {title:"اختبار ملفات الحماية",body:"استخدم عينات آمنة وخدمات اختبار معروفة ومحاكاة غير ضارة لإثبات أن كل Profile يسجل ويمنع كما هو متوقع. اختبر أيضًا موقعًا أو تطبيقًا مشروعًا للتأكد من عدم كسر العمل.",points:["اختبر Positive وNegative","احفظ Log evidence","تحقق من Action الحقيقي","أعد الاختبار بعد التحديث"]}
      ],
      lab:"صمم Profile Group للمستخدمين يتضمن AV وIPS وWeb وDNS وApplication Control وSSL Inspection. اكتب اختبار تهديد آمن واختبار تطبيق مشروع لكل ملف.",
      quiz:{question:"لماذا يحتاج Deep SSL Inspection إلى شهادة CA موثوقة على العميل؟",choices:["لزيادة سرعة DHCP","لأن FortiGate يعيد إنشاء اتصال TLS للعميل بعد الفحص","لتغيير عنوان IP","لتشغيل OSPF"],answer:1,explanation:"الفحص العميق يعمل كوسيط TLS، لذلك يجب أن يثق العميل في الشهادة التي يستخدمها FortiGate لإعادة التشفير."}
    },
    {
      id:"fg-06",title:"الهوية والمصادقة والإدارة",summary:"اربط السياسة بالمستخدم والمجموعة، وأمّن حسابات الإدارة والخدمات الخارجية وMFA مع مسار تشخيص واضح.",
      lessons:[
        {title:"Administrator Profiles وTrusted Hosts",body:"يفصل Administrator Profile مهام المراقبة عن تعديل السياسات وإدارة المستخدمين. اربط كل مسؤول بحساب فردي، وقيّد المصادر بـTrusted Hosts، واستخدم MFA وحساب Break-glass محميًا ومراقبًا.",points:["Least Privilege للإدارة","لا تشارك admin","راجع Login failures","دوّر حساب الطوارئ"]},
        {title:"Local وLDAP وRADIUS",body:"يمكن للمصادقة الاعتماد على مستخدمين محليين أو LDAP أو RADIUS. حدّد Server وBind أو Secret ومجموعة الاختبار، واختبر الوصول من FortiGate قبل ربط الخدمة بسياسة إنتاجية.",points:["استخدم اتصالًا مشفرًا","قيد Service account","اختبر Group membership","راقب Timeout"]},
        {title:"FSSO وربط IP بالمستخدم",body:"يجمع FSSO أحداث تسجيل الدخول ويربط عنوان IP بالمستخدم والمجموعة لتستخدمها السياسات. دقة الوقت وCollectors ومصادر الأحداث والجلسات المشتركة تؤثر في النتيجة، لذلك لا تعتمد على Mapping قديم دون تحقق.",points:["اضبط NTP للجميع","راقب Collector status","راجع Workstation checks","اختبر تغيير المستخدم"]},
        {title:"MFA وشهادات المستخدم",body:"يضيف MFA عاملًا ثانيًا للحسابات الحساسة والوصول البعيد والإدارة. خطط لتسجيل Token والاستعادة وفقد الجهاز، واستخدم شهادات العميل عندما تحتاج هوية جهاز قوية ضمن ZTNA أو VPN.",points:["فعّل MFA للإدارة أولًا","احمِ عملية Enrollment","حدد Recovery process","ألغِ Token عند المغادرة"]}
      ],
      guides:[
        {title:"بناء سياسة مبنية على المجموعة",body:"اربط مجموعة أعمال محددة بتطبيقات ووجهات وخدمات مطلوبة بدل سياسة لجميع المستخدمين. ضع سياسة فشل واضحة عندما لا توجد هوية، وسجل Username وGroup في الأحداث.",points:["حدد Owner للمجموعة","اختبر مستخدمًا صحيحًا وخاطئًا","قلل Fallback access","راجع العضوية دوريًا"]},
        {title:"تشخيص المصادقة",body:"تحقق من الوصول إلى الخادم وDNS وNTP والشهادة وBind أو Secret، ثم اختبر User وGroup ونتيجة المصادقة. افصل فشل الاتصال عن رفض كلمة المرور وعن عدم تطابق المجموعة.",points:["اختبر من FortiGate","راجع Authentication logs","تحقق من Base DN","راقب Latency وTimeout"]},
        {title:"حماية Secrets وحسابات الخدمة",body:"استخدم حساب خدمة محدودًا للقراءة وبصلاحية واضحة، واحفظ Secrets خارج المستندات العامة ودوّرها وفق سياسة. عند تغيير Secret اختبر كل Integrations المرتبطة وخطط لتداخل آمن أثناء الانتقال.",points:["لا تستخدم Domain Admin","حدد مالكًا للحساب","راقب استخدامه","وثق تاريخ التدوير"]},
        {title:"مراجعة وصول ربع سنوية",body:"استخرج المسؤولين والمستخدمين والمجموعات وTokens وTrusted Hosts، وراجع الحاجة والمالك وآخر استخدام والصلاحيات. أغلق الحسابات الراكدة والاستثناءات المنتهية، واحتفظ بدليل الموافقة.",points:["راجع الحسابات المحلية","تحقق من MFA","اختبر Break-glass","أغلق Orphan accounts"]}
      ],
      lab:"ارسم تدفق مصادقة مستخدم عبر LDAP مع MFA وسياسة مبنية على Group. أضف حالات فشل DNS وBind وGroup وToken وحدد السجل الذي يثبت كل حالة.",
      quiz:{question:"ما الخطر الأكبر في استخدام حساب Administrator مشترك؟",choices:["زيادة سرعة الجهاز","فقدان قابلية نسبة التغيير لشخص محدد","تحسين التسجيل","تقليل سطح الهجوم"],answer:1,explanation:"الحساب المشترك يضعف التدقيق والمساءلة ويصعّب معرفة من نفذ التغيير."}
    },
    {
      id:"fg-07",title:"IPsec VPN",summary:"ابنِ أنفاق Site-to-Site وRemote Access آمنة، وافهم IKE وPhase 2 والتوجيه والسياسات والتشخيص بدل الاعتماد على Wizard فقط.",
      lessons:[
        {title:"IKE وPhase 1",body:"تفاوض Phase 1 على الهوية وخوارزميات التشفير والتكامل وDH Group والعمر وطريقة المصادقة، وينشئ قناة IKE آمنة. يجب أن تتوافق المقترحات والطرفان والـPSK أو الشهادات مع قابلية الوصول بين العناوين العامة.",points:["IKEv2 مفضل عند الدعم","احمِ Pre-shared Key","طابق Proposals","راجع NAT Traversal"]},
        {title:"Phase 2 وSelectors",body:"يحدد Phase 2 خوارزميات IPsec وPFS والعمر والشبكات أو Selectors المحمية. اختلاف Subnets أو الاتجاه أو PFS قد يسمح بقيام IKE بينما يفشل تمرير الترافيك.",points:["طابق Local وRemote subnets","استخدم PFS عند التصميم","راجع Rekey","حدد أكثر من Phase 2 عند الحاجة"]},
        {title:"Route-based VPN والسياسات",body:"ينشئ Route-based VPN واجهة منطقية تدخل في Routing وFirewall Policies وSD-WAN. تحتاج Route للوجهة وسياسة في الاتجاه المطلوب، وقد تحتاج NAT معطلًا أو محددًا حسب السيناريو.",points:["أضف Interface للـZone عند الحاجة","تحقق من Route","أنشئ Policies للاتجاهات","راجع NAT"]},
        {title:"Dial-up وRemote Gateway",body:"يستخدم Dial-up عندما لا يملك الطرف البعيد عنوانًا ثابتًا أو عند وصول مستخدمين متعددين. صمم Peer ID وGroups وAddress Pools وSplit Routing وMFA بحيث لا يصبح الاتصال البعيد مدخلًا واسعًا للشبكة.",points:["قيد المستخدمين بالمجموعة","استخدم MFA","حدد Routes المطلوبة فقط","سجل Login وTraffic"]}
      ],
      guides:[
        {title:"التوجيه فوق النفق",body:"اختر Static أو Dynamic Routing بحسب عدد المواقع والتغير، وتأكد من عدم تداخل الشبكات. راقب أن المسار العائد يمر بالنفق نفسه، واستخدم Blackhole Route مناسبًا لمنع تسريب الوجهة للإنترنت عند سقوط النفق.",points:["تجنب Overlap","تحقق من Return route","راجع Distance","وثق Summaries"]},
        {title:"VPN مع SD-WAN والازدواجية",body:"يمكن وضع واجهات IPsec كأعضاء SD-WAN وتقييمها بـSLA، مع أنفاق متعددة عبر مزودين مختلفين. خطط لعناوين المراقبة ومسارات Underlay ومنع Recursion، واختبر فشل Tunnel ورابط كامل.",points:["افصل Underlay عنOverlay","راقب SLA عبر النفق","رتب Rules","اختبر Failback"]},
        {title:"تشخيص IKE وIPsec",body:"تحقق من الوصول إلى Peer وUDP 500/4500، ثم حالة Phase 1 وPhase 2 وSelectors وRouting وPolicy وCounters. استخدم IKE Debug بفلتر Peer، واحذف SA المحددة فقط عند الحاجة.",points:["حدد Peer قبل Debug","قارن Proposals","راجع Error message","أوقف Debug بعد الجمع"]},
        {title:"تحصين الأنفاق",body:"استخدم خوارزميات قوية وIKEv2 وشهادات أو PSK طويلًا مختلفًا لكل شريك، وقيّد الشبكات والسياسات والمراقبة. راجع الحسابات والأنفاق القديمة، وحدد موعد انتهاء للاستثناءات المؤقتة.",points:["لا تعِد استخدام PSK","قلل Selectors","فعّل DPD","راجع Crypto دوريًا"]}
      ],
      lab:"صمم Site-to-Site Route-based بين موقعين بإنترنت مزدوج. حدّد Phase 1 وPhase 2 والواجهات والمسارات والسياسات وSLA، ثم اكتب Runbook لتشخيص فشل النفق.",
      quiz:{question:"قام Phase 1 لكن لا يمر Traffic. ما الذي تفحصه أولًا بعد ذلك؟",choices:["لون الواجهة","Phase 2 Selectors والمسار والسياسة","اسم Hostname فقط","خادم DHCP للضيوف"],answer:1,explanation:"قيام IKE لا يثبت توافق Phase 2 أو وجود Route وFirewall Policy تسمح بالترافيك."}
    },
    {
      id:"fg-08",title:"SSL VPN وZTNA",summary:"شغّل الوصول البعيد بأقل صلاحية، وافهم الفرق بين بوابة VPN التقليدية والوصول المقيّد بالتطبيق والسياق عبر ZTNA.",
      lessons:[
        {title:"مكونات SSL VPN",body:"يتكون SSL VPN من Listening interface وCertificate وPort ومصادقة وPortal وAddress Pool وسياسات. قد يقدم Web Mode لتطبيقات محددة أو Tunnel Mode عبر FortiClient بحسب الإصدار والتصميم.",points:["استخدم شهادة عامة صحيحة","قيد Source geographies عند الحاجة","فعّل MFA","غيّر الإعدادات الافتراضية غير اللازمة"]},
        {title:"Portals وSplit Tunneling",body:"يحدد Portal ما يصل إليه المستخدم وهل يمر كل الترافيك أو شبكات محددة عبر النفق. Split Tunneling يقلل الحمل لكنه يحتاج Routes وDNS وحماية Endpoint واضحة، بينما Full Tunnel يزيد التحكم واستهلاك البوابة.",points:["اربط Portal بالمجموعة","حدد Internal DNS","قلل Routes","اختبر تسريب DNS"]},
        {title:"السياسات والعنونة",body:"يستلم العميل عنوانًا من Pool ثم يحتاج سياسة من واجهة SSL VPN إلى الشبكة المطلوبة مع المستخدم أو المجموعة. راقب تعارض Pool مع الشبكات المحلية للعميل، وأضف مسار العودة أو NAT حسب تصميم الشبكة الداخلية.",points:["استخدم Pool فريدًا","قيد الوجهات والخدمات","اختبر Return route","سجل المستخدم والترافيك"]},
        {title:"مفهوم ZTNA",body:"يربط ZTNA الوصول بهوية المستخدم وحالة الجهاز وTag وخادم تطبيق محدد عبر Access Proxy بدل منح وصول شبكي واسع. يحتاج FortiClient EMS وشهادات وTags وسياسات متناسقة حسب التصميم والترخيص.",points:["الوصول للتطبيق لا للشبكة كاملة","تحقق من Device posture","استخدم Certificates","راقب تغير Tags"]}
      ],
      guides:[
        {title:"تشخيص وصول المستخدم البعيد",body:"ابدأ بالشهادة وDNS والمنفذ والوصول للبوابة، ثم نتيجة المصادقة والPortal والعنوان والسياسة والمسار وDNS الداخلي. افصل فشل Login عن قيام النفق دون وصول للتطبيق.",points:["راجع SSL VPN events","تحقق من Assigned IP","اختبر DNS وRoute","قارن مستخدمًا آخر"]},
        {title:"الشهادة وDNS وتجربة المستخدم",body:"استخدم FQDN ثابتًا وشهادة بسلسلة كاملة، وتأكد من تطابق الاسم والوصول الخارجي وتحديثات FortiClient. الرسائل التحذيرية المتكررة تدفع المستخدم لتجاهل مخاطر حقيقية وتزيد تذاكر الدعم.",points:["راقب انتهاء الشهادة","اختبر من خارج المؤسسة","وثق Client versions","انشر تعليمات مختصرة"]},
        {title:"تقليل سطح الوصول البعيد",body:"لا تعرض بوابة أوسع من الحاجة. استخدم MFA ومجموعات دقيقة وGeo/IP restrictions وسياسات محدودة، وأغلق الحسابات القديمة وراقب محاولات Password spraying والجلسات غير المعتادة.",points:["راجع المستخدمين دوريًا","حدد Session timeout","امنع الإدارة عبر النفق إلا لحاجة","أنشئ Alert للفشل المتكرر"]},
        {title:"خطة انتقال نحو ZTNA",body:"احصر التطبيقات والمستخدمين واعتماديات DNS والشهادات وحالة الأجهزة، ثم ابدأ بتطبيق واحد ومجموعة صغيرة. قارن تجربة المستخدم والسجلات وحالة الفشل قبل تقليل الوصول الشبكي التقليدي.",points:["ابدأ Pilot محدودًا","حدد Posture requirements","وثق Fallback","قِس نجاح الوصول"]}
      ],
      lab:"صمم وصولًا بعيدًا لموظفي الدعم إلى تطبيقين فقط. قارن SSL VPN Split Tunnel مع ZTNA، وحدد الهوية وMFA والجهاز والسياسات والسجلات واختبارات الفشل.",
      quiz:{question:"ما الفرق الجوهري في هدف ZTNA؟",choices:["منح المستخدم وصولًا كاملًا للشبكة","منح وصول مقيد لتطبيق محدد حسب الهوية والسياق","إلغاء المصادقة","استبدال DNS بخادم DHCP"],answer:1,explanation:"ZTNA يركز على الوصول الدقيق للتطبيق بناءً على الهوية وحالة الجهاز والسياق بدل الثقة الشبكية الواسعة."}
    },
    {
      id:"fg-09",title:"HA والسجلات والإدارة المركزية",summary:"حافظ على استمرارية الخدمة وقابلية التحقيق عبر HA مضبوط، وتسجيل موثوق، ونسخ وإدارة مركزية مدروسة.",
      lessons:[
        {title:"مفاهيم FortiGate HA",body:"يوفر FGCP أنماط Active-Passive وActive-Active حسب الحاجة والدعم. يعتمد اختيار Primary على إعدادات مثل Override وPriority وUptime وعوامل أخرى، لذلك يجب فهم Election بدل توقع جهاز ثابت دائمًا.",points:["طابق الطراز والإصدار والتراخيص","استخدم Heartbeat links مخصصة","حدد Group ID وPassword","راقب Cluster state"]},
        {title:"Synchronization وSession Pickup",body:"تتزامن إعدادات كثيرة بين أعضاء Cluster، بينما تحتاج الجلسات إلى Session Pickup وتقنيات مناسبة لتقليل الانقطاع. ليست كل الجلسات والبروتوكولات متساوية، لذلك اختبر التطبيقات الحساسة أثناء Failover.",points:["راجع Sync status","فعّل Session pickup حسب الحاجة","راقب Heartbeat errors","اختبر TCP وUDP"]},
        {title:"أنواع السجلات وForwarding",body:"تشمل السجلات Traffic وEvent وSecurity وVPN وSystem وغيرها. أرسلها إلى FortiAnalyzer أو Syslog/SIEM، واضبط Severity وStorage وRetention حتى لا تضيع الأحداث المهمة أو تمتلئ السعة بضوضاء غير مفيدة.",points:["اضبط NTP","سجل Policy ID والمستخدم","راقب فقد السجلات","حدد Retention حسب الحاجة"]},
        {title:"FortiManager وFortiAnalyzer",body:"يدير FortiManager السياسات والإعدادات والأجهزة مركزيًا، بينما يجمع FortiAnalyzer السجلات والتحليلات والتقارير. خطط ADOM والإصدارات وWorkflow وInstall Preview، وراجع الفرق قبل دفع Policy Package.",points:["طابق ADOM version","استخدم Revision history","راجع Install preview","اختبر وصول السجلات"]}
      ],
      guides:[
        {title:"اختبار Failover منظم",body:"حدد Primary والحالة المتوقعة، ثم اختبر فقد Heartbeat أو WAN أو الجهاز ضمن نافذة تغيير. قِس زمن التحول والجلسات المتأثرة وتزامن الإعداد وعودة الجهاز دون خلق Split Brain.",points:["ابدأ بنسخة حديثة","راقب Cluster events","اختبر التطبيقات الحرجة","وثق Failback"]},
        {title:"تشخيص HA غير متزامن",body:"قارن Checksum وحالة الأعضاء والإصدار والوقت وHeartbeat وموارد النظام. لا تجبر Synchronization قبل معرفة أي عضو يملك الإعداد الصحيح، واحفظ Backup من الطرفين.",points:["حدد المصدر الصحيح","راجع Out-of-sync objects","تحقق من Link errors","لا تفصل العقدتين عشوائيًا"]},
        {title:"سياسة Logging وRetention",body:"حدد ما يجب تسجيله وأين ومدة الاحتفاظ ومن يراجعه. اجمع Traffic End وSecurity Events وAdmin Audit وVPN وSystem، واربط التنبيهات بحالات استخدام قابلة للتنفيذ بدل تخزين بلا مراقبة.",points:["حدد Use cases","راقب Storage","اختبر Parser في SIEM","احمِ سلامة السجلات"]},
        {title:"Backup وDisaster Recovery",body:"احتفظ بنسخ مشفرة خارج الجهاز مع Firmware version وخريطة الواجهات والتراخيص والشهادات وخطوات الاستعادة. اختبر Restore في مختبر أو جهاز بديل، وحدد أسرارًا يجب إدخالها بأمان بعد الاستعادة.",points:["حدد RPO وRTO","اختبر النسخة","احفظ Certificates بأمان","وثق Dependencies"]}
      ],
      lab:"اكتب خطة HA Active-Passive تشمل Heartbeat وElection وSession Pickup والتسجيل. أضف اختبار Failover وFailback وحالة Out-of-sync وخطوات استعادة من Backup.",
      quiz:{question:"قبل فرض مزامنة HA عند ظهور Out-of-sync، ماذا تفعل؟",choices:["تعيد تشغيل العقدتين فورًا","تحدد أي عضو يملك الإعداد الصحيح وتحفظ نسخة من الطرفين","تحذف جميع السياسات","توقف التسجيل"],answer:1,explanation:"فرض المزامنة من مصدر خاطئ قد يستبدل إعدادًا سليمًا؛ يجب تحديد المصدر وحفظ النسخ أولًا."}
    },
    {
      id:"fg-10",title:"التشخيص والأتمتة والتشغيل",summary:"حوّل استكشاف الأعطال والتغييرات إلى عمليات قابلة للتكرار باستخدام الأدلة وCLI وPacket Capture وAutomation وAPI.",
      lessons:[
        {title:"Debug Flow وPacket Sniffer",body:"يعرض Debug Flow قرارات المسار والسياسة وNAT والإسقاط، بينما يثبت Sniffer ما وصل وما خرج على الواجهات. استخدم Filters ضيقة وعدد حزم محدودًا، وتجنب Debug واسعًا على جهاز مزدحم.",points:["حدد Source وDestination","استخدم Verbosity مناسبًا","قارن Ingress وEgress","أوقف Debug دائمًا"]},
        {title:"Session Table وCounters",body:"توضح Session Table السياسة والمسار وNAT والحالة وOffload، بينما تكشف Counters سبب إسقاط أو ضغط محدد. افحص جلسة واحدة مرتبطة بالاختبار بدل حذف جدول الجلسات كاملًا وفقد الدليل.",points:["اكتب 5-Tuple","راجع Policy ID","تحقق من NPU offload","قارن Bytes في الاتجاهين"]},
        {title:"Automation Stitches",body:"يربط Automation Stitch Trigger مثل Event أو Schedule بإجراء مثل Email أو Webhook أو CLI Script. ابدأ بإشعار أو جمع دليل قبل تنفيذ إجراء مؤثر، وامنع Loop وراقب نجاح الأتمتة وفشلها.",points:["حدد Trigger دقيقًا","ابدأ Read-only","احمِ Webhook secret","اختبر Rate limit"]},
        {title:"REST API وCLI Scripting",body:"استخدم حساب خدمة محدودًا وToken محميًا وHTTPS، واقرأ الحالة قبل وبعد التعديل. اجعل السكربت Idempotent، وتحقق من HTTP status والنتيجة، ولا تطبع Secrets في Logs أو Pipeline.",points:["قيد مصدر API","استخدم أقل صلاحية","تحقق من النتيجة","جهز Rollback"]}
      ],
      guides:[
        {title:"Runbook لحادث اتصال",body:"ابدأ بالسؤال والوقت والمصدر والوجهة، ثم افحص Link وAddress وARP وRoute وPolicy وNAT وSession وSecurity Profile وعودة الترافيك. سجل نتيجة كل طبقة بدل القفز إلى إعادة التشغيل.",points:["احفظ Timeline","غيّر متغيرًا واحدًا","اجمع Log وPCAP","حدد Root cause"]},
        {title:"Performance وConserve Mode",body:"راقب CPU وMemory وSessions وThroughput وDisk وTop processes. عند Conserve Mode احمِ الخدمة واجمع الأدلة وحدد سبب الذاكرة أو الجلسات أو Log pressure بدل الاكتفاء بإعادة التشغيل المؤقت.",points:["راجع Memory states","حدد Top consumers","راقب Session growth","افتح حالة دعم عند الحاجة"]},
        {title:"تحقق ما بعد التحديث",body:"بعد تحديث Firmware أو Policy اختبر الإدارة والتوجيه وSD-WAN وNAT وVPN وSecurity Profiles وHA والتسجيل والتطبيقات الحرجة. قارن Metrics والسجلات بالـBaseline وحدد نافذة مراقبة قبل إغلاق التغيير.",points:["استخدم Test matrix","قارن Config revisions","راقب Errors","احتفظ بخطة الرجوع"]},
        {title:"مشروع تخرج FortiGate 7.4",body:"صمم فرعًا متكاملًا بواجهات وVLANs وSD-WAN وسياسات وNAT وProfiles وهوية وVPN وLogging وBackup. أضف رسمًا وجدول تدفقات واختبارات وفشلًا متعمدًا وRunbook يعيد الخدمة.",points:["ابدأ بالمتطلبات","اكتب Security policy matrix","اختبر Failover","سلّم As-built واضحًا"]}
      ],
      lab:"نفذ مشروعًا ورقيًا كاملًا لفرع FortiGate 7.4: مخطط، Address plan، SD-WAN، Policies، NAT، Profiles، VPN، Logging، HA وخمس حالات اختبار مع Rollback.",
      quiz:{question:"ما الاستخدام الأنسب لـDebug Flow؟",choices:["عرض شكل الواجهة","تتبع قرار FortiGate للحزمة عبر المسار والسياسة وNAT والإسقاط","إنشاء مستخدمين تلقائيًا","تحديث FortiGuard"],answer:1,explanation:"Debug Flow يوضح كيف عالج FortiGate الحزمة وأي Route أو Policy أو NAT أو سبب إسقاط طُبق."}
    }
  ]
});
