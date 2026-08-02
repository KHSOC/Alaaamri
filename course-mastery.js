"use strict";

(function(){
  const mastery={
    "pa-01":[
      ["Onboarding آمن لتطبيق جديد","ابدأ بمالك التطبيق وتصنيف البيانات وتدفقات المستخدم والخدمة، ثم حدد الهوية والجهاز والشبكة وشروط الوصول والتسجيل. ابنِ سياسة أولية ضيقة واختبر حالات المستخدم الصحيح والجهاز غير المتوافق والحساب عالي المخاطر.",["حدد مالك الخدمة","صنف البيانات","اختبر السماح والرفض","راجع السياسة بعد الإطلاق"]],
      ["الاستجابة لهوية مخترقة","عند الاشتباه بحساب صحيح لا تكتفِ بتغيير كلمة المرور. أوقف الجلسات وTokens، راجع MFA والجهاز والمصادر والتطبيقات التي وصل إليها، وابحث عن تغييرات الصلاحيات والحركة الجانبية قبل إعادة التمكين.",["ألغِ Sessions وTokens","احفظ Timeline","راجع Privilege changes","أعد التمكين بشروط"]]
    ],
    "pa-02":[
      ["فرضية Hunt عبر مراحل الهجوم","حوّل تنبيهًا واحدًا إلى سؤال: ما السلوك الذي سبق الدخول وما الذي تلاه؟ ابحث في البريد والهوية وEndpoint وDNS والترافيك عن تقنيات مترابطة، وسجل الأدلة التي تثبت الفرضية أو تنفيها.",["حدد نافذة زمنية","اربط Data sources","ابحث عن سلوك لاحق","اكتب درجة الثقة"]],
      ["اختبار Detection Coverage","اختر Technique مهمة وشغّل محاكاة آمنة في مختبر، ثم تحقق من وصول Telemetry وإطلاق القاعدة واحتواء Runbook على الخطوات الصحيحة. الفشل قد يكون في المصدر أو Parser أو Logic أو عملية التصعيد.",["حدد Expected events","اختبر Parser","قِس زمن التنبيه","حوّل الفجوة إلى مهمة"]]
    ],
    "pa-03":[
      ["مصفوفة أعطال TCP وTLS","صنف العطل حسب المرحلة: لا يوجد SYN، أو SYN بلا رد، أو Handshake مكتمل ثم RST، أو TLS Alert، أو HTTP Error. اربط كل نمط باحتمالات المسار والسياسة والخادم والشهادة والتطبيق.",["حدد أول حزمة فاشلة","قارن الطرفين","راجع Reset source","اربط PCAP بالسجلات"]],
      ["اكتشاف Asymmetric Routing","قد تدخل الحزمة من مسار وتعود من آخر، فيفشل Stateful Inspection رغم صحة العناوين. قارن Route وECMP وNAT والجلسة على الأجهزة في الاتجاهين، وثبت المسار أو صمم Symmetric return.",["تتبع الاتجاهين","راجع ECMP","قارن NAT قبل وبعد","اختبر بعد التغيير"]]
    ],
    "pa-04":[
      ["تصميم U-Turn NAT","عندما يصل مستخدم داخلي إلى خدمة داخلية بعنوانها العام، تحتاج Hairpin/U-Turn NAT وسياسة ومسارًا يعيدان الترافيك عبر الفايروول. اختبر DNS الداخلي والخارجي وتجنب NAT غير ضروري إذا كان Split DNS أبسط.",["حدد Original وTranslated values","راجع Source NAT للحالة","اختبر من الشبكة الداخلية","قارن Split DNS"]],
      ["تغيير Routing بلا انقطاع","قبل إضافة Route أو تعديل Preference، احصر الوجهات والجلسات والبروتوكولات الديناميكية وReturn path. نفذ التغيير على نطاق صغير وراقب FIB والجلسات وPacket Capture، ثم جهز تراجعًا يعيد المسار السابق.",["احفظ Routing snapshot","حدد Impacted prefixes","راقب Convergence","جهز Backout"]]
    ],
    "pa-05":[
      ["تصميم BGP وECMP للفروع","استخدم BGP عند تبادل مسارات متعدد المواقع أو المزودين، وحدد Filters وLocal Preference وAS Path وDefault behavior. ECMP يوزع التدفقات المتساوية لكنه يحتاج NAT ومسار عودة متسقًا.",["رشح Prefixes","منع Route leak","اختبر Withdrawal","راقب Session symmetry"]],
      ["تتبع رحلة تطبيق عبر SD-WAN","اختر تطبيقًا واكتب DNS وIP وPort وApp-ID وSLA Rule وEgress link وNAT والسياسة. نفذ جلسة جديدة أثناء فشل رابط، ثم قارن اختيار القاعدة وزمن التحول وأثره على التطبيق.",["اربط التطبيق بالقاعدة","راجع SLA state","قارن جلسة قديمة وجديدة","وثق Failback"]]
    ],
    "pa-06":[
      ["تصميم Decryption Policy","حدد الفئات والمستخدمين والأجهزة التي تخضع للفحص والاستثناءات التنظيمية والتقنية، ثم وزع CA واحمِ مفتاحها. راقب TLS errors وUnsupported applications ولا تجعل الاستثناء عامًا بسبب تطبيق واحد.",["صنف الترافيك","اختبر الثقة بالشهادة","وثق الاستثناء","راقب أثر الأداء"]],
      ["مراجعة Policy مع مالك العمل","اعرض Hit Count والتطبيقات الفعلية والمستخدمين والوجهات والمخاطر على مالك الخدمة. حوّل القاعدة من Port-based أو Any إلى App-ID وUser-ID وApplication-default تدريجيًا مع نافذة مراقبة.",["أثبت الاستخدام بالسجل","حدد Owner","ضيّق مرحلة بمرحلة","حدد تاريخ مراجعة"]]
    ],
    "pa-07":[
      ["تحليل ملف عبر WildFire","اربط File log بحكم WildFire والـHash والمستخدم والجهاز والـURL والاتصالات اللاحقة. إذا تغيّر Verdict ابحث عن كل الأجهزة التي شاهدت الملف وحدّث الحماية وابدأ احتواءً مناسبًا.",["احفظ SHA-256","راجع Verdict history","ابحث عن انتشار الملف","اربطه بـEndpoint"]],
      ["Enrichment لتنبيه Threat","أضف إلى Signature المصدر والوجهة والأصل الحرج والهوية وGeo وDNS وملف PCAP وPrevalence. هذا السياق يحدد هل الإجراء حظر فوري أم تحقيق أم ضبط False Positive ضيق.",["حدد Asset criticality","راجع Direction","قارن التكرار","اكتب Next action"]]
    ],
    "pa-08":[
      ["توليف DoS Protection","قِس CPS والجلسات والحزم الطبيعية لكل خدمة، ثم ضع Alarm وActivate وMaximum مع مساحة للارتفاع المشروع. افصل الحماية لكل VIP حرج وراقب Drops والخدمة أثناء اختبار حمل آمن.",["ابدأ Baseline","ضع Alarm قبل Activate","اختبر Peak مشروعًا","راجع Block duration"]],
      ["إثبات Zone Protection","نفذ Scan أو SYN flood محدودًا في مختبر، وتحقق من Counters وThreat logs واستمرار الترافيك السليم. عدّل Threshold تدريجيًا واحتفظ بقياسات قبل وبعد بدل الاعتماد على الإعداد الافتراضي.",["استخدم مختبرًا معزولًا","راقب Legitimate traffic","احفظ Counters","وثق Threshold النهائي"]]
    ],
    "pa-09":[
      ["بناء Parser موثوق في SIEM","حدد الحقول المطلوبة مثل Time وRule وAction وApp وUser وNAT وSession End Reason، ثم اختبر أنواع Logs متعددة وحالات القيم الفارغة. راقب Parsing failures بعد تحديث PAN-OS أو SIEM.",["احتفظ Raw log","وحّد Timestamp","اختبر NAT fields","أنشئ تنبيه Parse failure"]],
      ["Runbook لتنبيه الشبكة","اكتب سؤال التحقيق وFilters والأوامر والسجلات وخطوات التحقق ونقاط التصعيد والاحتواء. اجعل كل خطوة تنتج دليلًا أو قرارًا، وحدّث Runbook بعد كل حادث أو تغيير منصة.",["حدد Inputs المطلوبة","اكتب Decision points","أضف Rollback","اختبره مع محلل آخر"]]
    ],
    "pa-10":[
      ["مصفوفة قبول المشروع","حوّل المتطلبات إلى اختبارات تشمل Routing وNAT والسياسات والهوية والتشفير وThreat Prevention وHA والسجلات والأداء. لكل اختبار مدخل ونتيجة متوقعة ودليل ومالك وحالة.",["غطِّ Positive وNegative","احفظ Screenshots وLogs","حدد معايير النجاح","أغلق الفجوات قبل التسليم"]],
      ["التسليم التشغيلي وAs-Built","سلّم الرسم والعناوين والتدفقات والسياسات والنسخ والتراخيص والشهادات والمراقبة وRunbooks وجهات التصعيد. نفذ جلسة Knowledge Transfer وتجربة استعادة بدل تسليم ملف إعداد فقط.",["حدّث الرسم النهائي","وثق Dependencies","اختبر Restore","حدد مهام ما بعد المشروع"]]
    ],
    "f5-01":[
      ["قراءة Connection Table","اربط Client-side connection بالـServer-side connection وVirtual Server وPool member وSNAT وPersistence. تحدد هذه الخريطة هل التأخير أو Reset قبل BIG-IP أم بعده، وهل أعيد استخدام اتصال عبر OneConnect.",["ثبت Client tuple","حدد Server tuple","راجع Idle timeout","قارن Bytes في الجهتين"]],
      ["تقدير السعة والحدود","قِس Connections per second وConcurrent connections وThroughput وSSL TPS وHTTP requests وTMM utilization. خطط للنمو وHA والفشل، ولا تعتمد على Bandwidth وحده عند اختيار المنصة.",["استخدم Peak لاAverage","احسب أثر SSL","راجع License limits","اترك Headroom للفشل"]]
    ],
    "f5-02":[
      ["Route Domains وPartitions","يفصل Route Domain مساحات العناوين المتداخلة، بينما ينظم Partition ملكية الإعداد والكائنات. خطط IDs وDefault route وAdministrative roles وأسماء الكائنات قبل استضافة عملاء أو بيئات متعددة.",["حدد Route domain لكل Tenant","تجنب Cross-partition references","راجع Default partition","وثق صلاحيات الإدارة"]],
      ["استعادة UCS وSCF","يحفظ UCS إعداد الجهاز وشهاداته ومفاتيحه، بينما SCF نص إعداد قابل للمراجعة. اختبر النسخة على جهاز متوافق، واحمِ الملفات بكلمة مرور وتخزين محدود الوصول.",["طابق Version وPlatform","شفّر النسخة","اختبر Restore","وثق Device-specific settings"]]
    ],
    "f5-03":[
      ["تحليل HTTP Request داخل LTM","تتبع Host وURI وHeaders وCookie من Client SSL إلى HTTP Profile وPolicy/iRule ثم Pool وMember. وثق أي Rewrite أو Redirect أو X-Forwarded-For حتى يفهم فريق التطبيق ما يتغير.",["حدد نقطة SSL termination","راجع Header insert","اختبر Host متعددًا","قارن الطلب قبل وبعد"]],
      ["نموذج Onboarding لتطبيق","اجمع VIP وPorts وDNS وPool members وMonitor وSSL وPersistence وSNAT وWAF والمالك وSLO. أنشئ Test plan وحالة Rollback قبل فتح الترافيك، ثم راقب Error rate وLatency.",["استخدم Template ثابتًا","تحقق من Firewall path","اختبر كل Member","حدد نافذة مراقبة"]]
    ],
    "f5-04":[
      ["Priority Group Activation وSlow Ramp","تسمح Priority Groups باستخدام أعضاء مفضلة ثم الاحتياطية، ويمنع Slow Ramp توجيه حمل كامل إلى عضو عاد للتو. اختبر السعة الفعلية وحالة جميع الأعضاء عند فقد المجموعة الأساسية.",["حدد Minimum active members","راقب عضوًا متعافيًا","اختبر Capacity الاحتياطية","وثق Recovery behavior"]],
      ["اختبار Persistence وSNAT تحت حمل","أنشئ عملاء خلف NAT وراقب توزيع Cookie أو Source Address وSNAT ports وConnection reuse. ابحث عن Hot member أو Port exhaustion أو Session stickiness أطول من حاجة التطبيق.",["قارن أكثر من مصدر","راقب Persistence records","راجع SNAT pool","اختبر Timeout"]]
    ],
    "f5-05":[
      ["OneConnect وHTTP Profiles","يعيد OneConnect استخدام اتصالات Server-side وقد يحسن الكفاءة، لكنه يتفاعل مع Persistence والهوية داخل الاتصال. اختبر التطبيق الذي يعتمد على Connection state قبل التفعيل، وراقب Server connections وLatency.",["افهم Connection reuse","اختبر Authentication behavior","راجع OneConnect mask","قارن Server load"]],
      ["تشخيص SSL Handshake","حدد جانب Client SSL أو Server SSL، ثم قارن Version وCipher وSNI والشهادة والسلسلة وClient authentication. استخدم ssldump أو openssl في مختبر وحدد أول Alert بدل استبدال Profiles عشوائيًا.",["حدد اتجاه الفشل","راجع SNI","تحقق من Chain","قارن Cipher overlap"]]
    ],
    "f5-06":[
      ["Device Trust وConfigSync","يبني Device Trust علاقة الشهادات بين الأجهزة، ثم يجمع Sync-Failover group الأعضاء والإعدادات. تحقق من الوقت وManagement connectivity وCertificates وDevice Group قبل معالجة Sync.",["اضبط NTP","راجع Trust status","تحقق من Sync group","احفظ UCS قبل الإصلاح"]],
      ["Traffic Groups وفشل جزئي","قد ينتقل Traffic Group واحد دون بقية الخدمات بسبب Network Failover أو VLAN failsafe أو HA Group. حدد مالك كل Floating object وراقب Active device لكل مجموعة بدل افتراض أن الجهاز كله Active أو Standby.",["اربط Floating IP بالمجموعة","راجع HA score","اختبر مجموعة واحدة","راقب Split brain"]]
    ],
    "f5-07":[
      ["iQuery وDNS Dependencies","يعتمد BIG-IP DNS على iQuery لجمع حالة LTM وعلى DNS delegation وListeners وWide IPs. افصل فشل Delegation عنفشل iQuery عنعدم توفر Pool member، واستخدم dig لتتبع السلسلة.",["تحقق من NS records","راجع iQuery status","اختبر Listener","قارن Answer وTTL"]],
      ["تمرين Disaster Recovery عبر GSLB","حاكِ فقد Data Center وراقب انتقال الإجابة وزمن TTL وتجربة المستخدم والجلسات والعودة بعد التعافي. تأكد أن الموقع الاحتياطي يملك السعة والبيانات والشهادات والمسارات المطلوبة.",["اخفض TTL قبل الاختبار عند الحاجة","قِس DNS convergence","اختبر التطبيق لاDNS فقط","وثق Failback"]]
    ],
    "f5-08":[
      ["دورة تعلم Policy في WAF","شغّل Staging وLearning على Traffic ممثل، وراجع Suggestions حسب URL وParameter وAttack signature. لا تقبل التعلم آليًا بلا مالك تطبيق، ثم فعّل Blocking تدريجيًا واختبر الإصدار الجديد.",["افصل Traffic الضار","راجع False positives","حدد Enforcement readiness","اربط السياسة بالـRelease"]],
      ["دمج APM وAFM وWAF","رتب القرار من Network controls إلىAccess policy ثم حماية HTTP مع فهم Context لكل Module. صمم Logs تربط المستخدم والجلسة والطلب، وحدد أين ينفذ الرفض وما الرسالة التي يراها العميل.",["ارسم Processing order","وحّد Session identifiers","قلل Duplicate rules","اختبر Deny في كل طبقة"]]
    ],
    "f5-09":[
      ["AS3 وإدارة Declarative","يصف AS3 التطبيق كـDeclaration يمكن حفظها في Git وتطبيقها باستمرار، ما يقلل أوامر TMSH المتتابعة. افصل Tenant، وتحقق من Schema وResult، واجعل Pipeline يحمي Secrets ويدعم Rollback.",["استخدم Version control","تحقق من Declaration","اختبر Idempotency","احفظ Previous state"]],
      ["Telemetry Streaming وDashboard","أرسل Statistics وEvents إلى منصة مراقبة، ثم ابنِ لوحة تربط VIP وPool وMember وRPS وLatency وErrors وSSL وTMM. استخدم SLO وتنبيهًا قابلًا للتنفيذ بدل رسوم بلا سياق.",["حدد Metrics المهمة","استخدم Percentiles","راقب Telemetry loss","اربط Alert بـRunbook"]]
    ],
    "f5-10":[
      ["qkview وحالة الدعم","اجمع qkview بعد تثبيت الوقت والمشكلة وقبل تغييرات كبيرة، وراجع iHealth والتنبيهات والموارد والإعداد. أزل البيانات الحساسة حسب السياسة وأرفق Timeline وPCAP وTest case بحالة الدعم.",["اجمع وقت المشكلة","لا تشارك Secrets","أرفق خطوات إعادة الإنتاج","وثق التغييرات السابقة"]],
      ["اختبار قبول منصة ADC","اختبر DNS وVIP وTLS وHTTP وPersistence وSNAT وPool health وFailover وLogging والأداء والأمان. نفذ Positive وNegative وLoad test ممثلًا، ثم سلّم الأدلة وAs-built وRunbooks.",["حدد Expected result","اختبر HA فعليًا","قِس Latency","وثق كل Dependency"]]
    ],
    "cc-01":[
      ["Timeline من PCAP وLogs","وحّد الوقت ثم اربط DNS وTCP وTLS وHTTP وسجلات Firewall وProxy وEndpoint في تدفق واحد. حدد أول حدث مؤكد والفراغات وأي NAT أو Clock drift يؤثر في نسبة النشاط.",["ثبت Timezone","اربط 5-Tuple","راجع NAT mapping","افصل الحقيقة عن الفرضية"]],
      ["تحليل شبكة سحابية","استخدم VPC Flow Logs وCloud DNS وLoad Balancer وIdentity وControl Plane logs لفهم اتصال سحابي. تذكر أن غياب Packet payload يفرض ربط Metadata مع التطبيق والهوية والتغييرات.",["حدد Account وRegion","راجع Security groups","اربط الهوية بالـAPI","راقب Egress"]]
    ],
    "cc-02":[
      ["Triage لآثار Windows وLinux","ابنِ قائمة متوازية تشمل Login وProcess tree وCommand line وPersistence وNetwork وFiles وPrivileges على النظامين. استخدم نفس سؤال التحقيق مع اختلاف مصادر الأدلة بدل حفظ أوامر منفصلة بلا سياق.",["حدد User وHost","راجع Parent process","ابحث عن Persistence","احفظ الأدلة الخام"]],
      ["تحقيق Container وCloud Workload","اربط Image وRegistry وDeployment وService Account وPod/Container runtime وNode والاتصالات. افصل تغييرًا مشروعًا في Pipeline عنتنفيذ داخل Container، واحفظ Logs قبل زوال المورد.",["احفظ Image digest","راجع Kubernetes audit","حدد Service account","اجمع Runtime events"]]
    ],
    "cc-03":[
      ["حساب Risk Scenario","اكتب أصلًا وتهديدًا وثغرة واحتمالًا وأثرًا وضوابط قائمة، ثم احسب مستوى الخطر قبل وبعد المعالجة. استخدم الأرقام لدعم القرار لا لإخفاء عدم اليقين، وسجل الافتراضات والمالك.",["حدد نطاق السيناريو","اكتب Assumptions","احسب Residual risk","حدد Risk owner"]],
      ["ربط Control بالدليل","حوّل كل متطلب إلى Control owner وImplementation وEvidence وTest frequency وException process. وجود Policy مكتوبة لا يثبت التنفيذ؛ اختبر الإعداد والسجل وسلوك الحالة السلبية.",["حدد Evidence حديثًا","اختبر Sample","راجع الاستثناءات","افتح Gap عند الفشل"]]
    ],
    "cc-04":[
      ["Threat Modeling لواجهة API","ارسم الأصول والجهات ونقاط الثقة والEndpoints والهوية والبيانات، ثم حلل إساءة المصادقة والتفويض والـInput والـRate والـSecrets. اربط كل تهديد بضابط وLog واختبار.",["راجع Object authorization","اختبر Rate limits","احمِ Secrets","سجل Admin actions"]],
      ["مسؤولية الحادث السحابي","حدد ما يملكه المزود وما يديره العميل، ومن يجمع Cloud logs ويعزل المفاتيح ويجمد الموارد ويتواصل مع المزود. جهّز أدوارًا وصلاحيات طوارئ قبل الحادث.",["راجع Shared responsibility","حدد Forensic access","احمِ Break-glass","وثق مزود الدعم"]]
    ],
    "cc-05":[
      ["مصفوفة ATT&CK إلى Data Sources","اختر Techniques مناسبة للقطاع واربط كل واحدة بـData component وTelemetry وDetection وRunbook وTest. لون الفجوات حسب الخطر وجودة البيانات بدل الادعاء بتغطية Technique لأن قاعدة واحدة موجودة.",["حدد Priority techniques","قِس Data quality","اختبر Detection","راجع Coverage دوريًا"]],
      ["فرضية عن مجموعة تهديد","اجمع Victimology وInfrastructure وMalware وTTPs والتوقيت والدافع، ثم اكتب تقييمًا بدرجة ثقة وبدائل محتملة. ركز على الدفاع والتغطية ولا تحول التشابه إلى Attribution قطعي.",["افصل Facts عنAssessment","استخدم Confidence language","قارن فرضيات بديلة","حدد Defensive actions"]]
    ],
    "cc-06":[
      ["قياس جودة البيانات في SIEM","راقب Ingestion delay وEvent rate وParsing failures وTimestamp drift والحقول الفارغة والتكرار. أنشئ تنبيهًا لفقد Source مهم، لأن Detection لا يمكن الوثوق بها إذا توقفت البيانات بصمت.",["حدد Expected volume","راقب Last event time","اختبر Field completeness","وثق مالك المصدر"]],
      ["دورة حياة Detection Rule","ابدأ بفرضية وData source وLogic وTest cases وSeverity وExceptions وRunbook، ثم راقب Precision وFalse positives وCoverage. راجع القاعدة بعد تغير البيئة أو Parser أو سلوك الخصم.",["استخدم بيانات اختبار","حدد Owner","قِس Alert quality","أرشف القواعد القديمة"]]
    ],
    "cc-07":[
      ["كتابة Hunt Report","وثق الفرضية والنطاق والبيانات والاستعلامات والنتائج والإيجابيات الكاذبة والقيود والقرار. حتى النتيجة السلبية مفيدة إذا أوضحت ما غطته البيانات وما بقي غير مرئي.",["احفظ Queries","حدد Population","اكتب Limitations","حوّل النتيجة إلى Detection"]],
      ["تشغيل Threat Intelligence","قيّم المصدر والثقة والحداثة والسياق ثم حوّل Intelligence إلى Enrichment أو Hunt أو Blocking أو Detection. ضع TTL للمؤشرات وراقب False positives، وفضل TTPs عندما تتغير البنية بسرعة.",["استخدم TLP","حدد Expiry","اربط المؤشر بحملة","راجع أثر الحظر"]]
    ],
    "cc-08":[
      ["Chain of Custody ودليل رقمي","سجل من جمع الدليل ومتى ومن أين وكيف حُفظ وHash وأي نقل أو تحليل. اعمل على نسخة، وحافظ على الأصل والصلاحيات والوقت حتى تبقى النتيجة قابلة للدفاع والمراجعة.",["احسب Hash","استخدم Write blocker عند الحاجة","وثق كل Transfer","احمِ Evidence storage"]],
      ["Recovery ودروس ما بعد الحادث","حدد شروط العودة للخدمة ومراقبة ما بعد الاستعادة وإزالة Persistence وتدوير Credentials. بعد الإغلاق اربط السبب الجذري بفجوات Control وDetection وProcess، وعيّن مالكًا وموعدًا لكل تحسين.",["اختبر نظافة الأصل","راقب Recurrence","حدث Runbooks","تحقق من إغلاق الإجراءات"]]
    ],
    "cc-09":[
      ["تحليل Beaconing","ابحث عن اتصالات دورية متقاربة في الزمن والحجم والوجهة، ثم قارن Jitter وDNS وSNI والشهادة والProcess. الدورية وحدها لا تكفي؛ Updaters وخدمات المراقبة قد تتشابه مع C2.",["احسب Inter-arrival time","قارن Peer group","اربط بالعملية","راجع Domain context"]],
      ["Static وDynamic Malware Triage","ابدأ بـHash وType وSignature وStrings وImports وHeaders دون تشغيل، ثم استخدم Sandbox معزولًا عند الحاجة لمراقبة Process وFiles وRegistry وNetwork. حول النتائج إلى IOCs وIOAs وDetection.",["لا تشغل على جهاز العمل","احفظ Sample بأمان","سجل Tool versions","وثق Confidence"]]
    ],
    "cc-10":[
      ["ترتيب الثغرات بالسياق","ادمج CVSS مع Exploitability والتعرض وحساسية الأصل والتهديد النشط والضوابط والتأثير التجاري. ضع SLA ومعالجة أو Mitigation واستثناءً موثقًا، ثم أعد الفحص لإثبات الإغلاق.",["تحقق من Asset inventory","راجع KEV أو Exploit evidence","حدد Owner","اختبر Remediation"]],
      ["حل سيناريو CCOA متكامل","ابدأ بالسؤال وحدد Data source والدليل الأهم والفرضية والاختبار والقرار، ثم وثق السبب. درّب نفسك على التمييز بين خطوة Triage عاجلة وتحقيق عميق ومعالجة طويلة الأجل.",["اقرأ الهدف قبل الأدوات","رتب الأدلة زمنيًا","استبعد الإجابات المطلقة","اكتب سبب الاختيار"]]
    ]
  };

  const courses=Array.isArray(window.TRAINING_COURSES)?window.TRAINING_COURSES:[];
  courses.forEach(course=>course.modules.forEach(module=>{
    const items=mastery[module.id]||[];
    module.guides=(Array.isArray(module.guides)?module.guides:[]).concat(items.map(([title,body,points])=>({title,body,points})));
  }));
})();
