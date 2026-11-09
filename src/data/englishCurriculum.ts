/**
 * Comprehensive Academic Curriculum Database for:
 * - Module English-01: Communicative English for Muslim University Students - Semester 1 (Integrated Skills)
 * - Module English-02: Communicative English for Muslim University Students - Semester 2 (Productive Skills)
 * Author: Abdul Muhit, M.Pd (Universitas PTIQ Jakarta)
 * Publisher: Lembaga Bahasa & Budaya Universitas PTIQ Jakarta, 2026
 */

export interface CurriculumUnit {
  id: string;
  semester: 1 | 2;
  unitNumber: number;
  title: string;
  subtitle: string;
  cefrLevel: string;
  theme: string;
  pdfPage: number;
  learningOutcomes: string[];
  speakingFocus: string;
  writingFocus: string;
  grammarFocus: {
    topic: string;
    rules: string[];
    examples: string[];
  };
  academicVocabulary: Array<{
    word: string;
    meaning: string;
    example?: string;
  }>;
  usefulExpressions: Array<{
    category: string;
    phrases: string[];
  }>;
  quranicInsight: {
    surah: string;
    verse: string;
    arabic: string;
    translation: string;
    reflection: string;
  };
  modelDialogueOrText: {
    title: string;
    content: string;
  };
  samplePracticePrompt: string;
}

export interface EnglishModule {
  id: 'english-01' | 'english-02';
  semester: 1 | 2;
  title: string;
  subTitle: string;
  author: string;
  institution: string;
  year: number;
  cefrLevel: string;
  pdfUrl: string;
  description: string;
  coreCompetencies: string[];
  units: CurriculumUnit[];
}

export const ENGLISH_MODULE_01: EnglishModule = {
  id: 'english-01',
  semester: 1,
  title: 'English I: Integrated Skills',
  subTitle: 'Communicative English for Muslim University Students (Semester 1)',
  author: 'Abdul Muhit, M.Pd',
  institution: 'Universitas PTIQ Jakarta (Lembaga Bahasa & Budaya)',
  year: 2026,
  cefrLevel: 'CEFR A1-A2',
  pdfUrl: '/assets/aistudio/ENGLISH-01_REVISED_d91bdfc6.pdf',
  description:
    'Modul dasar terintegrasi untuk mahasiswa muslim semester 1. Menggabungkan penguasaan 4 keterampilan berbahasa (Listening, Speaking, Reading, Writing) berlandaskan nilai-nilai Qurani dan adab kehidupan Ma’had.',
  coreCompetencies: [
    'Berkomunikasi secara percaya diri dalam situasi akademik & ma’had sehari-hari',
    'Menginternalisasi nilai-nilai Islam dalam percakapan dan pergaulan',
    'Membangun jejaring pertemanan dan kontribusi positif bagi umat',
  ],
  units: [
    {
      id: 'sem1-u1',
      semester: 1,
      unitNumber: 1,
      title: 'Getting to Know Each Other',
      subtitle: 'Meeting New Friends at Universitas PTIQ Jakarta',
      cefrLevel: 'CEFR A1',
      theme: 'Persaudaraan (Ukhuwah) dan Perkenalan Awal di Kampus',
      pdfPage: 8,
      learningOutcomes: [
        'Introduce yourself confidently in academic & Islamic settings',
        'Greet lecturers and classmates politely',
        'Ask and answer simple personal questions',
        'Spell your name correctly',
        'Introduce a friend to others',
      ],
      speakingFocus: 'Greetings and self-introductions in pairs and small groups',
      writingFocus: 'Short introduction profile paragraph & introduction card',
      grammarFocus: {
        topic: 'Subject Pronouns (I, you, he, she, it, we, they) and Verb To Be (am, is, are)',
        rules: [
          "Use 'am' with 'I' (I am Ahmad).",
          "Use 'is' with 'he, she, it' (She is Aisyah, It is my book).",
          "Use 'are' with 'you, we, they' (We are classmates, They are students).",
        ],
        examples: [
          'Affirmative: I am a first-year student at PTIQ Jakarta.',
          'Negative: She is not a lecturer; she is a student.',
          'Question: Are you from Bandung? Yes, I am. / No, I am not.',
        ],
      },
      academicVocabulary: [
        { word: 'introduce', meaning: 'memperkenalkan', example: 'Let me introduce myself.' },
        { word: 'greeting', meaning: 'salam sapaan', example: 'A polite greeting starts a good friendship.' },
        { word: 'major', meaning: 'program studi', example: 'My major is Islamic Education.' },
        { word: 'faculty', meaning: 'fakultas', example: 'Faculty of Ushuluddin.' },
        { word: 'dormitory (ma’had)', meaning: 'asrama mahasiswa', example: 'I live in the Ma’had dormitory.' },
        { word: 'roommate', meaning: 'teman sekamar', example: 'Ahmad is my roommate.' },
      ],
      usefulExpressions: [
        {
          category: 'Greeting',
          phrases: ['Assalamu’alaikum', 'Good morning / afternoon / evening', 'Hello / Hi'],
        },
        {
          category: 'Introducing Yourself',
          phrases: ['My name is...', 'I am from...', 'I am a student of Islamic Education at PTIQ'],
        },
        {
          category: 'Polite Inquiries',
          phrases: ['Nice to meet you', 'How are you?', 'Where are you from?'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Al-Hujurat',
        verse: '49: 13',
        arabic: 'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا',
        translation:
          'Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal (ta’aruf).',
        reflection:
          'Islam mengajarkan bahwa tujuan mengenal sesama manusia adalah untuk membangun rasa hormat, kerja sama, dan persaudaraan tanpa memandang suku atau asal daerah.',
      },
      modelDialogueOrText: {
        title: 'Meeting at PTIQ: Ahmad and Aisyah',
        content: `Ahmad: Assalamu’alaikum. Hello, I am Ahmad. Let me introduce myself. I am a first-year student of Islamic Education at Universitas PTIQ Jakarta.
Aisyah: Wa’alaikumussalam. Nice to meet you, Ahmad. I am Aisyah. I study Qur’anic Studies at PTIQ Jakarta. Where are you from?
Ahmad: I am from Bogor. How about you?
Aisyah: I am from Bandung. Welcome to PTIQ!`,
      },
      samplePracticePrompt:
        'Practice Unit 1: How would you introduce yourself politely in English to your university lecturer, mentioning your name, major at PTIQ, and hometown?',
    },
    {
      id: 'sem1-u2',
      semester: 1,
      unitNumber: 2,
      title: 'Daily Activities',
      subtitle: 'A Day in the Life of a PTIQ Student',
      cefrLevel: 'CEFR A1-A2',
      theme: 'Kedisiplinan Waktu, Rutinitas Ibadah & Belajar di Ma’had',
      pdfPage: 14,
      learningOutcomes: [
        'Talk about daily routines in Ma’had and campus',
        'Tell the time accurately using British English expressions',
        'Use the Simple Present Tense for habitual actions',
        'Ask about someone’s daily schedule and respond politely',
      ],
      speakingFocus: 'Pair interviews about daily wake-up, prayer, and study routines',
      writingFocus: 'Writing 8-10 sentences describing a typical day at university',
      grammarFocus: {
        topic: 'Simple Present Tense & Telling the Time',
        rules: [
          'Add -s or -es to verbs with third-person singular subjects (He wakes up, She studies).',
          "Time: 7:00 (seven o'clock), 7:15 (quarter past seven), 7:30 (half past seven), 7:45 (quarter to eight).",
          'Adverbs of frequency: always, usually, often, sometimes, rarely, never.',
        ],
        examples: [
          'I wake up at 4:30 a.m. and perform Fajr prayer in congregation.',
          'Ahmad attends his first lecture at 7:30 a.m.',
          'They do not waste time after Maghrib; they recite the Holy Qur’an.',
        ],
      },
      academicVocabulary: [
        { word: 'wake up', meaning: 'bangun tidur', example: 'I wake up early for Subuh.' },
        { word: 'perform prayer', meaning: 'menunaikan salat', example: 'We pray in congregation.' },
        { word: 'attend class', meaning: 'mengikuti perkuliahan', example: 'I attend classes every morning.' },
        { word: 'schedule', meaning: 'jadwal kegiatan', example: 'Keep a disciplined daily schedule.' },
        { word: 'review lessons', meaning: 'mengulang pelajaran', example: 'After Isha, he reviews his lessons.' },
      ],
      usefulExpressions: [
        {
          category: 'Asking about Routine',
          phrases: ['What time do you wake up?', 'What do you do after Fajr prayer?', 'What time do your classes start?'],
        },
        {
          category: 'Stating Routine',
          phrases: ['I usually wake up at half past four.', 'At seven o’clock, I attend my morning lecture.'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Al-’Asr',
        verse: '103: 1-3',
        arabic: 'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        translation:
          'Demi masa. Sungguh, manusia berada dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.',
        reflection:
          'Waktu adalah amanah berharga dari Allah SWT. Mengatur rutinitas belajar dan ibadah dengan disiplin adalah wujud nyata menghargai nikmat waktu.',
      },
      modelDialogueOrText: {
        title: 'A Busy Day at PTIQ (Ahmad’s Schedule)',
        content: `At 4:00 a.m., Ahmad wakes up early, makes wudhu, and prays Fajr at the mosque.
At 4:30 a.m., he reads the Qur'an for thirty minutes.
At 7:30 a.m., he attends his first class: Tafsir and Hadith.
At 1:00 p.m., after Dhuhr prayer and lunch, he studies in the library.
In the afternoon, he joins the English Club meeting.`,
      },
      samplePracticePrompt:
        'Practice Unit 2: Describe your daily morning routine from Fajr until your first university lecture using Simple Present Tense.',
    },
    {
      id: 'sem1-u3',
      semester: 1,
      unitNumber: 3,
      title: 'At Campus',
      subtitle: 'Getting Around and Asking for Help',
      cefrLevel: 'CEFR A1-A2',
      theme: 'Mengenal Denah Kampus & Memberikan Petunjuk Arah yang Santun',
      pdfPage: 20,
      learningOutcomes: [
        'Ask for and give directions to campus locations politely',
        'Use prepositions of place (next to, opposite, between, across from)',
        'Understand imperative commands for directions (turn left, go straight)',
        'Foster mutual assistance and friendliness among campus members',
      ],
      speakingFocus: 'Roleplay: A visitor/new student asks for directions to the library or mosque',
      writingFocus: 'Writing a short step-by-step direction paragraph from Main Gate to library',
      grammarFocus: {
        topic: 'Prepositions of Place & Imperatives',
        rules: [
          'Prepositions of place: on the second floor, next to the library, behind the auditorium, between the office and the mosque.',
          'Imperatives for directions use base form of the verb without subject: Go straight, Turn right, Walk past the fountain.',
        ],
        examples: [
          'Excuse me, where is the university library located?',
          'Go straight from the main gate, then turn left at the fountain. It is on your right.',
        ],
      },
      academicVocabulary: [
        { word: 'library', meaning: 'perpustakaan', example: 'The library has digital journal access.' },
        { word: 'auditorium (aula)', meaning: 'gedung serbaguna', example: 'The seminar is in the auditorium.' },
        { word: 'administration office', meaning: 'kantor rektorat/tata usaha', example: 'Submit forms at the admin office.' },
        { word: 'corridor', meaning: 'lorong gedung', example: 'Walk down this corridor.' },
        { word: 'opposite / across from', meaning: 'berseberangan dengan', example: 'The mosque is across from the Ma’had.' },
      ],
      usefulExpressions: [
        {
          category: 'Asking for Directions',
          phrases: ['Excuse me, could you tell me where the library is?', 'Is it far from here?'],
        },
        {
          category: 'Giving Directions',
          phrases: ['Go straight ahead.', 'Turn left / turn right.', 'It is next to the Language Center.'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Al-Baqarah',
        verse: '2: 158',
        arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        translation: 'Maka sesungguhnya beserta kesulitan ada kemudahan.',
        reflection: 'Menolong sesama yang kebingungan mencari arah di kampus merupakan sedekah dan cerminan akhlak mulia seorang penuntut ilmu.',
      },
      modelDialogueOrText: {
        title: 'Asking Directions: Alex & Rizal',
        content: `Alex: Excuse me, could you tell me where the library is?
Rizal: Sure! Go straight from the main gate. Turn left at the first corner and walk past the mosque. The library is on your right, next to the Language Center.
Alex: Is it far from here?
Rizal: Not really, it is just about a five-minute walk.
Alex: Thank you so much!
Rizal: You are welcome. Let me know if you need more help.`,
      },
      samplePracticePrompt:
        'Practice Unit 3: Give step-by-step directions from the PTIQ Main Gate to the Language Center and Mosque.',
    },
    {
      id: 'sem1-u4',
      semester: 1,
      unitNumber: 4,
      title: 'In the Classroom',
      subtitle: 'Asking and Answering in Class',
      cefrLevel: 'CEFR A1-A2',
      theme: 'Adab Bertanya & Berkomunikasi Sopan di Ruang Kuliah',
      pdfPage: 26,
      learningOutcomes: [
        'Understand and use common academic classroom expressions',
        'Ask for permission using modal verbs (can, could, may)',
        'Politely ask lecturers for repetition and clarification',
        'Formulate accurate Wh-questions during class discussions',
      ],
      speakingFocus: 'Simulated classroom interaction with lecturers and classmates',
      writingFocus: 'Composing polite email or written notes asking for lesson clarification',
      grammarFocus: {
        topic: 'Modal Verbs of Permission & Wh-Questions',
        rules: [
          "'Can I...' = informal permission.",
          "'Could I...' = polite permission.",
          "'May I...' = formal academic permission (most respectful for lecturers).",
          'Wh-questions: What, When, Where, Who, Why, How + auxiliary verb (do/does/is/are).',
        ],
        examples: [
          'May I ask a question, Sir?',
          'Could you please repeat the explanation about the research method?',
          'Why do we use this qualitative approach?',
        ],
      },
      academicVocabulary: [
        { word: 'lecturer', meaning: 'dosen pengampu', example: 'Mr. Hasan is our English lecturer.' },
        { word: 'assignment', meaning: 'tugas kuliah', example: 'Submit the assignment before Friday.' },
        { word: 'presentation', meaning: 'presentasi kelas', example: 'We will deliver a group presentation.' },
        { word: 'clarification', meaning: 'penjelasan lebih lanjut', example: 'Ask for clarification if unsure.' },
        { word: 'permission', meaning: 'izin', example: 'Ask permission before entering the room.' },
      ],
      usefulExpressions: [
        {
          category: 'Asking Permission',
          phrases: ['May I come in, Sir?', 'May I ask a question?', 'May I leave early today?'],
        },
        {
          category: 'Asking Clarification',
          phrases: ['Could you repeat that, please?', 'What does this term mean?', 'How do you pronounce this word?'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Taha',
        verse: '20: 114',
        arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
        translation: 'Dan katakanlah: Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.',
        reflection: 'Bertanya di kelas dengan adab yang baik adalah kunci terbukanya pintu ilmu pengetahuan dan keberkahan belajar.',
      },
      modelDialogueOrText: {
        title: 'Classroom Interaction in Room 302',
        content: `Lecturer: Good morning, everyone. Today we will discuss classroom communication.
Aisyah: May I ask a question, Sir?
Lecturer: Certainly, Aisyah. Go ahead.
Bilal: Could you repeat the explanation of the third slide, please?
Lecturer: Of course. Let me explain the key terms once more.`,
      },
      samplePracticePrompt:
        'Practice Unit 4: How would you politely ask your professor for permission to submit your research paper draft one day late?',
    },
    {
      id: 'sem1-u5',
      semester: 1,
      unitNumber: 5,
      title: 'Making Friends',
      subtitle: 'Starting Conversations and Building Friendships',
      cefrLevel: 'CEFR A1-A2',
      theme: 'Membangun Sahabat Sejati & Saling Menghargai Minat Hobi',
      pdfPage: 32,
      learningOutcomes: [
        'Start friendly conversations politely with new peers',
        'Express likes, loves, and dislikes using verb + -ing (gerunds)',
        'Discuss hobbies and academic interests',
        'Introduce friends from diverse cultural regions of Indonesia',
      ],
      speakingFocus: 'Finding common interests and exchanging hobbies with peers',
      writingFocus: 'Short profile paragraph about a close university friend',
      grammarFocus: {
        topic: 'Verbs of Preference: like / love / enjoy / prefer + verb-ing',
        rules: [
          'Verbs of liking are followed by the -ing form: like reading, enjoy studying, love writing.',
          'Negative: do not like watching, does not enjoy waking up late.',
        ],
        examples: [
          'Ahmad enjoys reading Islamic history books.',
          'Siti loves drawing calligraphy and cooking traditional meals.',
          'Farhan is interested in photography and travelling.',
        ],
      },
      academicVocabulary: [
        { word: 'friendship', meaning: 'persahabatan', example: 'A good friendship is based on taqwa.' },
        { word: 'hobby / interests', meaning: 'kegemaran / minat', example: 'My hobbies are reading and swimming.' },
        { word: 'calligraphy', meaning: 'kaligrafi Islam', example: 'She practices Arabic calligraphy.' },
        { word: 'supportive', meaning: 'saling mendukung', example: 'True friends are always supportive.' },
        { word: 'hometown', meaning: 'daerah asal', example: 'Arif comes from Aceh; Farhan from Palembang.' },
      ],
      usefulExpressions: [
        {
          category: 'Conversation Starters',
          phrases: ['What do you like to do in your free time?', 'What are your hobbies?', 'That sounds interesting! Me too!'],
        },
        {
          category: 'Expressing Preference',
          phrases: ['I really enjoy reading journals.', 'I prefer writing in a quiet library.'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Al-Hujurat',
        verse: '49: 10',
        arabic: 'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ',
        translation: 'Sesungguhnya orang-orang mukmin itu bersaudara, karena itu damaikanlah antara kedua saudaramu.',
        reflection: 'Sahabat yang saleh adalah cermin bagi saudaranya yang saling mengingatkan dalam kebaikan dan ketakwaan kepada Allah.',
      },
      modelDialogueOrText: {
        title: 'New Friends at PTIQ Ma’had',
        content: `Ahmad met Arif from Aceh who enjoys playing football and reading history.
Aisyah met Siti from Lombok who loves cooking at the Ma’had kitchen.
Yusuf became friends with Farhan from Palembang who is interested in photography.
Although they come from different backgrounds, they support each other in their studies.`,
      },
      samplePracticePrompt:
        'Practice Unit 5: Share your favorite academic hobby and explain why it helps your studies, using "I enjoy..." or "I prefer...".',
    },
    {
      id: 'sem1-u6',
      semester: 1,
      unitNumber: 6,
      title: 'Food and Dining at the Ma’had',
      subtitle: 'Healthy Eating and Table Conversations',
      cefrLevel: 'CEFR A1-A2',
      theme: 'Makanan Halal-Thayyib & Adab Makan Islami',
      pdfPage: 38,
      learningOutcomes: [
        'Distinguish between countable and uncountable nouns for food and drinks',
        'Use "some" and "any" correctly in affirmative, negative, and question forms',
        'Order food politely in campus cafeterias and restaurants',
        'Apply Islamic eating etiquette (Bismillah, right hand, gratitude)',
      ],
      speakingFocus: 'Roleplay: Ordering food and drinks politely in the dining hall',
      writingFocus: 'Describing a healthy, balanced menu for university students',
      grammarFocus: {
        topic: 'Countable vs. Uncountable Nouns & Some / Any',
        rules: [
          'Countable nouns can be counted: an apple, two bananas, three eggs.',
          'Uncountable nouns cannot be pluralized: rice, water, tea, sugar, soup.',
          "Use 'some' in positive statements and polite offers ('Would you like some tea?').",
          "Use 'any' in negative statements and standard questions ('Is there any bread left?').",
        ],
        examples: [
          'I would like some rice, grilled chicken, and fresh vegetables, please.',
          'We do not have any orange juice left today.',
        ],
      },
      academicVocabulary: [
        { word: 'halal and thayyib', meaning: 'halal dan bergizi baik', example: 'Eat food that is halal and wholesome.' },
        { word: 'nutrition', meaning: 'gizi / nutrisi', example: 'Good nutrition gives energy to study.' },
        { word: 'etiquette (adab)', meaning: 'tata krama sopan santun', example: 'Islamic table manners include saying Bismillah.' },
        { word: 'beverage', meaning: 'minuman', example: 'Fresh water is the best beverage.' },
      ],
      usefulExpressions: [
        {
          category: 'Ordering Food',
          phrases: ['Could I please have...', 'I would like...', 'What do you recommend today?'],
        },
        {
          category: 'Dining Etiquette',
          phrases: ['Bismillah before eating.', 'Alhamdulillah after finishing.', 'Please pass the water.'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Al-Baqarah',
        verse: '2: 172',
        arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِن طَيِّبَاتِ مَا رَزَقْنَاكُمْ وَاشْكُرُوا لِلَّهِ',
        translation:
          'Wahai orang-orang yang beriman! Makanlah dari rezeki yang baik-baik yang Kami berikan kepadamu dan bersyukurlah kepada Allah.',
        reflection: 'Makanan yang halal dan bergizi (thayyib) tidak hanya menyehatkan jasmani, melainkan juga menunjang kejernihan akal dalam menuntut ilmu.',
      },
      modelDialogueOrText: {
        title: 'Lunch at the Ma’had Dining Hall',
        content: `Bilal: What would you like for lunch, Ahmad?
Ahmad: I would like some rice, chicken soup, and fresh vegetables, please.
Bilal: Would you like some hot tea?
Ahmad: Yes, please. Thank you.
Fatimah: Let us always remember to say Bismillah before eating and eat with our right hand.`,
      },
      samplePracticePrompt:
        'Practice Unit 6: How do you order a wholesome meal politely in English at a university canteen, using "I would like..." and "Could I have..."?',
    },
    {
      id: 'sem1-u7',
      semester: 1,
      unitNumber: 7,
      title: 'Shopping and Services',
      subtitle: 'Buying Things and Asking for Prices',
      cefrLevel: 'CEFR A1-A2',
      theme: 'Kejujuran dalam Transaksi Jual-Beli & Koperasi Kampus',
      pdfPage: 44,
      learningOutcomes: [
        'Ask about prices and product availability politely',
        'Use demonstrative pronouns (this, that, these, those)',
        'Pronounce Indonesian Rupiah amounts accurately in English',
        'Conduct ethical, polite shopping transactions',
      ],
      speakingFocus: 'Roleplay: Customer and cashier at Koperasi Universitas PTIQ Jakarta',
      writingFocus: 'Composing a shopping budget and receipt list in English',
      grammarFocus: {
        topic: 'Demonstratives (This/That/These/Those) and Numbers/Prices',
        rules: [
          "'This' (singular, near), 'That' (singular, far).",
          "'These' (plural, near), 'Those' (plural, far).",
          "Prices in Rupiah: Rp 25.000 = 'twenty-five thousand Rupiah'. Rp 150.000 = 'one hundred and fifty thousand Rupiah'.",
        ],
        examples: [
          'How much is this academic notebook?',
          'This book costs seventy-five thousand Rupiah.',
          'Can I pay using a QRIS barcode?',
        ],
      },
      academicVocabulary: [
        { word: 'cooperative store (koperasi)', meaning: 'koperasi kampus', example: 'PTIQ Cooperative Store provides stationery.' },
        { word: 'stationery', meaning: 'alat tulis kantor', example: 'I bought notebooks and pens.' },
        { word: 'receipt', meaning: 'struk tanda terima', example: 'Keep the receipt for your records.' },
        { word: 'discount', meaning: 'potongan harga', example: 'Is there a student discount?' },
        { word: 'honesty in business', meaning: 'kejujuran berniaga', example: 'Honesty brings blessings in every transaction.' },
      ],
      usefulExpressions: [
        {
          category: 'Inquiring Prices',
          phrases: ['How much is this book?', 'How much are these pens?', 'Can I pay by QR code?'],
        },
        {
          category: 'Completing Purchase',
          phrases: ['I’ll take this one, please.', 'Here is the money.', 'Thank you. Have a nice day!'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Al-Mutaffifin',
        verse: '83: 1-3',
        arabic: 'وَيْلٌ لِّلْمُطَفِّفِينَ الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ',
        translation:
          'Celakalah bagi orang-orang yang curang (dalam menakar dan menimbang)! (Yaitu) orang-orang yang apabila menerima takaran dari orang lain mereka minta dipenuhi.',
        reflection: 'Integritas dan kejujuran dalam setiap transaksi adalah pondasi muamalah yang penuh keberkahan menurut syariat Islam.',
      },
      modelDialogueOrText: {
        title: 'Buying Stationery at PTIQ Cooperative',
        content: `Ahmad: Excuse me. How much is this reference book on Islamic education?
Shop Assistant: It is seventy-five thousand Rupiah.
Ahmad: Is there any student discount?
Shop Assistant: Yes, we provide a ten percent discount for PTIQ students.
Ahmad: Wonderful! Here is my student ID. I will take this book and two notebooks.`,
      },
      samplePracticePrompt:
        'Practice Unit 7: You are buying 2 academic notebooks and 1 pen at the campus cooperative. Inquire about the price and ask if student discounts apply.',
    },
    {
      id: 'sem1-u8',
      semester: 1,
      unitNumber: 8,
      title: 'Weekend Activities',
      subtitle: 'Planning a Meaningful Weekend',
      cefrLevel: 'CEFR A1-A2',
      theme: 'Pemanfaatan Waktu Luang yang Bermakna & Rencana Masa Depan',
      pdfPage: 50,
      learningOutcomes: [
        'Discuss weekend plans and constructive activities',
        'Use "be going to" to express future plans and intentions',
        'Make, accept, and politely decline invitations',
        'Synthesize grammar and vocabulary learned across Units 1 to 7',
      ],
      speakingFocus: 'Inviting classmates to join an academic seminar, sports, or charity event',
      writingFocus: 'Writing a paragraph describing your upcoming weekend plan',
      grammarFocus: {
        topic: 'Future with "Be Going To" & Polite Invitations',
        rules: [
          "Subject + am/is/are + going to + base verb: 'I am going to visit the National Library.'",
          "Invitations: 'Would you like to join us for...?'",
          "Accepting: 'I would love to! That sounds wonderful.'",
          "Declining politely: 'I am sorry, I already have a schedule, but thank you for asking.'",
        ],
        examples: [
          'On Saturday morning, Ahmad is going to attend an Islamic lecture at the campus mosque.',
          'Would you like to come to the study group this evening?',
        ],
      },
      academicVocabulary: [
        { word: 'productive', meaning: 'produktif', example: 'Make your weekend meaningful and productive.' },
        { word: 'charity program', meaning: 'program bakti sosial', example: 'Fatimah joins an orphanage charity program.' },
        { word: 'national library', meaning: 'perpustakaan nasional', example: 'They search for research references.' },
        { word: 'invitation', meaning: 'undangan ajakan', example: 'Thank you for the kind invitation.' },
      ],
      usefulExpressions: [
        {
          category: 'Inviting Someone',
          phrases: ['What are you doing this weekend?', 'Would you like to join us?', 'Let’s go together!'],
        },
        {
          category: 'Responding to Invitations',
          phrases: ['I’d love to!', 'That sounds great.', 'I am sorry, I have an appointment.'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Al-Qasas',
        verse: '28: 77',
        arabic: 'وَابْتَغِ فِيمَا آتَاكَ اللَّهُ الدَّارَ الْآخِرَةَ وَلَا تَنسَ نَصِيبَكَ مِنَ الدُّنْيَا',
        translation:
          'Dan carilah (pahala) negeri akhirat dengan apa yang telah dianugerahkan Allah kepadamu, tetapi janganlah kamu lupakan bagianmu di dunia.',
        reflection: 'Keseimbangan antara ibadah, menuntut ilmu, kegiatan sosial, dan istirahat yang berkualitas adalah kunci kebahagiaan hidup muslim sejati.',
      },
      modelDialogueOrText: {
        title: 'A Productive Weekend Plan at PTIQ',
        content: `Ahmad: What are you going to do this weekend, Yusuf?
Yusuf: On Saturday morning, I am going to attend an Islamic lecture at the mosque. In the afternoon, Bilal and I are going to play badminton.
Ahmad: That sounds great! Aisyah and Maryam are going to visit the National Library to collect thesis references.
Yusuf: What a productive weekend!`,
      },
      samplePracticePrompt:
        'Practice Unit 8: Invite Laura to a doctoral study group meeting this Saturday using "Would you like to..." and "be going to".',
    },
  ],
};

export const ENGLISH_MODULE_02: EnglishModule = {
  id: 'english-02',
  semester: 2,
  title: 'English II: Productive Skills',
  subTitle: 'Developing Speaking and Academic Writing for Meaningful Communication (Semester 2)',
  author: 'Abdul Muhit, M.Pd',
  institution: 'Universitas PTIQ Jakarta (Lembaga Bahasa & Budaya)',
  year: 2026,
  cefrLevel: 'CEFR A2',
  pdfUrl: '/assets/aistudio/ENGLISH-02_REVISED_38467a48.pdf',
  description:
    'Modul keterampilan produktif lanjutan (Speaking & Academic Writing) untuk mahasiswa muslim semester 2. Dilengkapi strategi PREP, penulisan esai akademik, teknik presentasi, pemecahan masalah dengan musyawarah (Syura), dan integrasi AI-assisted learning.',
  coreCompetencies: [
    'Menyampaikan ide, argumen, dan presentasi akademik secara fasih dan beradab',
    'Menulis paragraf dan esai akademik terstruktur (deskriptif, proses, opini, rekomendasi, persuasif, laporan proyek)',
    'Menerapkan prinsip musyawarah Islam dalam pemecahan masalah dan negosiasi',
    'Memanfaatkan kecerdasan buatan (AI) secara etis dan bertanggung jawab dalam pembelajaran',
  ],
  units: [
    {
      id: 'sem2-u1',
      semester: 2,
      unitNumber: 1,
      title: 'Introducing Yourself Professionally',
      subtitle: 'Professional Self-Introduction in Academic and Islamic Contexts',
      cefrLevel: 'CEFR A2',
      theme: 'Perkenalan Profesional Akademik dengan Strategi PREP',
      pdfPage: 7,
      learningOutcomes: [
        'Introduce yourself professionally in academic conferences and seminars',
        'Explain academic background, research interests, and future goals clearly',
        'Apply the PREP Strategy (Point, Reason, Example, Purpose)',
        'Write a structured professional profile paragraph (120-150 words)',
        'Utilize AI speaking coaches and writing assistants ethically',
      ],
      speakingFocus: 'Delivering a 1-2 minute academic self-introduction before peers and scholars',
      writingFocus: 'Drafting an academic professional profile (120-150 words)',
      grammarFocus: {
        topic: 'Sentence Structures for Professional Profiles & Verb Consistency',
        rules: [
          'Be + Noun / Adjective: To state identity (I am a doctoral researcher).',
          'Verb (like / enjoy) + -ing: To express ongoing academic interests (I enjoy researching Islamic pedagogy).',
          'Verb (want / hope) + to + base verb: To express future goals (I hope to contribute to global education).',
          'Have + past participle (Present Perfect): To describe academic experiences (I have published two papers).',
        ],
        examples: [
          'P (Point): Let me introduce myself. I am Abdul Muhit.',
          'R (Reason): I am a doctoral student in Islamic Education because I believe education transforms society.',
          'E (Example): I have conducted fieldwork in educational institutions across Jakarta.',
          'P (Purpose): My ultimate goal is to bridge traditional Islamic values with modern research.',
        ],
      },
      academicVocabulary: [
        { word: 'professional', meaning: 'profesional / berkeahlian', example: 'Introduce yourself with professional confidence.' },
        { word: 'academic background', meaning: 'latar belakang pendidikan akademik', example: 'My academic background is in Islamic Studies.' },
        { word: 'research interest', meaning: 'bidang fokus riset yang diminati', example: 'His research interest covers curriculum design.' },
        { word: 'achievement', meaning: 'prestasi / capaian', example: 'Publishing a journal paper is a great achievement.' },
        { word: 'contribute', meaning: 'memberikan kontribusi', example: 'I want to contribute to the Muslim community.' },
        { word: 'faculty & department', meaning: 'fakultas dan jurusan', example: 'Department of Qur’anic Exegesis.' },
      ],
      usefulExpressions: [
        {
          category: 'Starting Professionally',
          phrases: ['Let me introduce myself.', 'I would like to introduce myself.', 'It is an honour to be here.'],
        },
        {
          category: 'Describing Interests & Goals',
          phrases: ['I am passionate about...', 'My primary research focus is...', 'My long-term aspiration is to...'],
        },
        {
          category: 'PREP Strategy',
          phrases: ['Point: The core idea', 'Reason: The logical justification', 'Example: Real-life evidence', 'Purpose: The future objective'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Al-Hujurat',
        verse: '49: 13',
        arabic: 'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ',
        translation:
          'Sesungguhnya orang yang paling mulia di antara kamu di sisi Allah ialah orang yang paling bertakwa di antara kamu. Sungguh, Allah Maha Mengetahui lagi Maha Teliti.',
        reflection:
          'Perkenalan profesional dalam Islam dilakukan dengan kerendahan hati (tawadhu’) dan kejujuran. Kemuliaan sejati bukan pada gelar semata, melainkan pada ketakwaan dan manfaat bagi umat.',
      },
      modelDialogueOrText: {
        title: 'Professional Profile Model: Ahmad Fauzi',
        content: `My name is Ahmad Fauzi. I am a first-year student of Islamic Education at Universitas PTIQ Jakarta.
I am deeply interested in Qur'anic studies and digital learning methodologies.
I enjoy learning English because I aspire to become an Islamic educator who can communicate internationally.
I have joined several university student organizations that help develop my leadership and communication skills.
My future goal is to pursue postgraduate research and contribute to the advancement of Islamic education in society.`,
      },
      samplePracticePrompt:
        'Practice Unit 1 (Sem 2): Introduce yourself using the PREP strategy (Point, Reason, Example, Purpose) in about 4 sentences.',
    },
    {
      id: 'sem2-u2',
      semester: 2,
      unitNumber: 2,
      title: 'Talking About Campus Life',
      subtitle: 'Communicating in Academic and Campus Environments',
      cefrLevel: 'CEFR A2',
      theme: 'Deskripsi Kehidupan Kampus & Penulisan Paragraf Deskriptif',
      pdfPage: 13,
      learningOutcomes: [
        'Describe campus life, academic activities, and campus facilities fluently',
        'Write a descriptive academic paragraph (150-180 words) with clear structure',
        'Formulate a topic sentence, supporting details, and closing sentence',
        'Use sequence connectors (first, then, after that, finally) effectively',
      ],
      speakingFocus: 'Delivering a 2-3 minute campus tour presentation for international guests',
      writingFocus: 'Descriptive paragraph: "My Campus Life at Universitas PTIQ Jakarta"',
      grammarFocus: {
        topic: 'There is / There are, Prepositions of Place & Sequence Expressions',
        rules: [
          "'There is' + singular noun ('There is a modern language laboratory on the second floor').",
          "'There are' + plural noun ('There are many student organizations at PTIQ').",
          "Sequence markers: 'First, I attend lectures. Then, I go to the library. After that, we discuss. Finally, we pray.'",
        ],
        examples: [
          'The library is a place where students learn, grow, and build their future.',
          'There is a peaceful atmosphere in the campus mosque that aids deep reflection.',
        ],
      },
      academicVocabulary: [
        { word: 'syllabus', meaning: 'silabus perkuliahan', example: 'Review the course syllabus thoroughly.' },
        { word: 'academic advisor', meaning: 'dosen pembimbing akademik (PA)', example: 'Consult your academic advisor.' },
        { word: 'timetable', meaning: 'jadwal perkuliahan', example: 'Check your weekly timetable.' },
        { word: 'extracurricular', meaning: 'kegiatan ekstrakulikuler', example: 'Joining extracurricular clubs builds soft skills.' },
        { word: 'conducive', meaning: 'kondusif untuk belajar', example: 'The campus environment is conducive to research.' },
      ],
      usefulExpressions: [
        {
          category: 'Describing Campus Facilities',
          phrases: ['Our campus provides modern facilities such as...', 'Students often gather at...'],
        },
        {
          category: 'Expressing Appreciation',
          phrases: ['Campus life here is both spiritually uplifting and academically rigorous.'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Al-Mujadilah',
        verse: '58: 11',
        arabic: 'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ',
        translation: 'Allah akan meninggikan orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat.',
        reflection:
          'Menuntut ilmu di kampus bukan sekadar meraih gelar duniawi, melainkan proses penyucian jiwa dan peningkatan derajat di sisi Allah SWT.',
      },
      modelDialogueOrText: {
        title: 'Descriptive Model: Life at Universitas PTIQ Jakarta',
        content: `Universitas PTIQ Jakarta is a place where students learn, grow, and build their future.
I study at the Faculty of Ushuluddin with a major in Tafsir and Hadith. My days are full of lectures, discussions, and assignments that help me understand Islamic knowledge better.
I usually attend lectures from 7:00 a.m. to 2:00 p.m. After class, I spend time in the library reading journals.
Sometimes, I join the English Club or join discussions with my friends in the Ma’had.
Studying here is not only about gaining knowledge, but also about building character, friendship, and spiritual responsibility.`,
      },
      samplePracticePrompt:
        'Practice Unit 2 (Sem 2): Write or speak a 3-sentence description of the facilities at your campus and how they support your studies.',
    },
    {
      id: 'sem2-u3',
      semester: 2,
      unitNumber: 3,
      title: 'Giving Directions and Explaining Procedures',
      subtitle: 'Helping Others through Clear Communication',
      cefrLevel: 'CEFR A2',
      theme: 'Penjelasan Prosedur Akademik & Paragraf Proses Step-by-Step',
      pdfPage: 19,
      learningOutcomes: [
        'Explain academic and administrative procedures logically step-by-step',
        'Write a well-organized process paragraph using sequence connectors',
        'Use modal verbs of necessity and advice (must, should, need to)',
        'Ask for and provide clarification during administrative processes',
      ],
      speakingFocus: 'Guiding an international student through registering courses or borrowing library books',
      writingFocus: 'Writing a process paragraph: "How to Borrow Books from the University Library"',
      grammarFocus: {
        topic: 'Imperatives, Sequence Connectors & Modals of Obligation',
        rules: [
          'Use chronological sequence connectors: First, Next, Then, After that, Finally.',
          'Imperatives provide direct, concise action instructions: Take a queue number; Show your student ID card.',
          'Modal verbs: You must return the book on time; You can renew it online.',
        ],
        examples: [
          'First, search for the book on the online catalog.',
          'Next, retrieve the book from the shelf and bring it to the circulation counter.',
          'Finally, make sure to note the due date slip.',
        ],
      },
      academicVocabulary: [
        { word: 'procedure', meaning: 'prosedur / tata cara', example: 'Follow the registration procedure carefully.' },
        { word: 'circulation counter', meaning: 'meja sirkulasi peminjaman', example: 'Bring your book to the circulation counter.' },
        { word: 'due date', meaning: 'tenggat pengembalian', example: 'Check the due date slip.' },
        { word: 'catalogue', meaning: 'katalog perpustakaan', example: 'Search the OPAC catalogue.' },
        { word: 'renew', meaning: 'memperpanjang masa pinjam', example: 'You can renew the book once.' },
      ],
      usefulExpressions: [
        {
          category: 'Explaining Steps',
          phrases: ['First, you need to...', 'The next step is to...', 'Make sure you do not forget to...', 'Finally, you can...'],
        },
        {
          category: 'Clarification',
          phrases: ['Could you clarify the second step?', 'Does this require prior registration?'],
        },
      ],
      quranicInsight: {
        surah: 'QS. An-Nahl',
        verse: '16: 125',
        arabic: 'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ',
        translation:
          'Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pengajaran yang baik, dan berdebatlah dengan mereka dengan cara yang baik.',
        reflection:
          'Komunikasi yang terbaik adalah yang jelas, teratur, penuh hikmah, dan membantu mempermudah urusan orang lain.',
      },
      modelDialogueOrText: {
        title: 'Process Model: How to Borrow Books from the Library',
        content: `First, visit the library and take a number at the queue machine. Then, go to the registration desk and show your student ID card.
Next, search for the book you need using the computer catalog or ask the librarian for help.
Then, bring the book to the circulation counter so the librarian can scan your barcode.
After that, the librarian will issue a due date slip.
Finally, take good care of the book and return it before the due date. You may renew it online if you need more time.`,
      },
      samplePracticePrompt:
        'Practice Unit 3 (Sem 2): Explain step-by-step how a new student can submit a thesis proposal to the academic department.',
    },
    {
      id: 'sem2-u4',
      semester: 2,
      unitNumber: 4,
      title: 'Expressing Opinions and Agreements',
      subtitle: 'Sharing Ideas in Academic Discussions',
      cefrLevel: 'CEFR A2',
      theme: 'Diskusi Akademik Santun & Esai Opini ("Should Students Use AI in Learning?")',
      pdfPage: 25,
      learningOutcomes: [
        'Express personal and academic opinions politely and persuasively',
        'Agree and disagree politely without causing offense in discussions',
        'Support opinions with sound reasons, facts, and evidence',
        'Write an opinion paragraph with topic sentence, supporting points, and conclusion',
      ],
      speakingFocus: 'Academic group debate: "Benefits and Ethical Challenges of AI in Islamic Education"',
      writingFocus: 'Opinion paragraph: "Should University Students Use AI Responsibly?"',
      grammarFocus: {
        topic: 'Opinion Phrases, Linking Words of Contrast & Cause/Effect',
        rules: [
          "Giving opinion: 'In my opinion...', 'From my perspective...', 'I believe that...'",
          "Agreeing: 'I agree completely.', 'That is a very good point.', 'I couldn’t agree more.'",
          "Disagreeing politely: 'I understand your point, but...', 'May I offer another perspective?'",
          'Linking words: because, therefore, however, furthermore, on the other hand.',
        ],
        examples: [
          'In my opinion, AI tools are very beneficial if used as an assistant rather than a replacement.',
          'I see what you mean; however, students must maintain critical thinking.',
        ],
      },
      academicVocabulary: [
        { word: 'perspective / viewpoint', meaning: 'sudut pandang', example: 'Consider the issue from multiple perspectives.' },
        { word: 'evidence', meaning: 'bukti pendukung', example: 'Support your claims with empirical evidence.' },
        { word: 'ethical', meaning: 'beretika / bermoral', example: 'Ethical use of AI preserves academic integrity.' },
        { word: 'critical thinking', meaning: 'berpikir kritis', example: 'Do not let AI replace your critical thinking.' },
        { word: 'consensus', meaning: 'kesepakatan mufakat', example: 'We reached a respectful consensus.' },
      ],
      usefulExpressions: [
        {
          category: 'Sharing Opinions',
          phrases: ['In my opinion...', 'From an academic perspective...', 'I strongly believe that...'],
        },
        {
          category: 'Polite Disagreement',
          phrases: ['I understand your point, but...', 'I see it a little differently because...', 'That is true; however...'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Ali ’Imran',
        verse: '3: 159',
        arabic: 'فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ',
        translation:
          'Maka berkat rahmat Allah engkau (Muhammad) berlaku lemah lembut terhadap mereka. Sekiranya engkau bersikap keras dan berhati kasar, tentulah mereka menjauhkan diri dari sekitarmu.',
        reflection:
          'Diskusi yang berbobot dibangun di atas dasar kelemahlembutan, saling mendengarkan secara tulus, dan menghargai keragaman pendapat.',
      },
      modelDialogueOrText: {
        title: 'Opinion Model: Should University Students Use AI Responsibly?',
        content: `In my opinion, university students should use AI responsibly in their learning.
First, AI can help students understand complex academic concepts quickly and summarize lengthy literature.
Second, AI saves valuable time by assisting with grammar checks and brainstorming research ideas.
However, there are also challenges: students may become overly dependent and stop exercising deep critical thought.
Therefore, students need to verify AI outputs and treat AI as a supportive tool, not a substitute for scholarly effort.
In conclusion, AI is highly beneficial when utilized wisely and ethically.`,
      },
      samplePracticePrompt:
        'Practice Unit 4 (Sem 2): Give your opinion on whether AI helps or hinders doctoral research, using "In my opinion...", "However...", and "Therefore...".',
    },
    {
      id: 'sem2-u5',
      semester: 2,
      unitNumber: 5,
      title: 'Delivering Academic Presentations',
      subtitle: 'Presenting Ideas with Confidence and Professionalism',
      cefrLevel: 'CEFR A2',
      theme: 'Teknik Presentasi Akademik, Bahasa Transisi & Tanya Jawab',
      pdfPage: 31,
      learningOutcomes: [
        'Open, structure, and conclude an academic presentation professionally',
        'Use signposting and transition expressions between main points',
        'Handle questions from the audience politely and authoritatively',
        'Prepare an effective, well-ordered presentation outline',
      ],
      speakingFocus: 'Delivering a 3-5 minute academic presentation on an Islamic education topic',
      writingFocus: 'Composing a structured presentation outline (Introduction, Body Points 1-3, Conclusion, Q&A)',
      grammarFocus: {
        topic: 'Future Intentions & Signposting Expressions',
        rules: [
          "Opening: 'Today, I would like to present about...', 'The purpose of my presentation is...'",
          "Signposting / Transitions: 'First, let us examine...', 'Moving on to the next point...', 'Another crucial aspect is...'",
          "Concluding: 'In summary...', 'To conclude, let me reiterate...', 'Thank you for your attention. Are there any questions?'",
        ],
        examples: [
          'First, I will explain the background of our empirical study.',
          'Let us now look at the primary findings from the field interviews.',
          'That is all from me. I would now welcome any questions or comments.',
        ],
      },
      academicVocabulary: [
        { word: 'presentation outline', meaning: 'kerangka presentasi', example: 'Draft a clear presentation outline.' },
        { word: 'signposting language', meaning: 'bahasa penunjuk arah presentasi', example: 'Signposts keep your audience engaged.' },
        { word: 'visual aids', meaning: 'alat bantu visual / slide', example: 'Use clean visual aids without clutter.' },
        { word: 'audience engagement', meaning: 'keterlibatan audiens', example: 'Make eye contact to engage your audience.' },
        { word: 'summary', meaning: 'ringkasan kesimpulan', example: 'End with a concise summary of findings.' },
      ],
      usefulExpressions: [
        {
          category: 'Opening a Presentation',
          phrases: ['Good morning/afternoon everyone.', 'Thank you for giving me this opportunity.', 'Today, I’d like to discuss...'],
        },
        {
          category: 'Transitions',
          phrases: ['First, let us consider...', 'Moving on to the second point...', 'Finally, I would like to highlight...'],
        },
        {
          category: 'Q&A Handling',
          phrases: ['Thank you for that insightful question.', 'To answer your point, our data suggests that...'],
        },
      ],
      quranicInsight: {
        surah: 'QS. An-Nahl',
        verse: '16: 125',
        arabic: 'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ',
        translation: 'Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pengajaran yang baik.',
        reflection: 'Presentasi akademik adalah sarana berbagi hikmah. Sampaikan ilmu dengan penuh kesantunan, percaya diri, dan niat ikhlas menebar kemaslahatan.',
      },
      modelDialogueOrText: {
        title: 'Model Presentation: The Importance of Reading Books',
        content: `Good morning everyone. Thank you for giving me this opportunity. Today I’d like to talk about the importance of reading books in higher education.
First, reading books expands our knowledge and exposes us to diverse scholarly worldviews.
Second, reading improves our critical thinking skills and helps us analyze complex problems.
Third, reading builds character and inspires us to become better contributing members of society.
In conclusion, reading books is essential for academic excellence. Let us make reading our lifelong daily habit.
Thank you for your attention. Are there any questions?`,
      },
      samplePracticePrompt:
        'Practice Unit 5 (Sem 2): Deliver the opening statement of an academic presentation introducing your doctoral research topic.',
    },
    {
      id: 'sem2-u6',
      semester: 2,
      unitNumber: 6,
      title: 'Problem Solving and Decision Making',
      subtitle: 'Working Together to Find the Best Solution',
      cefrLevel: 'CEFR A2',
      theme: 'Prinsip Musyawarah (Syura) dalam Menyelesaikan Masalah Kampus',
      pdfPage: 37,
      learningOutcomes: [
        'Identify problems clearly and analyze their root causes',
        'Suggest solutions using modal verbs (should, ought to, had better)',
        'Participate in constructive decision-making through Islamic Shura',
        'Write a recommendation paragraph proposing actionable solutions',
      ],
      speakingFocus: 'Team discussion: Proposing solutions to increase student participation in campus English Day',
      writingFocus: 'Recommendation paragraph: "How to Improve Academic English Culture at PTIQ"',
      grammarFocus: {
        topic: 'Modal Verbs for Recommendations & Connectors of Reason and Result',
        rules: [
          "'Should / should not' = recommendation / advice ('We should organize more interactive workshops').",
          "'Ought to' = moral or logical obligation ('We ought to promote the program widely').",
          "'Had better' = urgent advice with potential consequences ('We had better prepare the schedule early').",
          'Connectors: because, therefore, so that, in order to.',
        ],
        examples: [
          'We should create engaging activities so that students are motivated to speak English.',
          'Therefore, I recommend forming a dedicated peer-mentoring committee.',
        ],
      },
      academicVocabulary: [
        { word: 'problem solving', meaning: 'pemecahan masalah', example: 'Collaborative problem solving yields the best results.' },
        { word: 'recommendation', meaning: 'rekomendasi / usulan saran', example: 'Submit your policy recommendations.' },
        { word: 'consultation (shūrā)', meaning: 'musyawarah mufakat', example: 'Decisions are reached through shura.' },
        { word: 'compromise', meaning: 'kompromi yang adil', example: 'Find a workable compromise.' },
        { word: 'implement', meaning: 'menerapkan / mengeksekusi', example: 'We will implement the solution next semester.' },
      ],
      usefulExpressions: [
        {
          category: 'Identifying Problems',
          phrases: ['The main challenge we face is...', 'One problem is that...', 'We need to resolve...'],
        },
        {
          category: 'Proposing Solutions',
          phrases: ['Why don’t we try...', 'How about organizing...', 'I strongly recommend that we...'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Ash-Shura',
        verse: '42: 38',
        arabic: 'وَالَّذِينَ اسْتَجَابُوا لِرَبِّهِمْ وَأَقَامُوا الصَّلَاةَ وَأَمْرُهُم شُورَىٰ بَيْنَهُمْ',
        translation: 'Dan (bagi) orang-orang yang menerima (mematuhi) seruan Tuhannya dan melaksanakan salat, sedang urusan mereka (diputuskan) dengan musyawarah antara mereka...',
        reflection: 'Musyawarah (Shura) adalah ajaran luhur Islam untuk memecahkan persoalan secara kolektif dengan menghimpun hikmah dan kecerdasan bersama.',
      },
      modelDialogueOrText: {
        title: 'Recommendation Model: Improving English Day at PTIQ',
        content: `English Day is an important program at PTIQ, but many students are not yet participating actively.
There are several ways to improve it. First, we can organize interactive games, debates, and movie nights.
Second, we should promote the program actively through social media and creative posters.
Third, giving small rewards or certificates to active participants can increase motivation.
Among these options, I recommend that we organize interactive activities and promote them widely.
If we work together, English Day will become an engaging program that everyone looks forward to.`,
      },
      samplePracticePrompt:
        'Practice Unit 6 (Sem 2): Propose a solution for doctoral students struggling with time management, using "We should...", "Furthermore...", and "Therefore...".',
    },
    {
      id: 'sem2-u7',
      semester: 2,
      unitNumber: 7,
      title: 'Negotiation and Persuasive Communication',
      subtitle: 'Building Agreement through Respectful Communication',
      cefrLevel: 'CEFR A2',
      theme: 'Komunikasi Persuasif, Negosiasi Santun & Esai Persuasi',
      pdfPage: 43,
      learningOutcomes: [
        'Negotiate politely to reach win-win solutions',
        'Persuade others using logical reasoning and credible evidence',
        'Express agreement, disagreement, and compromise with respectful language',
        'Write a persuasive academic paragraph (170-200 words)',
      ],
      speakingFocus: 'Simulated committee meeting negotiating budget and theme for an international academic seminar',
      writingFocus: 'Persuasive paragraph: "Why Every Student Should Join the English Academic Society"',
      grammarFocus: {
        topic: 'Persuasive Language, Modal Verbs & Strong Linkers',
        rules: [
          "Persuasive phrases: 'I strongly believe that...', 'It is worth noting that...', 'For these reasons...'",
          "Negotiating / Compromising: 'How about meeting halfway?', 'Would you consider...?', 'Can we compromise on...?'",
          'Connectors: because, moreover, consequently, in addition, as a result.',
        ],
        examples: [
          'I strongly believe that investing in digital library subscriptions will benefit all research scholars.',
          'Let us meet halfway: we can allocate forty percent of the budget to online resources.',
        ],
      },
      academicVocabulary: [
        { word: 'negotiate', meaning: 'bernegosiasi', example: 'Negotiate with respect and clarity.' },
        { word: 'persuade / convince', meaning: 'meyakinkan orang lain', example: 'Persuade using logic and data.' },
        { word: 'compromise', meaning: 'kompromi jalan tengah', example: 'A good compromise satisfies both parties.' },
        { word: 'stakeholder', meaning: 'pemangku kepentingan', example: 'Consult all academic stakeholders.' },
        { word: 'consensus', meaning: 'konsensus mufakat', example: 'The committee reached consensus.' },
      ],
      usefulExpressions: [
        {
          category: 'Persuading',
          phrases: ['One significant advantage is...', 'This will benefit everyone involved.', 'I strongly urge you to consider...'],
        },
        {
          category: 'Negotiating',
          phrases: ['How about meeting halfway?', 'Would you accept this alternative?', 'Let’s find a solution together.'],
        },
      ],
      quranicInsight: {
        surah: 'QS. An-Nahl',
        verse: '16: 125',
        arabic: 'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ',
        translation: 'Dan berdebatlah dengan mereka dengan cara yang paling baik.',
        reflection: 'Persuasi dalam Islam tidak boleh dilakukan dengan paksaan atau manipulasi, melainkan dengan hikmah, data yang sahih, dan budi pekerti yang luhur.',
      },
      modelDialogueOrText: {
        title: 'Persuasive Model: Why Every Student Should Join the English Club',
        content: `In my opinion, every university student should join the English Club.
First, joining the club improves our English communication skills significantly through fun interactive practices.
Moreover, the club provides opportunities to meet new friends who share the same academic enthusiasm.
These friends motivate us to learn and grow together. Members also receive chances to participate in inter-university competitions and international webinars.
These experiences build our confidence and broaden our academic horizon.
Therefore, I strongly believe that joining the English Club is an invaluable investment for our future.`,
      },
      samplePracticePrompt:
        'Practice Unit 7 (Sem 2): Persuade your department head to support an academic journal writing workshop using persuasive linkers.',
    },
    {
      id: 'sem2-u8',
      semester: 2,
      unitNumber: 8,
      title: 'Final Academic Communication Project',
      subtitle: 'Integrating Speaking and Academic Writing Skills',
      cefrLevel: 'CEFR A2',
      theme: 'Penyusunan Laporan Proyek Akademik & Sintesis Tata Bahasa Semester 2',
      pdfPage: 49,
      learningOutcomes: [
        'Integrate all productive speaking and writing skills mastered throughout Semester 2',
        'Collaborate in multidisciplinary teams to complete an academic project',
        'Write a short academic project report (Title, Introduction, Objective, Method, Findings, Recommendations, Conclusion)',
        'Present and defend project findings before an academic panel with confidence',
      ],
      speakingFocus: 'Presenting and defending the final academic project before lecturers and peers',
      writingFocus: 'Composing a complete 7-section academic project report',
      grammarFocus: {
        topic: 'Comprehensive Semester 2 Grammar Synthesis',
        rules: [
          'Past Tense (Simple): We collected empirical data last week.',
          'Present Perfect: We have analyzed the interview transcripts.',
          'Future (Will): We will implement the recommendations next term.',
          'Conditionals (Type 1): If we get more support, our research will expand.',
          'Passive Voice: The survey was conducted by the student committee.',
          'Reported Speech: The lecturer stated that the paper was thorough.',
          'Comparatives & Superlatives: This approach is more effective than previous methods.',
        ],
        examples: [
          'The objective of this project is to enhance digital literacy among Islamic education scholars.',
          'Based on our empirical findings, we recommend the adoption of blended learning.',
        ],
      },
      academicVocabulary: [
        { word: 'project report', meaning: 'laporan proyek akademik', example: 'Structure the project report into seven clear parts.' },
        { word: 'methodology', meaning: 'metodologi penelitian', example: 'We utilized a mixed qualitative methodology.' },
        { word: 'empirical findings', meaning: 'temuan empiris lapangan', example: 'Our findings indicate high student enthusiasm.' },
        { word: 'implications', meaning: 'implikasi praktis dan teoretis', example: 'Discuss the broader educational implications.' },
        { word: 'collaboration', meaning: 'kolaborasi tim', example: 'Collaboration ensures scholarly excellence.' },
      ],
      usefulExpressions: [
        {
          category: 'Presenting Findings',
          phrases: ['Our data indicates that...', 'A key finding of our research is...', 'As shown in the survey results...'],
        },
        {
          category: 'Recommending Next Steps',
          phrases: ['We strongly recommend that the department...', 'Future research should explore...'],
        },
      ],
      quranicInsight: {
        surah: 'QS. Al-Ma’idah',
        verse: '5: 2',
        arabic: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ',
        translation: 'Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan tolong-menolong dalam berbuat dosa dan permusuhan.',
        reflection: 'Kolaborasi ilmiah dan penulisan karya akademik yang bermanfaat bagi kemanusiaan adalah bentuk tolong-menolong dalam kebajikan dan takwa.',
      },
      modelDialogueOrText: {
        title: 'Project Report Excerpt: Improving English Day at PTIQ Jakarta',
        content: `Introduction: English Day is a weekly program at PTIQ Jakarta to improve student communication skills.
Objective: To identify participation challenges and propose sustainable solutions.
Method: We distributed questionnaires to 40 students and interviewed 5 language lecturers.
Findings: The main challenges were limited interactive variety and low speaking confidence.
Recommendation: Introduce debate tournaments, peer mentorship circles, and certificate incentives.
Conclusion: With strategic planning and active committee support, English Day will thrive.`,
      },
      samplePracticePrompt:
        'Practice Unit 8 (Sem 2): Draft the Objective and Method section of an academic project report regarding doctoral research at your faculty.',
    },
  ],
};

export const ALL_ENGLISH_MODULES = [ENGLISH_MODULE_01, ENGLISH_MODULE_02];
export const SEMESTER_1_UNITS = ENGLISH_MODULE_01.units;
export const SEMESTER_2_UNITS = ENGLISH_MODULE_02.units;

export function findCurriculumUnit(semester: 1 | 2, unitNumber: number): CurriculumUnit | undefined {
  const mod = semester === 1 ? ENGLISH_MODULE_01 : ENGLISH_MODULE_02;
  return mod.units.find((u) => u.unitNumber === unitNumber);
}

export function searchCurriculum(keyword: string): CurriculumUnit[] {
  const q = keyword.toLowerCase().trim();
  const allUnits = [...ENGLISH_MODULE_01.units, ...ENGLISH_MODULE_02.units];
  return allUnits.filter(
    (u) =>
      u.title.toLowerCase().includes(q) ||
      u.subtitle.toLowerCase().includes(q) ||
      u.theme.toLowerCase().includes(q) ||
      u.speakingFocus.toLowerCase().includes(q) ||
      u.writingFocus.toLowerCase().includes(q) ||
      u.grammarFocus.topic.toLowerCase().includes(q) ||
      u.academicVocabulary.some((v) => v.word.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q))
  );
}
