/* ============ ملف الإعدادات الوحيد: عدّل هنا فقط ============ */
window.GAME_CONFIG = {
  /* --- النصوص العامة --- */
  title: "مغامرة الأسئلة المجنونة",
  subtitle: "أجب صح لتنجو… وأخطئ لتتزحلق!",
  description: "فريقان يتناوبان على الأسئلة. كل إجابة صحيحة تبعد الخطر، وكل خطأ يقرّبه.",

  /* --- اللاعبون الافتراضيون (gender: male | female | neutral) --- */
  players: [
    { name: "فريق الشجعان", gender: "male",   skin: "#ffcf9f", color: "#ff6b6b", accessory: "cap",   expression: "confident" },
    { name: "فريق النجوم",  gender: "female", skin: "#e0a370", color: "#8e5cf7", accessory: "crown", expression: "genius" }
  ],

  /* --- خيارات المظهر (المفتاح: الاسم المعروض) --- */
  options: {
    genders:     { male: "ذكر", female: "أنثى", neutral: "محايد" },
    skins:       ["#ffcf9f", "#e0a370", "#b97a4b", "#7a4a2b", "#9be3a0", "#a8d8ff"],
    colors:      ["#ff6b6b", "#ffd23f", "#2ec4b6", "#8e5cf7", "#3a86ff", "#ff9f1c"],
    accessories: { none: "بدون", glasses: "نظارة", crown: "تاج", cap: "قبعة", bow: "فيونكة" },
    expressions: { confident: "الواثق", genius: "العبقري", naughty: "المشاغب", confused: "المرتبك" },
    /* المشاهد: slime جسر فوق بركة لزجة | rock صخرة متدحرجة | snake ثعبان لطيف */
    scenes:      { slime: "جسر فوق بركة لزجة", rock: "صخرة متدحرجة", snake: "ثعبان لطيف" }
  },

  /* --- قواعد اللعب --- */
  game: {
    questionCount: 6, countChoices: [4, 6, 8],   // عدد الأسئلة
    timeSeconds: 30,  timeChoices: [15, 30, 60], // وقت الإجابة
    scene: "slime",         // المشهد الافتراضي
    shuffle: false,         // خلط ترتيب الأسئلة
    startSafety: 50,        // مستوى الأمان الابتدائي (0-100)
    safetyStep: 20,         // التغير في الأمان لكل إجابة
    wrongPenalty: 0,        // خصم الخطأ كنسبة من نقاط السؤال (0 = بلا خصم، 0.5 = النصف)
    steal: true,            // السماح للخصم بسرقة السؤال بعد الخطأ
    stealPoints: 0.5,       // نسبة النقاط التي يكسبها السارق
    stealSafety: 10,        // أمان إضافي للسارق عند النجاح
    sound: true             // الصوت مفعّل مبدئيًا
  },

  /* --- الرسائل ({name} يُستبدل باسم اللاعب) --- */
  messages: {
    turn: "دور {name}",
    correct: "أحسنت! ابتعد الخطر.", wrong: "إجابة خاطئة… اقترب الخطر!",
    stealAsk: "فرصة للسرقة! هل أجاب {name} بشكل صحيح؟", stealWin: "سرقة ناجحة!", timeUp: "انتهى الوقت!",
    win: "{name} نجا بطلاً!", tie: "تعادل! نجا الجميع 🎉",
    lose: "{name} هبط على كومة وسائد ناعمة!",
    status: [ // من الأعلى أمانًا إلى الأقل: min = أدنى مستوى أمان
      { min: 80, icon: "🌟", text: "نجا بأعجوبة" },
      { min: 50, icon: "🙂", text: "بطلنا متوازن" },
      { min: 25, icon: "⚠️", text: "اقتربت الخطورة!" },
      { min: 0,  icon: "🆘", text: "يحتاج إلى إنقاذ" }
    ]
  },

  /* --- الألوان والخلفية (تتحول إلى متغيرات CSS) --- */
  palette: {
    bg: "linear-gradient(135deg,#2ec4b6 0%,#8e5cf7 55%,#ff6b6b 100%)",
    card: "#ffffff", ink: "#2b1b4d", accent: "#ffd23f", ok: "#12b76a", no: "#f04438"
  },

  /* --- الأسئلة (تصنيف cat، نص q، إجابة a، نقاط points، شرح note اختياري) --- */
  questions: [
    { cat: "علوم",   q: "ما أكبر كوكب في المجموعة الشمسية؟", a: "المشتري", points: 10, note: "يتسع لأكثر من ألف أرض!" },
    { cat: "جغرافيا", q: "ما عاصمة اليابان؟", a: "طوكيو", points: 10 },
    { cat: "رياضيات", q: "كم يساوي 7 × 8؟", a: "56", points: 10 },
    { cat: "طبيعة",  q: "ما أسرع حيوان بري؟", a: "الفهد", points: 20, note: "يصل إلى نحو 100 كم/س." },
    { cat: "علوم",   q: "ما الغاز الذي نتنفسه ليبقينا أحياء؟", a: "الأكسجين", points: 10 },
    { cat: "ثقافة",  q: "كم لونًا في قوس المطر؟", a: "سبعة", points: 10 },
    { cat: "جغرافيا", q: "ما أطول نهر في إفريقيا؟", a: "النيل", points: 20 },
    { cat: "لغة",    q: "ما جمع كلمة «كتاب»؟", a: "كُتُب", points: 10 }
  ]
};
