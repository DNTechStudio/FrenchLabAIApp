/**
 * TopicIdeaGenerator: AI-powered domain classifier and French DELF B2 debate prompt synthesizer
 * Analyzes rough candidate ideas in any language (Vietnamese, English, French, Chinese)
 * and generates structured practice topics.
 */

import { PRACTICE_CATEGORIES } from '../../ui/components/CustomPracticeTopicForm.js';

export const CATEGORY_KEYWORDS = {
  'Nouvelles Technologies & IA': [
    // FR
    'ia', 'intelligence artificielle', 'technologie', 'technologies', 'numérique', 'digital', 'robot', 'robots', 
    'algorithme', 'algorithmes', 'écran', 'écrans', 'smartphone', 'smartphones', 'réseau social', 'réseaux sociaux',
    // EN
    'ai', 'artificial intelligence', 'technology', 'tech', 'digital', 'algorithm', 'algorithms', 'robot', 'robots',
    'screen', 'screens', 'social media', 'internet', 'cyber', 'virtual reality', 'automation',
    // VI
    'trí tuệ nhân tạo', 'công nghệ', 'kỹ thuật số', 'mạng xã hội', 'máy tính', 'thuật toán', 'màn hình', 'điện thoại', 'tự động hóa',
    // ZH
    '人工智能', '科技', '网络', '社交媒体', '算法', '数字', '智能', '自动化'
  ],
  'Éducation & Formation': [
    // FR
    'éducation', 'école', 'université', 'lycée', 'collège', 'étudiant', 'étudiants', 'élève', 'élèves', 
    'professeur', 'professeurs', 'enseignant', 'enseignants', 'apprentissage', 'devoirs', 'examens', 'cours en ligne',
    // EN
    'education', 'school', 'schools', 'university', 'college', 'student', 'students', 'teacher', 'teachers',
    'learning', 'homework', 'exams', 'online courses', 'pedagogy', 'academic',
    // VI
    'giáo dục', 'trường học', 'trường đại học', 'đại học', 'học sinh', 'sinh viên', 'giáo viên', 'học tập', 'bài tập', 'thi cử', 'đào tạo', 'giảng dạy',
    // ZH
    '教育', '学校', '大学', '学生', '教师', '学习', '考试', '学术', '培训'
  ],
  'Environnement & Écologie': [
    // FR
    'environnement', 'écologie', 'climat', 'climatique', 'réchauffement', 'zéro déchet', 'pollution', 'déchets', 
    'voiture électrique', 'énergies renouvelables', 'transition écologique', 'biodiversité', 'planète', 'carbone',
    // EN
    'environment', 'ecology', 'climate', 'global warming', 'zero waste', 'pollution', 'waste', 
    'electric car', 'electric cars', 'electric vehicle', 'renewable energy', 'carbon', 'planet', 'green',
    // VI
    'môi trường', 'sinh thái', 'khí hậu', 'biến đổi khí hậu', 'rác thải', 'ô nhiễm', 'xe điện', 'năng lượng tái tạo', 'xanh',
    // ZH
    '环境', '生态', '气候', '全球变暖', '零废弃', '污染', '垃圾', '电动汽车', '可再生能源', '绿色'
  ],
  'Travail & Nouveaux Modes de Vie': [
    // FR
    'travail', 'télétravail', 'bureau', 'entreprise', 'salarié', 'salariés', 'emploi', 'métier', 'carrière', 
    'semaine de 4 jours', '4 jours', 'salaire', 'productivité', 'équilibre de vie', 'chômage',
    // EN
    'work', 'remote work', 'telework', 'office', 'company', 'employee', 'employees', 'job', 'jobs', 'career',
    '4-day work week', 'four day work week', 'salary', 'productivity', 'work life balance', 'employment',
    // VI
    'công việc', 'làm việc', 'làm việc từ xa', 'công sở', 'công ty', 'nhân viên', 'nghề nghiệp', 'tuần làm việc 4 ngày', 'lương', 'thất nghiệp',
    // ZH
    '工作', '远程办公', '职场', '公司', '员工', '就业', '职业', '四天工作制', '工资', '效率'
  ],
  'Santé & Bien-être': [
    // FR
    'santé', 'bien-être', 'médical', 'médecine', 'hôpital', 'stress', 'sommeil', 'sport', 'activité physique', 
    'alimentation', 'nutrition', 'maladie', 'santé mentale', 'burn-out',
    // EN
    'health', 'wellness', 'medical', 'medicine', 'hospital', 'stress', 'sleep', 'sport', 'fitness', 
    'nutrition', 'food', 'diet', 'disease', 'mental health', 'burnout',
    // VI
    'sức khỏe', 'thể chất', 'y tế', 'bệnh viện', 'căng thẳng', 'giấc ngủ', 'thể thao', 'dinh dưỡng', 'ăn uống', 'tinh thần',
    // ZH
    '健康', '医疗', '医院', '压力', '睡眠', '运动', '营养', '饮食', '心理健康', '身心'
  ],
  'Loisirs & Tourisme': [
    // FR
    'tourisme', 'surtourisme', 'voyage', 'voyages', 'voyager', 'vacances', 'loisirs', 'patrimoine', 
    'monument', 'monuments', 'avion', 'vols', 'culturel', 'destination',
    // EN
    'tourism', 'overtourism', 'travel', 'travelling', 'vacation', 'holidays', 'leisure', 'heritage', 
    'monuments', 'flight', 'airplane', 'destination',
    // VI
    'du lịch', 'du lịch đại chúng', 'quá tải du lịch', 'du hành', 'kỳ nghỉ', 'giải trí', 'di sản', 'máy bay', 'điểm đến',
    // ZH
    '旅游', '过度旅游', '旅行', '度假', '休闲', '文化遗产', '飞机', '景点'
  ],
  'Société & Culture': [
    // FR
    'société', 'culture', 'jeunes', 'jeunesse', 'famille', 'générations', 'égalité', 'femmes', 'hommes', 
    'consommation', 'surconsommation', 'mode', 'solidarité', 'citoyen',
    // EN
    'society', 'culture', 'youth', 'young people', 'family', 'generations', 'equality', 'women', 'men', 
    'consumption', 'consumerism', 'solidarity', 'citizen',
    // VI
    'xã hội', 'văn hóa', 'giới trẻ', 'thanh niên', 'gia đình', 'thế hệ', 'bình đẳng', 'tiêu dùng', 'lối sống',
    // ZH
    '社会', '文化', '青年', '年轻人', '家庭', '代际', '平等', '消费', '公民'
  ]
};

export const TRENDING_DELF_TOPICS = [
  {
    category: 'Nouvelles Technologies & IA',
    title: "L’intelligence artificielle générative : progrès pour la créativité ou menace pour l’emploi ?",
    description: "L'essor fulgurant des modèles d'intelligence artificielle transforme profondément les secteurs professionnels et artistiques. D'un côté, ces outils démultiplient l'efficacité et ouvrent des horizons novateurs. De l'autre côté, ils soulèvent des interrogations majeures sur la disparition de certains métiers et la propriété intellectuelle. Dans quelle mesure l'encadrement éthique de l'IA est-il devenu indispensable ?",
    starterSentence: "Face au développement spectaculaire de l'intelligence artificielle dans notre société, force est de constater que les opinions oscillent entre fascination et inquiétude légitime."
  },
  {
    category: 'Travail & Nouveaux Modes de Vie',
    title: "La semaine de 4 jours : véritable gain de productivité ou utopie pour les entreprises ?",
    description: "De nombreuses entreprises européennes expérimentent la réduction du temps de travail à 4 jours hebdomadaires sans baisse de salaire. Ses partisans soulignent un meilleur équilibre entre vie professionnelle et privée, ainsi qu'une fidélisation accrue. Ses détracteurs craignent en revanche une désorganisation des services et un surcroît de stress. Faut-il encourager la généralisation de ce modèle ?",
    starterSentence: "À mon sens, repenser notre rapport au temps de travail représente l'un des défis majeurs du monde économique contemporain."
  },
  {
    category: 'Éducation & Formation',
    title: "L'interdiction des smartphones dans les établissements scolaires : mesure salutaire ou recul pédagogique ?",
    description: "Face aux difficultés d'attention et aux risques de cyberharcèlement, plusieurs pays renforcent l'interdiction des écrans personnels à l'école. Si certains louent le retour à une concentration préservée et à de véritables liens sociaux, d'autres déplorent l'exclusion d'outils numériques utiles aux apprentissages du XXIe siècle. Comment l'école doit-elle concilier technologie et sérénité pédagogique ?",
    starterSentence: "Bien que le téléphone portable fasse désormais partie intégrante de la vie des jeunes, la question de sa place dans les salles de classe divise profondément éducateurs et parents."
  },
  {
    category: 'Environnement & Écologie',
    title: "La taxation des vols aériens courts : nécessité écologique ou restriction disproportionnée ?",
    description: "Pour lutter contre les émissions de gaz à effet de serre, certains gouvernements proposent d'interdire les liaisons aériennes lorsqu'une alternative ferroviaire rapide existe. D'aucuns saluent une décision environnementale courageuse et cohérente. D'autres dénoncent une atteinte à la liberté de déplacement et un préjudice pour le secteur aéronautique. Quels sacrifices sommes-nous prêts à consentir pour le climat ?",
    starterSentence: "Face à l'urgence climatique incontestable, la transition écologique nous impose aujourd'hui d'effectuer des choix collectifs exigeants."
  },
  {
    category: 'Santé & Bien-être',
    title: "La reconnaissance du droit à la déconnexion : préservation de la santé mentale au XXIe siècle",
    description: "Avec la numérisation du travail et la généralisation du télétravail, les frontières entre sphère intime et professionnelle s'estompent dangereusement, augmentant les cas d'épuisement professionnel (burn-out). Faut-il rendre obligatoire la coupure des messageries d'entreprise en dehors des horaires de travail ? Comment concilier flexibilité moderne et repos salutaire ?",
    starterSentence: "Il me semble primordial de souligner que l'hyperconnexion permanente menace directement l'équilibre psychologique des salariés."
  },
  {
    category: 'Loisirs & Tourisme',
    title: "L’instauration de quotas touristiques : sauver les sites emblématiques du surtourisme",
    description: "Face à la dégradation des écosystèmes et à la saturation des centres historiques, de plus en plus de métropoles et parcs naturels mettent en place des jauges strictes de visiteurs. Si cette régulation protège le patrimoine et la quiétude des riverains, elle est parfois perçue comme un frein à la démocratisation des voyages. Comment promouvoir un tourisme plus respectueux et durable ?",
    starterSentence: "Le tourisme de masse pose aujourd'hui un dilemme incontournable entre accessibilité culturelle et préservation indispensable de nos sites historiques."
  },
  {
    category: 'Société & Culture',
    title: "La consommation d'occasion et la seconde main : conscience environnementale ou simple impératif économique ?",
    description: "L'achat de vêtements et d'appareils de seconde main connaît un essor sans précédent, porté par les plateformes en ligne. Pour les uns, c'est l'affirmation d'une consommation circulaire et responsable. Pour d'autres, c'est principalement une stratégie d'adaptation face à l'inflation, qui peut paradoxalement encourager une surconsommation de produits bon marché. Quels sont les véritables impacts de ce modèle ?",
    starterSentence: "L'engouement actuel pour les produits d'occasion reflète une profonde mutation de nos habitudes d'achat et de notre rapport à la propriété."
  }
];

export class TopicIdeaGenerator {
  /**
   * Detects the best matching DELF category based on multilingual keyword matching
   * @param {string} text 
   * @returns {string} One of PRACTICE_CATEGORIES
   */
  static detectCategory(text) {
    if (!text || typeof text !== 'string') return PRACTICE_CATEGORIES[0];
    const normalized = text.toLowerCase();

    // Specific domain-defining compound terms have clear domain priority
    if (/mạng xã hội|social media|réseaux sociaux/i.test(normalized)) {
      return 'Nouvelles Technologies & IA';
    }

    let bestCategory = PRACTICE_CATEGORIES[0];
    let maxScore = 0;

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      let score = 0;
      for (const kw of keywords) {
        const lowerKw = kw.toLowerCase();
        // Prevent false substring match of 'xã hội' inside 'mạng xã hội'
        if (lowerKw === 'xã hội' && normalized.includes('mạng xã hội')) {
          continue;
        }
        if (lowerKw === 'society' && normalized.includes('social media')) {
          continue;
        }

        if (normalized.includes(lowerKw)) {
          const wordCount = lowerKw.split(/\s+/).length;
          score += (wordCount * 5) + lowerKw.length;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    }

    return bestCategory;
  }

  /**
   * Generates a complete, structured French DELF B2 practice topic from a rough draft in any language
   * @param {string} draftText User's rough thought or keywords
   * @returns {Object} Structured practice topic { title, category, description, starterSentence }
   */
  static generateTopicFromDraft(draftText = '') {
    const raw = (draftText || '').trim();

    // Case 1: Empty or very short draft -> Pick a trending DELF B2 topic
    if (raw.length < 3) {
      const randomIndex = Math.floor(Math.random() * TRENDING_DELF_TOPICS.length);
      const chosen = TRENDING_DELF_TOPICS[randomIndex];
      return {
        title: chosen.title,
        category: chosen.category,
        description: chosen.description,
        starterSentence: chosen.starterSentence
      };
    }

    // Case 2: User provided a draft idea -> Analyze domain and synthesize authentic DELF B2 prompt
    const detectedCategory = this.detectCategory(raw);

    // Clean draft for incorporation
    const cleanDraft = raw
      .replace(/^[\s"'\-–—]+|[\s"'\-–—]+$/g, '')
      .replace(/\s+/g, ' ');

    const topicTemplates = {
      'Nouvelles Technologies & IA': {
        title: `L'impact des technologies numériques et de l'IA : opportunité novatrice ou risque pour la société ?`,
        desc: `La question soulevée par « ${cleanDraft} » met en lumière la place prépondérante du numérique dans notre quotidien. D'un côté, les partisans soulignent les gains majeurs en termes d'innovation et d'efficacité. D'un autre côté, des voix s'élèvent contre les dérives potentielles sur la vie privée et l'esprit critique. Comment pouvons-nous encadrer ces mutations technologiques sans freiner le progrès ?`,
        starter: `Face aux transformations rapides induites par les nouvelles technologies, force est de constater que cette question suscite des débats passionnés.`
      },
      'Éducation & Formation': {
        title: `L'avenir de l'enseignement contemporain : entre méthodes traditionnelles et innovations pédagogiques`,
        desc: `La réflexion autour de « ${cleanDraft} » interroge les missions fondamentales de l'école et de l'université. D'une part, l'intégration de nouvelles approches peut dynamiser la motivation des apprenants. D'autre part, préserver la rigueur intellectuelle et l'égalité des chances demeure impératif. Quels modèles d'apprentissage devons-nous privilégier pour les générations futures ?`,
        starter: `L'éducation constitue le pilier de notre société, et à mon sens, la question des méthodes d'apprentissage mérite une attention toute particulière.`
      },
      'Environnement & Écologie': {
        title: `La transition écologique face à l'urgence environnementale : contrainte collective ou opportunité partagée ?`,
        desc: `À travers la thématique de « ${cleanDraft} », les citoyens et décideurs sont confrontés à des choix cruciaux pour notre planète. Si la nécessité d'agir rapidement fait consensus, la répartition des efforts entre initiatives individuelles et régulations gouvernementales fait débat. Quelles mesures prioritaires convient-il d'adopter pour garantir un avenir durable ?`,
        starter: `Il me semble évident que la préservation de l'environnement requiert un engagement ferme et coordonné à tous les niveaux de la société.`
      },
      'Travail & Nouveaux Modes de Vie': {
        title: `L'évolution des modes de travail : vers une plus grande autonomie ou une précarisation accrue ?`,
        desc: `Le sujet inspiré par « ${cleanDraft} » pose la question de l'équilibre entre épanouissement personnel et exigences de productivité. D'un côté, la flexibilité professionnelle répond aux aspirations des salariés modernes. De l'autre côté, l'effacement des frontières entre vie privée et professionnelle présente des risques réels. Comment réinventer l'organisation du travail de manière pérenne ?`,
        starter: `Dans un monde économique en constante mutation, je considère que repenser l'organisation du travail est devenu un impératif incontournable.`
      },
      'Santé & Bien-être': {
        title: `La santé et le bien-être au XXIe siècle : responsabilité individuelle ou enjeu de santé publique ?`,
        desc: `Les réflexions portées par « ${cleanDraft} » soulignent l'importance croissante accordée à la santé physique et mentale dans notre société. Tandis que certains préconisent des choix de vie sains et autonomes, d'autres réclament une intervention accrue des pouvoirs publics pour prévenir les risques. Quelles politiques de santé devons-nous encourager pour le bien-être de tous ?`,
        starter: `La question de la santé touche chacun d'entre nous au plus intime, et force est de constater que la prévention reste un défi majeur.`
      },
      'Loisirs & Tourisme': {
        title: `Le tourisme et les loisirs modernes : démocratisation des découvertes ou menace pour les territoires ?`,
        desc: `En abordant la question de « ${cleanDraft} », nous mesurons l'impact des déplacements récréatifs sur notre société et nos écosystèmes. D'une part, voyager enrichit les perspectives humaines et soutient les économies locales. D'autre part, la surfréquentation touristique fragilise le patrimoine et dérange les résidents. Quel équilibre trouver pour un tourisme responsable ?`,
        starter: `Face au désir grandissant d'évasion et de découverte, il convient de s'interroger sur la pérennité de nos modèles de loisirs.`
      },
      'Société & Culture': {
        title: `Les mutations socioculturelles d'aujourd'hui : vers une plus grande cohésion ou une fragmentation sociale ?`,
        desc: `Le débat ouvert par « ${cleanDraft} » touche aux dynamiques de vivre-ensemble et aux valeurs citoyennes partagées. D'un côté, la diversité des modes de vie témoigne d'une société tolérante et dynamique. D'un autre côté, les disparités économiques et générationnelles créent de nouvelles tensions. Comment renforcer le lien social dans notre communauté ?`,
        starter: `À l'heure où notre société traverse de profondes mutations culturelles, cette problématique met en lumière des enjeux collectifs fondamentaux.`
      }
    };

    const template = topicTemplates[detectedCategory] || topicTemplates['Société & Culture'];

    return {
      title: template.title,
      category: detectedCategory,
      description: template.desc,
      starterSentence: template.starter
    };
  }
}
