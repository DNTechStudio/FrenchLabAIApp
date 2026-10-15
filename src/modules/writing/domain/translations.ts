/**
 * Multilingual Translations Dictionary for Writing DELF B2
 * Supports: Français (fr), English (en), 中文 (zh), Tiếng Việt (vi)
 */

export type SupportedLanguage = 'fr' | 'en' | 'zh' | 'vi';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  shortLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', shortLabel: 'FR', flag: '🇫🇷' },
  { code: 'en', name: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  { code: 'zh', name: '中文', shortLabel: 'ZH', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', shortLabel: 'VI', flag: '🇻🇳' },
];

export interface AppTranslations {
  brand: {
    title: string;
    badge: string;
  };
  header: {
    engine: string;
    themeLight: string;
    themeDark: string;
    settings: string;
    coffeeLabel: string;
    coffeeTitle: string;
    language: string;
  };
  editor: {
    paneTitle: string;
    clearButton: string;
    clearConfirm: string;
    randomTopicButton: string;
    selectPromptPrompt: string;
    inputPlaceholder: string;
    targetLabel: string;
    wordsLabel: string;
    statusUnder: string;
    statusNearing: string;
    statusAchieved: string;
    minWordsTarget: string;
    contextLabel: string;
    instructionsLabel: string;
  };
  categories: {
    lettre_formelle: string;
    essai_argumentatif: string;
    article_forum: string;
  };
  comparison: {
    paneTitle: string;
    emptyTitle: string;
    emptySubtitle: string;
    tabUnified: string;
    tabOriginal: string;
    tabImproved: string;
    filterAll: string;
    overallFeedbackTitle: string;
    pedagogicalNotesTitle: string;
    copyButton: string;
    copiedButton: string;
    improveButton: string;
    analyzingButton: string;
    diffLegendRemoved: string;
    diffLegendAdded: string;
  };
  criteria: {
    sociolinguistic: string;
    coherence: string;
    grammar: string;
    vocabulary: string;
  };
  settings: {
    title: string;
    description: string;
    languageLabel: string;
    providerLabel: string;
    mockOption: string;
    geminiOption: string;
    apiKeyLabel: string;
    apiKeyPlaceholder: string;
    apiKeyHelp: string;
    saveButton: string;
    closeButton: string;
  };
  cefr: {
    selectorTitle: string;
    selectorHint: string;
    maxNotice: string;
    minNotice: string;
    windowLabel: string;
    levels: {
      A1: { name: string; desc: string };
      A2: { name: string; desc: string };
      B1: { name: string; desc: string };
      B2: { name: string; desc: string };
      C1: { name: string; desc: string };
      C2: { name: string; desc: string };
    };
  };
  dictation?: {
    tabTitle: string;
    writingModeTab: string;
    dictationModeTab: string;
    listenButton: string;
    pauseButton: string;
    replayButton: string;
    nextSentence: string;
    prevSentence: string;
    sentenceCounter: string;
    speedLabel: string;
    speedSlow: string;
    speedNormal: string;
    evaluateButton: string;
    accuracyLabel: string;
    emptyNotice: string;
    resultsTitle: string;
    mistakesBreakdown: string;
    categories: {
      accords: string;
      accents: string;
      homophones: string;
      lexique: string;
    };
  };
  tts?: {
    sectionTitle: string;
    engineLabel: string;
    voiceLabel: string;
    apiKeyHelp: string;
    testButton: string;
    testingLabel: string;
    badgeNeural: string;
    badgeLocal: string;
    engines: {
      webspeech: string;
      googleCloud: string;
      openai: string;
    };
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, AppTranslations> = {
  fr: {
    brand: {
      title: 'DELF-DALF Lab Writing',
      badge: 'Production Écrite A1-C2',
    },
    header: {
      engine: 'Moteur : ',
      themeLight: 'Activer le thème clair',
      themeDark: 'Activer le thème sombre',
      settings: 'Paramètres IA',
      coffeeLabel: 'Offrez-moi un café',
      coffeeTitle: 'Offrez-moi un café — Soutenir le projet DELF-DALF Lab Writing',
      language: 'Langue de l\'interface',
    },
    editor: {
      paneTitle: '📝 Rédaction Thématique DELF B2',
      clearButton: 'Effacer',
      clearConfirm: 'Êtes-vous sûr de vouloir effacer votre essai actuel ?',
      randomTopicButton: 'Sujet aléatoire',
      selectPromptPrompt: 'Sélectionner un sujet d\'examen...',
      inputPlaceholder: 'Rédigez votre production écrite ici en français (minimum 250 mots requis pour l\'examen DELF B2)...',
      targetLabel: 'Objectif :',
      wordsLabel: 'mots',
      statusUnder: 'Moins de 250 mots',
      statusNearing: 'Presque atteint',
      statusAchieved: 'Objectif atteint !',
      minWordsTarget: '250 mots min.',
      contextLabel: 'Contexte :',
      instructionsLabel: 'Consignes :',
    },
    categories: {
      lettre_formelle: 'Lettre formelle',
      essai_argumentatif: 'Essai argumentatif',
      article_forum: 'Article de forum',
    },
    comparison: {
      paneTitle: '✨ Analyse & Diff Visuel',
      emptyTitle: 'En attente de rédaction',
      emptySubtitle: 'Rédigez votre production écrite dans le volet de gauche, puis cliquez sur « Améliorer avec l\'IA » pour découvrir une version enrichie de niveau B2 avec analyse pédagogique.',
      tabUnified: 'Diff visuel',
      tabOriginal: 'Texte original',
      tabImproved: 'Version améliorée B2',
      filterAll: 'Tous les critères',
      overallFeedbackTitle: 'Appréciation globale du jury DELF',
      pedagogicalNotesTitle: 'Notes pédagogiques & points d\'amélioration B2',
      copyButton: 'Copier le texte amélioré',
      copiedButton: 'Copié !',
      improveButton: 'Améliorer avec l\'IA',
      analyzingButton: 'Analyse en cours...',
      diffLegendRemoved: 'Supprimé / Reformulé',
      diffLegendAdded: 'Enrichissement B2',
    },
    criteria: {
      sociolinguistic: 'Compétence sociolinguistique & registre',
      coherence: 'Cohérence & connecteurs logiques',
      grammar: 'Morphosyntaxe & structures B2',
      vocabulary: 'Richesse lexicale & précision',
    },
    settings: {
      title: 'Paramètres de l\'application',
      description: 'Configurez la langue de l\'interface et le moteur d\'intelligence artificielle pour l\'évaluation.',
      languageLabel: 'Langue de l\'interface',
      providerLabel: 'Moteur d\'amélioration IA',
      mockOption: 'Moteur Mock intégré (Gratuit, Hors-ligne, Pédagogique)',
      geminiOption: 'Google Gemini 2.0 (Requiert votre clé API)',
      apiKeyLabel: 'Clé API Google Gemini',
      apiKeyPlaceholder: 'Collez votre clé API Gemini...',
      apiKeyHelp: 'Votre clé API est stockée uniquement en local dans votre navigateur (localStorage).',
      saveButton: 'Enregistrer les paramètres',
      closeButton: 'Fermer',
    },
    cefr: {
      selectorTitle: 'Niveaux CECRL à comparer :',
      selectorHint: 'Sélectionnez 1 ou 2 niveaux',
      maxNotice: 'Maximum 2 niveaux sélectionnés pour la comparaison',
      minNotice: 'Au moins 1 niveau requis',
      windowLabel: 'Version',
      levels: {
        A1: { name: 'Découverte', desc: 'Phrases simples du quotidien, vocabulaire élémentaire' },
        A2: { name: 'Élémentaire', desc: 'Situations courantes, passé composé et imparfait simples' },
        B1: { name: 'Intermédiaire', desc: 'Discours connecté, opinions et connecteurs courants' },
        B2: { name: 'Intermédiaire supérieur', desc: 'Arguments structurés, registre soutenu (Cible DELF B2)' },
        C1: { name: 'Autonome', desc: 'Nuances stylistiques, syntaxe complexe, vocabulaire riche' },
        C2: { name: 'Maîtrise', desc: 'Éloquence académique, précision littéraire native' },
      },
    },
    dictation: {
      tabTitle: '🎧 La Dictée',
      writingModeTab: '📝 Rédaction',
      dictationModeTab: '🎧 Mode Dictée',
      listenButton: 'Écouter',
      pauseButton: 'Pause',
      replayButton: 'Réécouter (Ctrl+R)',
      nextSentence: 'Phrase suivante',
      prevSentence: 'Phrase précédente',
      sentenceCounter: 'Phrase',
      speedLabel: 'Vitesse :',
      speedSlow: '0.75x (Lente)',
      speedNormal: '1.0x (Normale)',
      evaluateButton: '🎯 Corriger ma dictée',
      accuracyLabel: 'Taux d’exactitude :',
      emptyNotice: 'Veuillez saisir votre transcription avant de lancer la correction.',
      resultsTitle: 'Diagnostic Orthographique & Grammatical',
      mistakesBreakdown: 'Répartition des erreurs :',
      categories: {
        accords: 'Accords & Grammaire',
        accents: 'Accents & Cédilles',
        homophones: 'Homophones Grammaticaux',
        lexique: 'Lexique & Ponctuation',
      },
    },
    tts: {
      sectionTitle: 'Voix de la Dictée (Synthèse Vocale)',
      engineLabel: 'Moteur de voix :',
      voiceLabel: 'Timbre & Modèle de voix :',
      apiKeyHelp: 'La clé API Gemini peut être réutilisée pour Google Cloud TTS.',
      testButton: '🔊 Tester la voix',
      testingLabel: 'Génération audio...',
      badgeNeural: 'Voix IA',
      badgeLocal: 'Voix locale',
      engines: {
        webspeech: 'Navigateur Web Speech (Gratuit & Hors-ligne)',
        googleCloud: 'Google Cloud TTS Neural2 / Studio (Haute Fidélité)',
        openai: 'OpenAI TTS (Voix Expressive)',
      },
    },
  },

  en: {
    brand: {
      title: 'DELF-DALF Lab Writing',
      badge: 'Writing Practice A1-C2',
    },
    header: {
      engine: 'Engine: ',
      themeLight: 'Switch to light theme',
      themeDark: 'Switch to dark theme',
      settings: 'AI Settings',
      coffeeLabel: 'Buy me a coffee',
      coffeeTitle: 'Buy me a coffee — Support the DELF-DALF Lab Writing project',
      language: 'Interface Language',
    },
    editor: {
      paneTitle: '📝 DELF B2 Essay Composition',
      clearButton: 'Clear',
      clearConfirm: 'Are you sure you want to clear your current essay draft?',
      randomTopicButton: 'Random Topic',
      selectPromptPrompt: 'Select an exam topic...',
      inputPlaceholder: 'Compose your French essay here (minimum 250 words required for the DELF B2 exam)...',
      targetLabel: 'Target:',
      wordsLabel: 'words',
      statusUnder: 'Under 250 words',
      statusNearing: 'Nearing target',
      statusAchieved: 'Target reached!',
      minWordsTarget: '250 words min.',
      contextLabel: 'Context:',
      instructionsLabel: 'Instructions:',
    },
    categories: {
      lettre_formelle: 'Formal letter',
      essai_argumentatif: 'Argumentative essay',
      article_forum: 'Forum article',
    },
    comparison: {
      paneTitle: '✨ Analysis & Visual Diff',
      emptyTitle: 'Awaiting your essay',
      emptySubtitle: 'Write your draft in the left pane, then click "Improve with AI" to view an enhanced B2-level version with structured pedagogical feedback.',
      tabUnified: 'Visual Diff',
      tabOriginal: 'Original Text',
      tabImproved: 'B2 Enhanced Version',
      filterAll: 'All criteria',
      overallFeedbackTitle: 'DELF Examiner\'s Overall Assessment',
      pedagogicalNotesTitle: 'Pedagogical Notes & B2 Recommendations',
      copyButton: 'Copy improved text',
      copiedButton: 'Copied!',
      improveButton: 'Improve with AI',
      analyzingButton: 'Analyzing essay...',
      diffLegendRemoved: 'Removed / Reformulated',
      diffLegendAdded: 'B2 Enhancement',
    },
    criteria: {
      sociolinguistic: 'Sociolinguistic competence & register',
      coherence: 'Coherence & logical connectors',
      grammar: 'Morphosyntax & B2 grammatical structures',
      vocabulary: 'Lexical range & precision',
    },
    settings: {
      title: 'Application Settings',
      description: 'Configure interface language and the AI engine for evaluation.',
      languageLabel: 'Interface Language',
      providerLabel: 'AI Improvement Engine',
      mockOption: 'Built-in Mock Engine (Free, Offline, Pedagogical)',
      geminiOption: 'Google Gemini 2.0 (Requires your API key)',
      apiKeyLabel: 'Google Gemini API Key',
      apiKeyPlaceholder: 'Paste your Gemini API key...',
      apiKeyHelp: 'Your API key is stored securely in your browser\'s localStorage only.',
      saveButton: 'Save Settings',
      closeButton: 'Close',
    },
    cefr: {
      selectorTitle: 'CEFR Levels to Compare:',
      selectorHint: 'Select 1 or 2 levels',
      maxNotice: 'Maximum 2 levels selected for comparison',
      minNotice: 'At least 1 level required',
      windowLabel: 'Version',
      levels: {
        A1: { name: 'Discovery', desc: 'Simple basic phrases, daily vocabulary' },
        A2: { name: 'Elementary', desc: 'Everyday situations, simple past tense' },
        B1: { name: 'Intermediate', desc: 'Connected discourse, standard opinions and connectors' },
        B2: { name: 'Upper Intermediate', desc: 'Structured arguments, formal register (DELF B2 Target)' },
        C1: { name: 'Advanced', desc: 'Stylistic nuances, complex syntax, elevated vocabulary' },
        C2: { name: 'Mastery', desc: 'Academic eloquence, native literary precision' },
      },
    },
    dictation: {
      tabTitle: '🎧 French Dictation',
      writingModeTab: '📝 Essay Writing',
      dictationModeTab: '🎧 Dictation Mode',
      listenButton: 'Play',
      pauseButton: 'Pause',
      replayButton: 'Replay (Ctrl+R)',
      nextSentence: 'Next sentence',
      prevSentence: 'Previous sentence',
      sentenceCounter: 'Sentence',
      speedLabel: 'Speed:',
      speedSlow: '0.75x (Slow)',
      speedNormal: '1.0x (Normal)',
      evaluateButton: '🎯 Check My Dictation',
      accuracyLabel: 'Accuracy Rate:',
      emptyNotice: 'Please type your transcription before evaluating.',
      resultsTitle: 'Spelling & Grammar Diagnostic',
      mistakesBreakdown: 'Mistakes breakdown:',
      categories: {
        accords: 'Agreements & Grammar',
        accents: 'Accents & Diacritics',
        homophones: 'Grammatical Homophones',
        lexique: 'Vocabulary & Punctuation',
      },
    },
    tts: {
      sectionTitle: 'Dictation Voice (Text-to-Speech)',
      engineLabel: 'Voice Engine:',
      voiceLabel: 'Voice Timbre & Model:',
      apiKeyHelp: 'Gemini API key can be reused for Google Cloud TTS.',
      testButton: '🔊 Test Voice',
      testingLabel: 'Synthesizing audio...',
      badgeNeural: 'AI Voice',
      badgeLocal: 'Local Voice',
      engines: {
        webspeech: 'Browser Web Speech (Free & Offline)',
        googleCloud: 'Google Cloud TTS Neural2 / Studio (High-Fidelity)',
        openai: 'OpenAI TTS (Expressive Voice)',
      },
    },
  },

  zh: {
    brand: {
      title: 'DELF-DALF Lab Writing',
      badge: '法语写作练习 A1-C2',
    },
    header: {
      engine: '引擎：',
      themeLight: '切换到浅色模式',
      themeDark: '切换到深色模式',
      settings: 'AI 设置',
      coffeeLabel: '请我喝咖啡',
      coffeeTitle: '请我喝咖啡 — 支持 DELF-DALF Lab Writing 项目',
      language: '界面语言',
    },
    editor: {
      paneTitle: '📝 DELF B2 主题写作',
      clearButton: '清空',
      clearConfirm: '您确定要清空当前的作文草稿吗？',
      randomTopicButton: '随机题目',
      selectPromptPrompt: '选择考试题目...',
      inputPlaceholder: '在此撰写您的法语作文（DELF B2 考试要求至少 250 词）...',
      targetLabel: '目标：',
      wordsLabel: '词',
      statusUnder: '少于 250 词',
      statusNearing: '接近目标',
      statusAchieved: '达到目标！',
      minWordsTarget: '至少 250 词',
      contextLabel: '背景：',
      instructionsLabel: '要求：',
    },
    categories: {
      lettre_formelle: '正式信函',
      essai_argumentatif: '议论文',
      article_forum: '论坛文章',
    },
    comparison: {
      paneTitle: '✨ 分析与视觉对比',
      emptyTitle: '等待作文输入',
      emptySubtitle: '请在左侧撰写您的草稿，然后点击“AI 提升”即可获得润色后的 B2 高分版本及教学分析建议。',
      tabUnified: '对比视图',
      tabOriginal: '原始内容',
      tabImproved: 'B2 润色版',
      filterAll: '所有评分标准',
      overallFeedbackTitle: 'DELF 考官总体评估',
      pedagogicalNotesTitle: '针对性教学分析与改进建议',
      copyButton: '复制润色文章',
      copiedButton: '已复制！',
      improveButton: 'AI 提升',
      analyzingButton: '正在分析中...',
      diffLegendRemoved: '删除 / 重写',
      diffLegendAdded: 'B2 升级表达',
    },
    criteria: {
      sociolinguistic: '社会语言能力与语域得体度',
      coherence: '文章连贯性与逻辑连接词',
      grammar: '词法句法与复杂语法结构',
      vocabulary: '词汇丰富度与精准度',
    },
    settings: {
      title: '应用设置',
      description: '配置界面语言及用于评估作文的 AI 引擎。',
      languageLabel: '界面语言',
      providerLabel: 'AI 提升引擎',
      mockOption: '内置离线引擎（免费、无需联网、遵循教学大纲）',
      geminiOption: 'Google Gemini 2.0（需自备 API 密钥）',
      apiKeyLabel: 'Google Gemini API 密钥',
      apiKeyPlaceholder: '粘贴您的 Gemini API 密钥...',
      apiKeyHelp: '您的 API 密钥仅保存在本地浏览器中 (localStorage)，绝不上传第三方服务器。',
      saveButton: '保存设置',
      closeButton: '关闭',
    },
    cefr: {
      selectorTitle: '对比的欧标等级：',
      selectorHint: '请选择 1 或 2 个等级',
      maxNotice: '最多只能同时选择 2 个等级进行对比',
      minNotice: '至少需保留 1 个等级',
      windowLabel: '版本',
      levels: {
        A1: { name: '入门级', desc: '日常基础短语，最基本生活词汇' },
        A2: { name: '初级', desc: '常见日常情景，基础复合过去时与未完成过去时' },
        B1: { name: '中级', desc: '连贯表达，常用观点陈述与逻辑连词' },
        B2: { name: '中高级', desc: '论据严密，正式书面语体（DELF B2 考试目标）' },
        C1: { name: '高级', desc: '细腻语感，复杂句式结构与高阶词汇' },
        C2: { name: '精通级', desc: '学术级严谨雄辩，母语级文学精准度' },
      },
    },
    dictation: {
      tabTitle: '🎧 法语听写',
      writingModeTab: '📝 主题写作',
      dictationModeTab: '🎧 听写练习',
      listenButton: '播放',
      pauseButton: '暂停',
      replayButton: '重听 (Ctrl+R)',
      nextSentence: '下一句',
      prevSentence: '上一句',
      sentenceCounter: '句子',
      speedLabel: '语速：',
      speedSlow: '0.75x (较慢)',
      speedNormal: '1.0x (标准)',
      evaluateButton: '🎯 批改我的听写',
      accuracyLabel: '准确率：',
      emptyNotice: '请在提交批改前输入听写文本。',
      resultsTitle: '拼写与语法诊断报告',
      mistakesBreakdown: '错误分类统计：',
      categories: {
        accords: '性数配合与语法',
        accents: '变音符号与音符',
        homophones: '语法同音异义词',
        lexique: '词汇与标点',
      },
    },
    tts: {
      sectionTitle: '听写朗读语音 (TTS)',
      engineLabel: '语音引擎：',
      voiceLabel: '音色与模型：',
      apiKeyHelp: 'Gemini API 密钥可直接复用于 Google Cloud TTS。',
      testButton: '🔊 试听语音',
      testingLabel: '正在生成音频...',
      badgeNeural: 'AI 神经网络语音',
      badgeLocal: '本地浏览器语音',
      engines: {
        webspeech: '浏览器内置 Web Speech（免费且离线）',
        googleCloud: 'Google Cloud TTS Neural2 / Studio（高保真原生）',
        openai: 'OpenAI TTS（自然情感）',
      },
    },
  },

  vi: {
    brand: {
      title: 'DELF-DALF Lab Writing',
      badge: 'Luyện Viết A1-C2',
    },
    header: {
      engine: 'Động cơ: ',
      themeLight: 'Chuyển sang giao diện sáng',
      themeDark: 'Chuyển sang giao diện tối',
      settings: 'Cài đặt AI',
      coffeeLabel: 'Mời tôi một ly cà phê',
      coffeeTitle: 'Mời tôi một ly cà phê — Ủng hộ dự án DELF-DALF Lab Writing',
      language: 'Ngôn ngữ giao diện',
    },
    editor: {
      paneTitle: '📝 Soạn Thảo Bài Viết DELF B2',
      clearButton: 'Xóa',
      clearConfirm: 'Bạn có chắc chắn muốn xóa bản nháp bài viết hiện tại không?',
      randomTopicButton: 'Chủ đề ngẫu nhiên',
      selectPromptPrompt: 'Chọn chủ đề thi...',
      inputPlaceholder: 'Soạn thảo bài viết tiếng Pháp của bạn tại đây (yêu cầu tối thiểu 250 từ cho kỳ thi DELF B2)...',
      targetLabel: 'Mục tiêu:',
      wordsLabel: 'từ',
      statusUnder: 'Dưới 250 từ',
      statusNearing: 'Gần đạt mục tiêu',
      statusAchieved: 'Đã đạt mục tiêu!',
      minWordsTarget: 'Tối thiểu 250 từ',
      contextLabel: 'Bối cảnh:',
      instructionsLabel: 'Yêu cầu:',
    },
    categories: {
      lettre_formelle: 'Thư trang trọng',
      essai_argumentatif: 'Bài luận nghị luận',
      article_forum: 'Bài viết diễn đàn',
    },
    comparison: {
      paneTitle: '✨ Phân Tích & So Sánh Trực Quan',
      emptyTitle: 'Đang chờ bài viết',
      emptySubtitle: 'Hãy viết bản nháp ở khung bên trái, sau đó nhấn « Cải thiện với AI » để nhận phiên bản nâng cấp chuẩn B2 kèm giải thích sư phạm chi tiết.',
      tabUnified: 'So sánh trực quan',
      tabOriginal: 'Văn bản gốc',
      tabImproved: 'Bản nâng cấp B2',
      filterAll: 'Tất cả tiêu chí',
      overallFeedbackTitle: 'Nhận xét tổng thể của giám khảo DELF',
      pedagogicalNotesTitle: 'Ghi chú sư phạm & Điểm cần cải thiện chuẩn B2',
      copyButton: 'Sao chép bài đã cải thiện',
      copiedButton: 'Đã sao chép!',
      improveButton: 'Cải thiện với AI',
      analyzingButton: 'Đang phân tích...',
      diffLegendRemoved: 'Đã xóa / Viết lại',
      diffLegendAdded: 'Nâng cấp chuẩn B2',
    },
    criteria: {
      sociolinguistic: 'Năng lực ngôn ngữ xã hội & Văn phong',
      coherence: 'Tính mạch lạc & Từ nối logic',
      grammar: 'Ngữ pháp, cấu trúc câu chuẩn B2',
      vocabulary: 'Vốn từ vựng & Độ chính xác',
    },
    settings: {
      title: 'Cài đặt ứng dụng',
      description: 'Tùy chỉnh ngôn ngữ giao diện và công cụ trí tuệ nhân tạo để đánh giá bài viết.',
      languageLabel: 'Ngôn ngữ giao diện',
      providerLabel: 'Công cụ cải thiện AI',
      mockOption: 'Động cơ Mock tích hợp (Miễn phí, Ngoại tuyến, Chuẩn sư phạm)',
      geminiOption: 'Google Gemini 2.0 (Cần khóa API riêng của bạn)',
      apiKeyLabel: 'Khóa API Google Gemini',
      apiKeyPlaceholder: 'Dán khóa API Gemini của bạn...',
      apiKeyHelp: 'Khóa API chỉ được lưu trữ an toàn trong trình duyệt của bạn (localStorage).',
      saveButton: 'Lưu cài đặt',
      closeButton: 'Đóng',
    },
    cefr: {
      selectorTitle: 'Các cấp độ CECRL đối chiếu:',
      selectorHint: 'Chọn 1 hoặc 2 cấp độ',
      maxNotice: 'Tối đa chọn 2 cấp độ để so sánh đối chiếu',
      minNotice: 'Bắt buộc chọn ít nhất 1 cấp độ',
      windowLabel: 'Phiên bản',
      levels: {
        A1: { name: 'Khám phá', desc: 'Câu đơn giản, từ vựng đời sống cơ bản' },
        A2: { name: 'Sơ cấp', desc: 'Ngữ cảnh quen thuộc, quá khứ đơn giản' },
        B1: { name: 'Trung cấp', desc: 'Diễn đạt liền mạch, quan điểm và liên từ thông dụng' },
        B2: { name: 'Trung cấp nâng cao', desc: 'Lập luận chặt chẽ, văn phong trang trọng (Mục tiêu DELF B2)' },
        C1: { name: 'Cao cấp', desc: 'Sắc thái tinh tế, cú pháp phức tạp, từ vựng phong phú' },
        C2: { name: 'Thành thạo', desc: 'Phong thái học thuật xuất sắc, chuẩn xác như người bản ngữ' },
      },
    },
    dictation: {
      tabTitle: '🎧 Luyện Chính Tả',
      writingModeTab: '📝 Soạn Thảo',
      dictationModeTab: '🎧 Luyện Chính Tả',
      listenButton: 'Nghe',
      pauseButton: 'Tạm dừng',
      replayButton: 'Nghe lại (Ctrl+R)',
      nextSentence: 'Câu tiếp theo',
      prevSentence: 'Câu trước',
      sentenceCounter: 'Câu',
      speedLabel: 'Tốc độ:',
      speedSlow: '0.75x (Chậm)',
      speedNormal: '1.0x (Chuẩn)',
      evaluateButton: '🎯 Chấm bài chính tả',
      accuracyLabel: 'Độ chính xác:',
      emptyNotice: 'Vui lòng nhập nội dung nghe chép trước khi chấm bài.',
      resultsTitle: 'Chẩn Đoán Chính Tả & Ngữ Pháp',
      mistakesBreakdown: 'Phân loại lỗi sai:',
      categories: {
        accords: 'Hòa hợp giống/số & Ngữ pháp',
        accents: 'Dấu thanh âm & Dấu móc',
        homophones: 'Từ đồng âm khác nghĩa',
        lexique: 'Từ vựng & Dấu câu',
      },
    },
    tts: {
      sectionTitle: 'Giọng đọc bài chính tả (TTS)',
      engineLabel: 'Công nghệ giọng đọc:',
      voiceLabel: 'Âm sắc & Mô hình giọng:',
      apiKeyHelp: 'Khóa API Gemini có thể dùng chung cho Google Cloud TTS.',
      testButton: '🔊 Nghe thử giọng',
      testingLabel: 'Đang tạo âm thanh...',
      badgeNeural: 'Giọng AI Chuẩn',
      badgeLocal: 'Giọng cục bộ',
      engines: {
        webspeech: 'Trình duyệt Web Speech (Miễn phí & Ngoại tuyến)',
        googleCloud: 'Google Cloud TTS Neural2 / Studio (Chuẩn bản xứ)',
        openai: 'OpenAI TTS (Truyền cảm tự nhiên)',
      },
    },
  },
};

/**
 * Returns the translation dictionary for a given language code with safe fallback to 'fr'.
 */
export function getTranslation(lang?: SupportedLanguage): AppTranslations {
  if (lang && TRANSLATIONS[lang]) {
    return TRANSLATIONS[lang];
  }
  return TRANSLATIONS.fr;
}
