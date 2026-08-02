"use strict";

window.TRAINING_COURSES = [
  {
    id:"palo-alto",
    code:"PAN",
    accent:"orange",
    title:"Palo Alto Networks",
    subtitle:"Cybersecurity & Network Foundations",
    arTitle:"دورة Palo Alto Networks",
    level:"مبتدئ إلى متوسط",

    description:"مسار تأسيسي يجمع الأمن السيبراني، الشبكات، التوجيه وNAT، ثم يربطها عمليًا بمفاهيم PAN-OS وNGFW وThreat Prevention.",
    outcomes:["فهم Zero Trust وAAA وCIA وإدارة المخاطر","إتقان أساسيات OSI وTCP/IP وSubnetting وRouting وNAT","ربط App-ID وContent-ID وUser-ID بالسياسات الأمنية","اتباع منهجية واضحة في المراقبة والتشخيص"],
    modules:[
      {
        id:"pa-01",title:"الأسس الأمنية وZero Trust",summary:"ابدأ باللغة المشتركة للأمن: الهوية والثقة والأصول والمخاطر، ثم حوّل المبادئ إلى قرارات وصول قابلة للقياس.",
        lessons:[
          {title:"AAA وCIA Triad",body:"AAA يحدد من أنت، وما المسموح لك به، وكيف تُسجّل أفعالك. أما CIA فيقيس حماية سرية البيانات وسلامتها وتوافرها. الجمع بين الإطارين يمنع تصميم سياسة تركّز على المنع وتنسى التتبع أو استمرارية الخدمة.",points:["Authentication يثبت الهوية، Authorization يمنح أقل صلاحية، Accounting يسجل النشاط","Confidentiality تمنع الكشف غير المصرح، Integrity تمنع التغيير، Availability تحافظ على الخدمة","قد تتعارض الضوابط؛ التشفير القوي مثلًا يجب ألا يعطل التوافر"]},
          {title:"مبادئ Zero Trust",body:"Zero Trust ليس منتجًا واحدًا؛ هو طريقة تصميم تفترض أن الموقع داخل الشبكة لا يساوي الثقة. القرار يعتمد على الهوية والجهاز والسياق وحساسية المورد، ويعاد تقييمه باستمرار.",points:["تحقق مستمر بدل الثقة الدائمة","Least Privilege يقلل أثر الحساب المخترق","Assume Breach يدفعك للتقسيم والمراقبة"]}
        ],
        lab:"ارسم وصول موظف إلى تطبيق مالي: حدّد PEP، مصدر الهوية، شرط الجهاز، أقل صلاحية، والسجل المطلوب للاكتشاف.",
        quiz:{question:"أي مبدأ يمنع منح حساب صحيح وصولًا أوسع من حاجته؟",choices:["Availability","Least Privilege","Non-repudiation","Load Balancing"],answer:1,explanation:"Least Privilege يمنح الحد الأدنى الضروري من الصلاحيات والوقت والنطاق."}
      },
      {
        id:"pa-02",title:"التهديدات ودورة الهجوم",summary:"تعلّم قراءة الهجوم كسلسلة مراحل بدل حدث منفصل، وربط الأدلة بالتكتيكات والتقنيات المناسبة.",
        lessons:[
          {title:"Threat Actors وAPT",body:"تختلف الجهات في الدافع والقدرة: مجرم مالي، جهة حكومية، ناشط، تهديد داخلي أو مجموعة Ransomware. APT يعني حملة طويلة وموجّهة تحافظ على الوصول وتقلل الظهور، وليس نوع Malware محددًا.",points:["الدافع يوجّه اختيار الهدف والأسلوب","Insider Threat قد يكون متعمدًا أو نتيجة إهمال","C2 قناة تحكم وليست بالضرورة عنوانًا واحدًا ثابتًا"]},
          {title:"MITRE ATT&CK ودورة الهجوم",body:"يساعد ATT&CK على وصف سلوك الخصم بتكتيكات وتقنيات مشتركة. استخدمه لتحويل Log أو Alert إلى فرضية تحقيق، ثم ابحث عن سلوك سابق ولاحق بدل إغلاق التنبيه منفردًا.",points:["Initial Access يختلف عن Execution وPersistence","IOC دليل ملاحظ؛ TTP يصف السلوك الأكثر ثباتًا","الدفاع القوي يضع نقاط كشف ومنع في أكثر من مرحلة"]}
        ],
        lab:"اختر حادث Phishing افتراضيًا واربط مساره بخمس مراحل: الدخول، التنفيذ، الثبات، الوصول للبيانات، والإخراج.",
        quiz:{question:"ما الفائدة الأهم من MITRE ATT&CK داخل SOC؟",choices:["تحديد سعر الفايروول","توحيد وصف سلوك المهاجم وربط الكشف بالمراحل","استبدال جميع السجلات","تشفير قواعد البيانات"],answer:1,explanation:"ATT&CK يوفر لغة موحدة لربط السلوك والأدلة والتغطية الدفاعية."}
      },
      {
        id:"pa-03",title:"نماذج الشبكات والترافيك",summary:"راجع OSI وTCP/IP وPDU ودورة TCP، ثم افهم لماذا يعمل NGFW عبر الطبقات وليس على رقم المنفذ فقط.",
        lessons:[
          {title:"OSI وTCP/IP",body:"OSI يقسم الاتصال إلى سبع طبقات للتشخيص، بينما TCP/IP هو النموذج العملي. عند تحليل مشكلة ابدأ من Physical ثم IP وRouting، وبعدها TCP/UDP، وأخيرًا التطبيق.",points:["Frame في Layer 2، Packet في Layer 3، Segment في Layer 4","IP يحدد الوجهة المنطقية وMAC يسلّم داخل الشبكة المحلية","Layer 7 يكشف التطبيق الحقيقي ومحتواه"]},
          {title:"TCP وUDP وStateful Inspection",body:"TCP يبني جلسة عبر SYN وSYN-ACK وACK ويتتبع الحالة، بينما UDP يرسل بلا مصافحة ويعتمد على Timeout. الفايروول Stateful يسمح للعودة المرتبطة بجلسة معروفة ويرفض التدفق غير المتوقع.",points:["FIN إغلاق منظم وRST قطع فوري","الـ Port ينتمي لطبقة النقل ولا يثبت هوية التطبيق","Timeout غير مناسب قد يقطع جلسات UDP أو يهدر الموارد"]}
        ],
        lab:"حلّل اتصال HTTPS على الورق: DNS ثم ARP/Gateway ثم TCP Handshake ثم TLS ثم HTTP، واكتب نقطة الفشل المحتملة في كل مرحلة.",
        quiz:{question:"ما اسم وحدة البيانات في Network Layer؟",choices:["Frame","Packet","Segment","Bits"],answer:1,explanation:"Layer 3 تتعامل مع Packets وعناوين IP والتوجيه."}
      },
      {
        id:"pa-04",title:"IP وRouting وNAT",summary:"ابنِ أساسًا صلبًا في العنونة واختيار المسار وترجمة العناوين، مع التركيز على ترتيب المعالجة في PAN-OS.",
        lessons:[
          {title:"Subnetting وVirtual Router",body:"قناع الشبكة يحدد المحلي والبعيد وعدد العناوين القابلة للاستخدام. داخل PAN-OS يحتفظ Virtual Router بجدول التوجيه ويختار المسار باستخدام Prefix الأكثر تحديدًا ثم المقاييس المناسبة.",points:["Longest Prefix Match يسبق المسار الأقل تحديدًا","Static Route بسيط؛ OSPF مناسب داخل المؤسسة؛ BGP للسياسات والمسارات الواسعة","PBF يغيّر مسار حركة محددة وفق سياسة"]},
          {title:"Source وDestination NAT",body:"Source NAT يغيّر عنوان المصدر للعودة الصحيحة أو الإنترنت، وDestination NAT ينشر خدمة داخلية. NAT لا يساوي Security Policy؛ يجب السماح بالترافيك بشكل مستقل وبناء السياسة على Zones والعناوين وفق ترتيب PAN-OS.",points:["Dynamic IP and Port هو النمط الشائع للخروج","U-Turn NAT يخدم عميلًا داخليًا يستخدم العنوان العام","التشخيص يتطلب مقارنة Pre-NAT وPost-NAT والمسار العائد"]}
        ],
        lab:"صمّم نشر خادم Web داخلي: اكتب Original Packet وTranslated Packet وSource/Destination Zones ثم سياسة السماح.",
        quiz:{question:"أي قاعدة يطبقها الراوتر أولًا عند وجود عدة مسارات؟",choices:["أقدم Route","Longest Prefix Match","أعلى رقم Interface","المسار الأبجدي"],answer:1,explanation:"المسار الأكثر تحديدًا للوجهة يفوز قبل المفاضلات اللاحقة."}
      },
      {
        id:"pa-05",title:"LAN وWAN وSD-WAN وتدفق الترافيك",summary:"ميّز حدود الشبكة ومساراتها، وافهم لماذا يحتاج East-West إلى تقسيم ومراقبة مثل North-South.",
        lessons:[
          {title:"LAN وVLAN وWAN",body:"VLAN تنشئ Broadcast Domain منطقيًا مستقلًا، والتوجيه يربط الشبكات. WAN يربط المواقع عبر مزود أو إنترنت، بينما SD-WAN يقيس المسارات ويختارها حسب التطبيق والجودة والسياسة.",points:["VLAN ليست جدارًا أمنيًا وحدها؛ تحتاج سياسات بينية","SD-WAN يراقب Latency وJitter وLoss","التصميم يراعي المسار العائد والتماثل عند الأجهزة Stateful"]},
          {title:"North-South وEast-West",body:"North-South يعبر حدود المؤسسة وغالبًا يمر ببوابة الإنترنت. East-West يتحرك بين الأنظمة الداخلية وقد يسمح للمهاجم بالحركة الجانبية، لذلك Micro-segmentation مهم لخفض نطاق الاختراق.",points:["DMZ تفصل الخدمات المنشورة عن الشبكة الداخلية","Zone Design يجب أن يعكس الثقة والوظيفة لا الموقع فقط","تسجيل التدفقات الداخلية مهم لاكتشاف Lateral Movement"]}
        ],
        lab:"قسّم بيئة من Users وServers وGuest وManagement إلى Zones، ثم اكتب خمسة تدفقات مسموحة فقط.",
        quiz:{question:"ما الهدف الأساسي من Micro-segmentation؟",choices:["زيادة Broadcast","تقليل الحركة الجانبية ونطاق الاختراق","إلغاء الحاجة للهوية","تغيير عناوين DNS"],answer:1,explanation:"التقسيم الدقيق يحد من الانتقال بين الموارد عند اختراق جزء من البيئة."}
      },
      {
        id:"pa-06",title:"معمارية NGFW والسياسات",summary:"اربط App-ID وUser-ID وContent-ID بسياسة مبنية على التطبيق والهوية والمحتوى بدل الاعتماد على Ports.",
        lessons:[
          {title:"App-ID وUser-ID",body:"App-ID يتعرف على التطبيق عبر التواقيع وفك التشفير والسلوك حتى لو غيّر المنفذ. User-ID يربط IP بهوية مستخدم أو مجموعة لتصبح السياسة أقرب إلى احتياج العمل.",points:["Application-default يقلل تشغيل التطبيق على منافذ غير متوقعة","User-ID يحتاج مصادر Mapping دقيقة ومحمية","السياسة الجيدة تبدأ بتطبيقات محددة ومستخدمين محددين"]},
          {title:"Content-ID وSecurity Profiles",body:"بعد السماح بالتطبيق، يفحص Content-ID الملفات والتهديدات والبيانات. Security Profiles تضيف Antivirus وAnti-Spyware وVulnerability Protection وURL Filtering وFile Blocking وWildFire.",points:["Allow بلا Profiles يمرر التهديدات داخل التطبيق المسموح","Profile Group يوحّد حزمة الحماية","Decryption ضروري لرؤية محتوى HTTPS مع استثناءات محسوبة"]}
        ],
        lab:"حوّل قاعدة واسعة تسمح tcp/443 من Users إلى Internet إلى سياسة App-ID وتطبيقات مسموحة وProfiles وتسجيل عند نهاية الجلسة.",
        quiz:{question:"لماذا لا يكفي السماح بالمنفذ 443؟",choices:["لأن HTTPS لا يستخدم TCP","لأن تطبيقات متعددة وتهديدات قد تعمل داخله","لأن DNS يستخدمه دائمًا","لأن App-ID يعمل فقط على Layer 2"],answer:1,explanation:"رقم المنفذ لا يحدد التطبيق أو سلامة المحتوى داخل الاتصال المشفر."}
      },
      {
        id:"pa-07",title:"Threat Prevention وDNS Security",summary:"اختر طبقات الحماية المناسبة للتهديد واقرأ السجل الذي يثبت المنع أو الكشف.",
        lessons:[
          {title:"محركات الحماية",body:"Antivirus يستهدف البرمجيات المعروفة، Anti-Spyware يتعامل مع C2 والتجسس، Vulnerability Protection يمنع الاستغلال، وWildFire يحلل الملفات غير المعروفة ويحوّل النتيجة إلى حماية قابلة للتوزيع.",points:["التحديثات والتواقيع تحتاج مراقبة صلاحيتها","Reset وBlock قرارات مختلفة حسب الخطر والسياق","أفضل تحقق يربط Threat Log بالتطبيق والمستخدم والقاعدة"]},
          {title:"DNS Security وSinkholing",body:"DNS قد يحمل C2 أو DGA أو Tunneling. DNS Security يصنّف النطاقات والأنماط، وSinkhole يعيد عنوانًا مراقبًا ليكشف الجهاز الداخلي الذي حاول الاتصال بدل الاكتفاء بمنع الرد.",points:["الـ Sinkhole يسهّل تحديد الجهاز المصاب","DGA يولد أسماء كثيرة متغيرة","DNS Tunneling يظهر في طول وتكرار واستثنائية الاستعلامات"]}
        ],
        lab:"ابنِ جدول تحقق من ثلاثة أعمدة: Threat، Security Profile، Log المطلوب. أضف Malware وC2 وExploit وPhishing وUnknown File.",
        quiz:{question:"ما ميزة DNS Sinkholing الأهم؟",choices:["زيادة سرعة DNS","تحديد العميل الداخلي الذي حاول الوصول لنطاق ضار","استبدال DHCP","إنشاء VPN"],answer:1,explanation:"العنوان المعاد توجيهه يسمح بملاحظة اتصال الجهاز المصاب وتحديد مصدره."}
      },
      {
        id:"pa-08",title:"هجمات الشبكة والحماية",summary:"اربط Spoofing وDoS وتهديدات Layer 2 وRouting بالضابط الأنسب وطريقة التحقق.",
        lessons:[
          {title:"Zone Protection وDoS Protection",body:"Zone Protection يحمي Zone من Scans وFloods وتشوهات البروتوكول، بينما DoS Policy يستطيع حماية هدف محدد وبمعدلات أدق. يجب بناء الحدود من Baseline واقعي لا من أرقام عشوائية.",points:["SYN Flood يختلف عن Port Scan في النمط والضبط","Threshold منخفض يسبب حجبًا ذاتيًا","Packet Buffer وSession Table جزء من تحليل الضغط"]},
          {title:"uRPF وRouting Security",body:"uRPF يتحقق من منطقية عنوان المصدر بالنسبة لجدول التوجيه ويحد من IP Spoofing. حماية OSPF وBGP تحتاج مصادقة وفلترة وحدودًا واضحة لإعلانات المسارات.",points:["Strict uRPF قد يتأثر بالمسارات غير المتماثلة","BGP Prefix Filter يقلل Route Leak/Hijack","أمن Layer 2 يبدأ في السويتش مثل DHCP Snooping وDAI"]}
        ],
        lab:"صمّم استجابة لارتفاع SYN: حدّد Baseline، Zone Protection، DoS Rule للهدف، والـLogs والمقاييس التي تثبت نجاح الضبط.",
        quiz:{question:"ما الخطر عند ضبط Threshold منخفض جدًا؟",choices:["تحسين الأداء دائمًا","حجب مستخدمين شرعيين وخلق DoS ذاتي","إلغاء السجلات","تجاوز NAT"],answer:1,explanation:"الحدود يجب أن تبنى على قياس الحمل الطبيعي والذروة حتى لا تمنع الترافيك المشروع."}
      },
      {
        id:"pa-09",title:"Logging وCLI والتشخيص",summary:"اتبع مسار Packet من المصدر إلى الوجهة واقرأ Traffic وThreat وSystem Logs بدل التخمين.",
        lessons:[
          {title:"منهجية Bottom-Up",body:"ابدأ بالرابط والعنوان، ثم ARP وRoute، وبعدها Policy وNAT وSession، ثم التطبيق وSecurity Profiles. غيّر متغيرًا واحدًا وسجّل النتيجة حتى تعزل السبب الجذري.",points:["Traffic Log يوضح Rule وApplication وAction وSession End Reason","Session Browser يثبت المرور اللحظي","Packet Capture بمراحل PAN-OS يفصل receive وfirewall وtransmit وdrop"]},
          {title:"CLI والتحقق",body:"استخدم أوامر العرض والاختبار للتأكد من Route وPolicy وNAT وSession بدل تعديل الإعداد مباشرة. افصل مشكلة Control Plane عن Data Plane وراقب الموارد عند الضغط.",points:["اختبر المطابقة قبل Commit عندما تتوفر أداة test","Commit ناجح لا يعني أن المنطق صحيح","الوقت وNTP أساسيان لربط الأحداث بين الأنظمة"]}
        ],
        lab:"اكتب Runbook لمستخدم لا يصل للإنترنت: Interface، IP/Gateway، ARP، Route، Policy، NAT، Session، DNS، Threat Log.",
        quiz:{question:"أي منهج أفضل عند التشخيص؟",choices:["تغيير عدة إعدادات دفعة واحدة","عزل المرحلة وتغيير متغير واحد وقياس النتيجة","إعادة تشغيل الجهاز أولًا دائمًا","حذف السياسات"],answer:1,explanation:"المنهج المتدرج يحافظ على الدليل ويصل للسبب الجذري بأقل تأثير."}
      },
      {
        id:"pa-10",title:"مشروع ختامي ومراجعة",summary:"اجمع الشبكات والسياسات والحماية والسجلات في تصميم واحد قابل للشرح والاختبار.",
        lessons:[
          {title:"تصميم فرع آمن",body:"التصميم المقترح يفصل Users وServers وGuest وManagement، يستخدم Virtual Router واضحًا وNAT مضبوطًا، ويقصر التطبيقات حسب الحاجة مع Profiles وتسجيل مركزي.",points:["ابدأ بتدفقات العمل المطلوبة قبل كتابة Rules","استخدم Naming وTags ووصفًا واضحًا","ضع خطة Backup وRollback وValidation لكل تغيير"]},
          {title:"خريطة المراجعة",body:"راجع العلاقة: هوية وسياق → Zone وRoute → Policy وApp-ID → Content Inspection → Log وتحقيق. إذا استطعت شرح رحلة Packet كاملة وتشخيص نقطة توقفها فقد حققت هدف الدورة.",points:["راجع الفرق بين Detection وPrevention","اربط كل تهديد بضابط وسجل","تدرّب على سيناريوهات لا حفظ المصطلحات فقط"]}
        ],
        lab:"أنشئ مخططًا وورقة اختبار لفرع صغير: VLANs وZones وRoutes وNAT وخمس سياسات وProfile Group وLog Forwarding، ثم أضف سيناريو عطل واحد.",
        quiz:{question:"ما أول مدخل لتصميم سياسة جيدة؟",choices:["أي منافذ متاحة","تدفقات العمل المطلوبة والأصول والهوية","لون الواجهة","عدد السجلات القديمة"],answer:1,explanation:"السياسة تبدأ من احتياج العمل والمخاطر، ثم تتحول إلى تطبيقات وهوية واتجاهات وضوابط."}
      }
    ]
  },
  {
    id:"f5-big-ip",code:"F5",accent:"cyan",title:"F5 BIG-IP 17.1.x",subtitle:"From Foundations to Application Delivery",arTitle:"دورة F5 BIG-IP",level:"مبتدئ إلى متقدم",
    description:"مسار عملي لفهم Full Proxy وTMOS وLTM، إدارة SSL والـHA، ثم BIG-IP DNS وAdvanced WAF وAPM وAFM والأتمتة والتشخيص.",
    outcomes:["تصميم Virtual Server وPool وMonitor صحيح","اختيار Load Balancing وPersistence وSNAT حسب التطبيق","فهم SSL Offload وHA وDNS وWAF وAPM وAFM","استخدام TMSH وLogs وtcpdump بمنهجية تشخيص"],
    modules:[
      {id:"f5-01",title:"ADC وFull Proxy وTMOS",summary:"افهم مكان BIG-IP في مسار التطبيق ولماذا يبني اتصالين مستقلين بدل تمرير Packet فقط.",lessons:[
        {title:"من Load Balancer إلى ADC",body:"Application Delivery Controller يوزع الحمل لكنه أيضًا يراقب الصحة ويحسّن TCP وينهي TLS ويطبق سياسات Layer 7. وجوده بين العميل والخوادم يصنع نقطة تحكم موحدة للتوافر والأداء والحماية.",points:["VIP هو نقطة الدخول المنطقية وليس عنوان خادم حقيقي","Pool يجمع الوجهات وMonitor يقرر صلاحيتها","ADC الجيد يوازن بين الأداء والأمان والتوافر"]},
        {title:"Full Proxy وTMM",body:"BIG-IP ينهي اتصال العميل ثم ينشئ اتصالًا مستقلًا للخادم. TMM يعالج Data Plane بسرعة، بينما MCPD وبقية خدمات Control Plane تدير الإعداد والحالة. هذا الفصل يسمح بتحسين كل جهة وتطبيق سياسات عميقة.",points:["Client-side وServer-side لهما TCP/SSL Profiles مستقلة","Connection Table يربط طرفي التدفق","عطل Control Plane لا يعني دائمًا توقف الترافيك القائم"]}
      ],lab:"ارسم Client → Virtual Server → Pool Member، وحدد الاتصالين ومكان TLS Offload وSNAT.",quiz:{question:"ما السمة الأساسية لـ Full Proxy؟",choices:["اتصال واحد يمر كما هو","اتصالان مستقلان: Client-side وServer-side","عدم وجود Session Table","العمل على Layer 2 فقط"],answer:1,explanation:"BIG-IP ينهي جانب العميل وينشئ جانبًا مستقلًا نحو الخادم."}},
      {id:"f5-02",title:"الإعداد الأولي وNetwork Objects",summary:"ابنِ الأساس: Management وVLAN وSelf IP وRoute وPartition قبل إنشاء خدمة LTM.",lessons:[
        {title:"Management وData Plane",body:"عنوان Management مخصص للإدارة ولا ينبغي استخدامه كترافيك تطبيق. VLAN وSelf IP يربطان TMM بالشبكات، وPort Lockdown يحدد خدمات النظام المتاحة على Self IP.",points:["افصل مسار الإدارة عن مسار البيانات","Self IP ثابت وFloating Self IP ينتقل مع Traffic Group","Port Lockdown يجب أن يسمح فقط بما تحتاجه"]},
        {title:"Routes وRoute Domains وPartitions",body:"Routes تحدد المسار العائد، وRoute Domain يعزل جداول عناوين يمكن أن تتكرر، بينما Partition يعزل كائنات الإعداد والصلاحيات. الخلط بينها يسبب تصميم Multi-tenancy ضعيفًا.",points:["Wrong Mask أو Missing Route يظهر كترافيك يذهب ولا يعود","Management Route منفصل عن TMM Route","Partition تنظيمي/إداري وRoute Domain شبكي"]}
      ],lab:"اكتب خطة Initial Setup تشمل Management IP وNTP وDNS وLicense وVLANين وSelf IPs وDefault Route وPort Lockdown.",quiz:{question:"أي عنوان يستخدمه TMM للتواصل على VLAN؟",choices:["Management IP","Self IP","Pool Name","Device Name"],answer:1,explanation:"Self IP يمثل BIG-IP على شبكة VLAN ضمن Data Plane."}},
      {id:"f5-03",title:"LTM: Nodes وPools وVirtual Servers",summary:"أتقن الكائنات الأساسية ورحلة الطلب من Listener حتى اختيار Pool Member.",lessons:[
        {title:"Nodes وPool Members",body:"Node يمثل IP للخادم، وPool Member يضيف Service Port لذلك العنوان داخل Pool. يمكن أن يكون الخادم نفسه عضوًا في أكثر من Pool أو خدمة، وتختلف حالته وفق Monitor المطبق.",points:["Node = IP، Member = IP:Port","Default Pool يرتبط بالـVirtual Server","Priority Group يتيح Active/Backup داخل Pool"]},
        {title:"Virtual Server Types",body:"Standard Virtual Server مناسب لـFull Proxy وLayer 7، بينما Performance L4 يركز على السرعة ولا يوفر كل ميزات التطبيق. اختيار النوع الخاطئ قد يمنع HTTP Profile أو WAF من العمل كما تتوقع.",points:["Destination وService Port يحددان مطابقة Listener","Profiles تحدد سلوك البروتوكول","Reject أو Reset قد يدل على عدم وجود Listener مطابق"]}
      ],lab:"صمّم خدمة HTTPS بخادمين: Node وPool وMonitor وVirtual Server وDefault Pool وSNAT، ثم اكتب مسار الطلب.",quiz:{question:"ما الفرق الدقيق بين Node وPool Member؟",choices:["لا فرق","Node عنوان IP وMember عنوان مع Service Port","Member هو Virtual Server","Node هو Monitor"],answer:1,explanation:"الخدمة المحددة تظهر كعضو IP:Port داخل Pool."}},
      {id:"f5-04",title:"Monitors وLoad Balancing وPersistence وSNAT",summary:"اضبط اختيار الخادم واستمرارية الجلسة ومسار العودة دون صنع اختناقات مخفية.",lessons:[
        {title:"Health Monitors وAlgorithms",body:"Monitor نشط يرسل Send String ويتحقق من Receive String بدل الاكتفاء بفتح Port. Interval وTimeout يجب أن يسمحا بالتأخير الطبيعي. الخوارزمية تختار بين Round Robin وLeast Connections وRatio وفق طبيعة الحمل.",points:["Monitor عميق يثبت صحة التطبيق لا TCP فقط","Receive String خاطئ يجعل عضوًا سليمًا Down","Slow Ramp يمنع إغراق عضو عاد للخدمة"]},
        {title:"Persistence وSNAT",body:"Persistence تعيد العميل لنفس الخادم عند الحاجة. Cookie مناسبة غالبًا للويب خلف NAT، بينما Source Address قد تجمع مستخدمين كثيرين على عضو واحد. SNAT يضمن Return Path لكنه يستهلك Ports ويحتاج Sizing.",points:["Automap بسيط لكن قد يسبب Port Exhaustion","SNAT Pool يوسع سعة الترجمة","Persistence Mirroring مهم لبعض جلسات HA"]}
      ],lab:"قارن تصميمين: متجر Web يحتاج Cookie Persistence، وخدمة TCP تحتاج Source Persistence. اختر Algorithm وSNAT واكتب سبب الاختيار.",quiz:{question:"لماذا قد تكون Source Address Persistence سيئة خلف NAT كبير؟",choices:["لأنها لا تعمل مع TCP","لأن مستخدمين كثيرين يظهرون بعنوان واحد ويتكدسون على Member","لأنها تلغي Monitor","لأنها تحتاج DNS"],answer:1,explanation:"عنوان المصدر المشترك يجعل عددًا كبيرًا من العملاء يتبعون سجل Persistence واحدًا."}},
      {id:"f5-05",title:"Profiles وSSL وiRules وPolicies",summary:"تحكم في سلوك TCP وHTTP وTLS وأضف منطقًا قابلًا للصيانة عند الحاجة فقط.",lessons:[
        {title:"Profile Stack وSSL",body:"TCP وHTTP وClient SSL وServer SSL Profiles تتراكم على Virtual Server. Client SSL ينهي تشفير العميل، وServer SSL يعيد التشفير للخادم. اكتمال Certificate Chain وSNI وCipher Policy عناصر حرجة.",points:["SSL Offload يتيح رؤية HTTP وتطبيق WAF","Client SSL لا يعني تلقائيًا تشفير جهة الخادم","Incomplete Chain قد يعمل مع بعض العملاء ويفشل مع آخرين"]},
        {title:"Local Traffic Policies وiRules",body:"Local Traffic Policy مناسبة للقرارات التصريحية مثل Host وURI وHeader. iRules تستخدم أحداثًا مثل HTTP_REQUEST لمنطق مرن، لكنها تعمل على كل طلب وقد ترفع CPU إذا أسيء استخدام Regex أو Logging.",points:["استخدم Policy عندما تكفي بدل كود","اختر الحدث الصحيح ولا تنفذ عملًا غير مطلوب","اختبر iRule في بيئة غير إنتاجية وراقب الأداء"]}
      ],lab:"اكتب منطقًا يوجه /api إلى Pool مختلف ويضيف X-Forwarded-For؛ قرر ما ينفذ Policy وما يحتاج iRule.",quiz:{question:"ما الخيار الأفضل لمنطق بسيط يعتمد على Host وURI؟",choices:["إعادة تشغيل TMM","Local Traffic Policy","Route Domain جديد","SNMP Trap"],answer:1,explanation:"السياسة التصريحية أوضح وأسهل صيانة عندما لا تحتاج منطق TCL متقدمًا."}},
      {id:"f5-06",title:"High Availability وDSC",summary:"افهم Device Trust وConfig Sync وFailover وTraffic Groups، ثم اختبر التعافي لا مجرد حالة Green.",lessons:[
        {title:"Device Service Clustering",body:"DSC يبني Trust بين الأجهزة ويجمعها في Device Group للمزامنة. Network Failover وHA VLANs تراقب الشريك، بينما Traffic Group يحدد الكائنات العائمة التي تنتقل.",points:["Config Sync لا يساوي Failover","Floating IPs وVirtual Addresses تتبع Traffic Group","Split Brain خطر يحتاج أكثر من مسار مراقبة"]},
        {title:"State Mirroring وFailover Test",body:"اتصالات TCP وPersistence قد تحتاج Mirroring للبقاء بعد Failover، لكنها تضيف حملًا. الاختبار الصحيح يقيس زمن الانتقال وفقد الجلسات وصحة ARP/Routes وعودة الخدمة.",points:["Sync-Failover Group هو النمط الشائع Active/Standby","UCS Backup لا يغني عن مزامنة الإعداد","اختبر Failover في حمل واقعي وخطة Rollback"]}
      ],lab:"أنشئ Checklist لاختبار HA: Sync،HA Links،Traffic Group،Floating IP،Connection/Persistence Mirroring،GARP،وApplication Test.",quiz:{question:"ما وظيفة Config Sync؟",choices:["نقل الترافيك تلقائيًا","مزامنة الإعداد بين أعضاء Device Group","تشفير SSL","توزيع DNS"],answer:1,explanation:"المزامنة تنقل الإعداد، بينما Failover يحرك Traffic Groups والخدمة."}},
      {id:"f5-07",title:"BIG-IP DNS وGSLB",summary:"وزّع المستخدمين بين المواقع بناءً على الصحة والسياسة بدل DNS ثابت.",lessons:[
        {title:"Wide IP وPools وData Centers",body:"Wide IP يمثل الاسم الذي يطلبه العميل، ويحتوي Pools عالمية تشير إلى Virtual Servers في مواقع مختلفة. Monitors وAvailability تحدد الإجابة التي يعيدها BIG-IP DNS.",points:["GSLB يختار موقعًا وLTM يختار خادمًا داخله","TTL يوازن سرعة Failover مقابل Cache Load","Listener وDNS Profile يستقبلان الاستعلامات"]},
        {title:"iQuery وAlgorithms",body:"iQuery على TCP 4353 يشارك الحالة بين BIG-IP DNS وأجهزة BIG-IP الأخرى. يمكن الاختيار وفق Global Availability أو Ratio أو Topology أو QoS، ويجب فهم أثر كل خوارزمية على المستخدم.",points:["Blocked iQuery يسبب قرارات صحة قديمة أو ناقصة","Topology يربط مصدر الطلب بموقع مناسب","Fallback واضح يمنع إجابة غير متوقعة"]}
      ],lab:"صمّم Wide IP لتطبيق في الرياض وجدة: Health Monitors وPrimary/Backup وTTL وخطة فشل موقع كامل.",quiz:{question:"ما الفرق بين Wide IP وLTM Virtual Server؟",choices:["كلاهما الشيء نفسه","Wide IP يختار موقعًا عبر DNS وVirtual Server يستقبل الترافيك في الموقع","Wide IP هو Self IP","Virtual Server سجل DNS"],answer:1,explanation:"GSLB يجيب بالوجهة المناسبة، ثم LTM يدير جلسة التطبيق داخل الموقع."}},
      {id:"f5-08",title:"Advanced WAF وAPM وAFM",summary:"ميّز أدوار حماية التطبيق والهوية وجدار الشبكة، واربطها في مسار طلب واحد.",lessons:[
        {title:"Advanced WAF",body:"سياسة WAF تبدأ بتعلم الترافيك النظيف وStaging ثم Tuning وإنفاذ Blocking. Attack Signatures تعالج الأنماط المعروفة، والـPositive Model يحدد معاملات وطرقًا متوقعة، مع Bot Defense وData Guard وDoS حسب الحاجة.",points:["Transparent يرصد ولا يمنع","فعّل Signature Sets المناسبة لتقنية التطبيق","الاستثناء يجب أن يكون ضيقًا ولا يعطل فئة كاملة"]},
        {title:"APM وAFM",body:"APM يبني Access Policy من Authentication وPosture وResource Assignment وSSO. AFM يطبق Network Firewall وDoS وIP Intelligence في Contexts متعددة، ويجب فهم ترتيب التقييم مع LTM وWAF.",points:["AAA Sources مثل AD وLDAP وRADIUS وSAML/OIDC","Per-Session Policy تختلف عن Per-Request Policy","AFM يحمي طبقات الشبكة وWAF يحمي منطق HTTP والتطبيق"]}
      ],lab:"ارسم خدمة بنكية: AFM يسمح بالشبكة،APM يتحقق من الهوية وMFA،WAF يفحص HTTP،LTM يوازن على Pool.",quiz:{question:"ماذا يعني WAF في Transparent Mode؟",choices:["يمنع كل الهجمات","يراقب ويسجل دون حجب فعلي","يتوقف عن التعلم","يعمل كDNS"],answer:1,explanation:"Transparent مناسب للتعلم والضبط، لكنه لا يفرض المنع حتى تفعيل Blocking."}},
      {id:"f5-09",title:"TMSH وREST والأتمتة والVisibility",summary:"أدر BIG-IP بشكل قابل للتكرار وراقب النظام والتطبيق بدل التغييرات اليدوية غير الموثقة.",lessons:[
        {title:"TMSH وiControl REST",body:"TMSH يوفر إنشاء وعرض وتعديل وحذف وحفظ الإعداد مع Bash للتشخيص. iControl REST يقدم موارد API للأتمتة، بينما Declarative Onboarding وAS3 يصفان الحالة المطلوبة بدل خطوات متفرقة.",points:["save sys config يحفظ الإعداد الجاري","UCS نسخة نظام واستعادة وليست بديلًا عن Git","المعاملات تقلل الإعداد الجزئي عند الفشل"]},
        {title:"Logs وAVR وTelemetry",body:"var/log/ltm لحركة LTM،mcpd للإعداد،tmm لمعالجة البيانات،apm وasm لوحداتهما. AVR يعرض أداء التطبيق، وRemote Syslog أوTelemetry يرسل الرؤية إلى SIEM.",points:["استخدم SNMPv3 بدل Community مكشوفة","NTP أساس ربط الأحداث","HSL مناسب للتسجيل عالي السرعة من iRules"]}
      ],lab:"جهّز Change Plan ينشئ Pool وVirtual Server عبر TMSH أوREST، يتحقق من الحالة، يحفظ الإعداد، ثم يسجل Rollback.",quiz:{question:"أي Log تبدأ به غالبًا لمشكلة Pool أوVirtual Server؟",choices:["/var/log/ltm","/var/log/cron","/var/log/mail","/var/log/audit فقط"],answer:0,explanation:"ltm يحتوي أحداث الأعضاء والمراقبة وحركة LTM الأساسية."}},
      {id:"f5-10",title:"Troubleshooting ومشروع ختامي",summary:"حوّل الأعراض إلى طبقة وأداة، ثم ابنِ خدمة آمنة وعالية التوافر واختبر حالات الفشل.",lessons:[
        {title:"منهجية تحديد المرحلة",body:"حدّد أين يفشل الطلب: لا يصل،TCP/TLS يفشل،WAF/APM يمنع،Member لا يرد،أو المشكلة تحت الحمل. استخدم show وLogs ثم tcpdump/ssldump وqkview/iHealth عند الحاجة.",points:["4xx قد يأتي من العميل أوPolicy و5xx قد يشير للخدمة أوPool","SNAT Port Exhaustion يظهر عشوائيًا تحت الحمل","Certificate Expiry أوIncomplete Chain من أشهر أسباب SSL"]},
        {title:"Capstone Design",body:"المشروع النهائي يبني VLANs وSelf IPs وRoutes،ثم Pool وMonitor وVirtual Server وSSL وPersistence وSNAT،ويضيف HA وLogging وWAF تدريجيًا مع اختبارات قبول.",points:["Size for Peak لا للمتوسط فقط","Backup خارج الجهاز وCertificate Monitoring ضروريان","Baseline قبل التغيير يثبت التحسن أو التراجع"]}
      ],lab:"ابنِ وثيقة كاملة لتطبيق Web: Objects،Traffic Flow،HA،SSL،WAF،Monitoring،اختبار عضو Down،Failover،انتهاء شهادة،وحمل مرتفع.",quiz:{question:"فشل عشوائي تحت الحمل مع Automap واحد يشير غالبًا إلى ماذا؟",choices:["DNS TTL طويل","SNAT Port Exhaustion","خطأ في اسم Pool فقط","تعطل NTP"],answer:1,explanation:"عنوان ترجمة واحد يملك عددًا محدودًا من المنافذ المؤقتة وقد ينفد عند كثافة الاتصالات."}}
    ]
  },
];
