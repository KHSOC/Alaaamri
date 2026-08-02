"use strict";

(function(){
  const misconceptions=[
    "يكفي الاعتماد على الإعداد الافتراضي دون قياس أو تحقق.",
    "الأفضل توسيع الصلاحيات وتعطيل التسجيل لتقليل التعقيد.",
    "لا يؤثر السياق أو المسار أو هوية الأصل في القرار.",
    "إعادة تشغيل الجهاز هي خطوة التشخيص الأولى دائمًا.",
    "نجاح الإعداد يعني أن التطبيق يعمل دون الحاجة إلى اختبار.",
    "يمكن تغيير عدة متغيرات معًا لأن النتيجة ستكون أوضح.",
    "السجل المنفرد يكفي لإثبات السبب الجذري للحادث.",
    "لا حاجة لخطة تراجع إذا كان التغيير صغيرًا.",
    "الحظر الكامل أفضل من الاستثناء الدقيق في جميع الحالات.",
    "يكفي اختبار حالة النجاح ولا حاجة لاختبار الرفض أو الفشل.",
    "لا تؤثر دقة الوقت في ربط الأحداث بين الأنظمة.",
    "التوثيق يمكن تأجيله لأن الإعداد يشرح نفسه."
  ];
  function buildQuiz(lesson,index){
    const correct=lesson.points[index%lesson.points.length],answer=(index+1)%4,choices=[0,1,2].map(offset=>misconceptions[(index*3+offset)%misconceptions.length]);
    choices.splice(answer,0,correct);
    return{question:"أي عبارة تمثل ممارسة صحيحة ضمن «"+lesson.title+"»؟",choices,answer,explanation:"الممارسة الصحيحة هي: "+correct+". ارجع إلى الشرح وقائمة التحقق لربطها بالسيناريو العملي."};
  }
  const courses=Array.isArray(window.TRAINING_COURSES)?window.TRAINING_COURSES:[];
  courses.forEach(course=>course.modules.forEach(module=>{
    const detailed=Array.isArray(module.guides)?module.guides.slice(-4):[];
    module.quizzes=[module.quiz].concat(detailed.map(buildQuiz));
  }));
})();
