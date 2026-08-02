"use strict";

(function(){
  const misconceptions=[
    "يكفي الاعتماد على الإعداد الافتراضي دون قياس أو تحقق.",
    "الأفضل توسيع الصلاحيات وتعطيل التسجيل لتقليل التعقيد.",
    "لا يؤثر السياق أو المسار أو هوية الأصل في القرار."
  ];
  function buildQuiz(lesson,index){
    const correct=lesson.points[index%lesson.points.length],answer=(index+1)%4,choices=misconceptions.slice();
    choices.splice(answer,0,correct);
    return{question:"أي عبارة تمثل ممارسة صحيحة ضمن «"+lesson.title+"»؟",choices,answer,explanation:"الممارسة الصحيحة هي: "+correct+". ارجع إلى الشرح وقائمة التحقق لربطها بالسيناريو العملي."};
  }
  const courses=Array.isArray(window.TRAINING_COURSES)?window.TRAINING_COURSES:[];
  courses.forEach(course=>course.modules.forEach(module=>{
    const detailed=Array.isArray(module.guides)?module.guides.slice(-4):[];
    module.quizzes=[module.quiz].concat(detailed.map(buildQuiz));
  }));
})();
