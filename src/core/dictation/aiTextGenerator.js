/**
 * Sovereign AI French Dictation Text Generator (003-dictation-input-window)
 * Generates authentic, level-calibrated French passages across CEFR levels A1, A2, B1, and B2.
 * 100% offline, zero network dependencies, instant response.
 */

import { countFrenchWords } from '../writing/wordCounter.js';

export const THEMATIC_CATEGORIES = [
  'Vie Quotidienne & Loisirs',
  'Voyage & Découverte',
  'Société & Actualité',
  'Écologie & Climat',
  'Monde du Travail & Études',
  'Culture & Gastronomie'
];

export const TOPIC_TEMPLATES = {
  A1: [
    {
      category: 'Vie Quotidienne & Loisirs',
      title: 'Une matinée ensoleillée à la boulangerie',
      sentences: [
        "Ce matin, je me réveille tôt et j'ouvre la fenêtre.",
        "Il fait très beau et le ciel est bleu.",
        "Je descends dans la rue pour acheter deux croissants chauds et une baguette dorée."
      ],
      grammar: ['Présent de l\'indicatif', 'Articles définis et indéfinis', 'Accords simples']
    },
    {
      category: 'Voyage & Découverte',
      title: 'Le premier jour à la gare',
      sentences: [
        "Paul arrive à la gare Saint-Lazare avec sa grande valise.",
        "Il cherche le train pour Rouen à dix heures.",
        "Il salue le contrôleur et monte tranquillement dans le wagon."
      ],
      grammar: ['Verbes du 1er groupe', 'Prépositions de lieu', 'Salutations']
    },
    {
      category: 'Culture & Gastronomie',
      title: 'Un café entre amis',
      sentences: [
        "Nous nous retrouvons sur la terrasse d'un petit bistrot parisien.",
        "Mon ami commande un café noir et moi un chocolat doux.",
        "Nous parlons de musique et de cinéma avec le sourire."
      ],
      grammar: ['Pronoms sujets', 'Verbes pronominaux simples', 'Vocabulaire café']
    },
    {
      category: 'Vie Quotidienne & Loisirs',
      title: 'Le dimanche au parc',
      sentences: [
        "Le dimanche, toute la famille se promène dans le jardin public.",
        "Les enfants courent sur l'herbe verte avec un petit chien blanc.",
        "Mes parents lisent le journal sur un banc en bois."
      ],
      grammar: ['Adjectifs de couleur', 'Pluriel des noms', 'Présent']
    }
  ],

  A2: [
    {
      category: 'Voyage & Découverte',
      title: 'Un week-end imprévu à Annecy',
      sentences: [
        "Le week-end dernier, nous avons décidé de partir visiter la ville d'Annecy.",
        "Quand nous sommes arrivés près du lac, le soleil brillait entre les montagnes.",
        "Nous avons loué un petit bateau pour faire le tour de l'eau claire.",
        "C'était une journée reposante et nous avons pris beaucoup de photographies."
      ],
      grammar: ['Passé composé avec être et avoir', 'Imparfait de description', 'Accords du participe passé']
    },
    {
      category: 'Vie Quotidienne & Loisirs',
      title: 'L\'organisation d\'une fête surprise',
      sentences: [
        "Hier soir, nous avons préparé une fête surprise pour l'anniversaire de Sophie.",
        "Pendant qu'elle finissait ses cours à l'université, ses amis ont décoré le salon.",
        "Dès qu'elle a ouvert la porte, tout le monde a crié de joie en lui offrant des cadeaux.",
        "Elle était très émue et nous avons partagé un délicieux gâteau au chocolat."
      ],
      grammar: ['Concordance passé composé / imparfait', 'Connecteurs temporels', 'Pronoms compléments']
    },
    {
      category: 'Culture & Gastronomie',
      title: 'La visite du musée des Beaux-Arts',
      sentences: [
        "Samedi après-midi, j'ai accompagné ma cousine au musée des Beaux-Arts de Lyon.",
        "Les salles d'exposition étaient calmes et magnifiquement éclairées par de grandes verrières.",
        "Nous nous sommes arrêtés devant un tableau impressionniste qui représentait le port de Marseille.",
        "Le guide nous a expliqué l'histoire des peintres français avec beaucoup de passion."
      ],
      grammar: ['Verbes pronominaux au passé composé', 'Adjectifs qualificatifs', 'Homophones a/à']
    },
    {
      category: 'Monde du Travail & Études',
      title: 'Mon premier stage en entreprise',
      sentences: [
        "Lundi matin, j'ai débuté mon stage de communication dans une maison d'édition.",
        "Mon tuteur m'a accueilli avec bienveillance et m'a présenté toute l'équipe.",
        "J'ai rapidement appris à rédiger les courriers électroniques et à classer les documents.",
        "Cette première semaine s'est avérée très enrichissante pour mon parcours professionnel."
      ],
      grammar: ['Passé composé', 'Accord participe passé pronominal', 'Vocabulaire professionnel']
    }
  ],

  B1: [
    {
      category: 'Écologie & Climat',
      title: 'Les initiatives citoyennes pour le climat',
      sentences: [
        "Face à l'urgence environnementale, de nombreux citoyens choisissent de modifier leurs habitudes au quotidien.",
        "Il est indispensable que nous réduisions notre consommation de plastique afin de protéger les océans.",
        "De plus en plus de familles privilégient les circuits courts et les produits issus de l'agriculture biologique.",
        "Ces gestes simples mais déterminants démontrent qu'une transition écologique solidaire demeure parfaitement réalisable.",
        "Si chacun s'engage sincèrement, nous pourrons bâtir un mode de vie plus respectueux de la nature."
      ],
      grammar: ['Subjonctif présent (il est indispensable que)', 'Connecteurs logiques (afin de, de plus en plus)', 'Hypothèse au présent (si + présent)']
    },
    {
      category: 'Société & Actualité',
      title: 'Le retour en grâce des librairies indépendantes',
      sentences: [
        "Malgré l'omniprésence du numérique, les librairies indépendantes connaissent un véritable renouveau en France.",
        "Les lecteurs apprécient les recommandations personnalisées des libraires, qui partagent leurs coups de cœur avec enthousiasme.",
        "Ces commerces de proximité constituent de précieux lieux d'échange et de convivialité dans nos quartiers.",
        "Bien que les plateformes de commerce en ligne soient rapides, rien ne remplace le plaisir de feuilleter un livre sur place.",
        "Les animations littéraires régulières attirent ainsi un public fidèle et passionné de tout âge."
      ],
      grammar: ['Opposition (bien que + subjonctif)', 'Pronoms relatifs (qui, dont)', 'Homophones ce/se, son/sont']
    },
    {
      category: 'Voyage & Découverte',
      title: 'Une randonnée sur les sentiers des Calanques',
      sentences: [
        "Partir en randonnée dans les Calanques de Marseille exige une préparation rigoureuse et un profond respect des lieux.",
        "Dès l'aube, le chemin rocailleux serpente entre les pins d'Alep et offre des panoramas époustouflants sur la Méditerranée.",
        "Il faut que les randonneurs prévoient suffisamment d'eau fraîche car le soleil provençal tape fort dès midi.",
        "Après plusieurs heures d'ascension, la découverte d'une crique sauvage aux eaux turquoise récompense tous les efforts consentis.",
        "Cette immersion en pleine nature invite à contempler la beauté fragile du littoral préservé."
      ],
      grammar: ['Subjonctif de nécessité', 'Connecteurs de cause (car)', 'Accords de participes passés employés comme adjectifs']
    },
    {
      category: 'Monde du Travail & Études',
      title: 'L\'apprentissage des langues à l\'ère moderne',
      sentences: [
        "Maîtriser une langue étrangère ne consiste plus seulement à apprendre par cœur des listes de vocabulaire.",
        "Grâce aux nouvelles méthodes interactives, les étudiants peuvent dialoguer quotidiennement avec des locuteurs natifs.",
        "Pour progresser avec constance, il est essentiel qu'on pratique l'expression orale sans craindre de commettre des erreurs.",
        "Chaque échange culturel permet d'élargir ses horizons intellectuels et de comprendre d'autres visions du monde.",
        "La persévérance demeure donc la clé maîtresse d'un apprentissage linguistique réussi et durable."
      ],
      grammar: ['Structures impersonnelles (il est essentiel que)', 'Gérondif et infinitif prépositionnel', 'Homophones c\'est/s\'est']
    }
  ],

  B2: [
    {
      category: 'Société & Actualité',
      title: 'L\'essor du télétravail et la réinvention des équilibres urbains',
      sentences: [
        "La généralisation du travail à distance a profondément reconfiguré l'organisation spatiale et temporelle de nos sociétés contemporaines.",
        "Certes, de nombreux salariés louent l'autonomie accrue et l'économie appréciable du temps jadis consacré aux transports en commun.",
        "Néanmoins, l'estompement progressif des frontières entre vie professionnelle et sphère intime engendre une charge mentale insidieuse.",
        "Il incombe dès lors aux partenaires sociaux d'instaurer des chartes contraignantes qui garantissent l'exercice effectif du droit à la déconnexion.",
        "Seule une régulation équilibrée permettra de concilier la flexibilité économique avec la préservation de la santé psychologique des travailleurs."
      ],
      grammar: ['Connecteurs de concession (certes / néanmoins)', 'Homophones grammaticaux (leur/leurs, c\'est/s\'est)', 'Voix passive et tournures soutenues', 'Subordonnées relatives et subjonctif']
    },
    {
      category: 'Écologie & Climat',
      title: 'La transition énergétique au prisme de la sobriété collective',
      sentences: [
        "Le défi climatique ne saurait être résolu par les seules innovations technologiques sans une refonte drastique de nos modes de consommation.",
        "Bien que les énergies renouvelables se développent à un rythme encourageant, la sobriété énergétique s'impose comme un impératif catégorique.",
        "Il convient de repenser l'aménagement du territoire afin de limiter l'étalement urbain et de réhabiliter le réseau ferroviaire de proximité.",
        "Chaque citoyen, conscient de sa responsabilité sociétale, est appelé à renoncer aux gaspillages futiles pour favoriser des biens durables et réparables.",
        "Par conséquent, l'avènement d'une économie circulaire et décarbonée dépend avant tout d'une volonté politique inébranlable et partagée par tous."
      ],
      grammar: ['Conditionnel présent d\'atténuation (ne saurait être)', 'Subjonctif avec bien que', 'Connecteurs logiques de conséquence (par conséquent, dès lors)']
    },
    {
      category: 'Culture & Gastronomie',
      title: 'Le patrimoine gastronomique face à l\'uniformisation mondialisée',
      sentences: [
        "Inscrit au patrimoine immatériel de l'humanité, le repas gastronomique des Français incarne bien plus qu'un simple acte de subsistance.",
        "Il constitue une célébration de la convivialité, où le respect des terroirs s'associe harmonieusement à la recherche de l'excellence culinaire.",
        "Face à l'industrialisation massive et à la prolifération de la restauration rapide, préserver ce legs ancestral représente un véritable combat culturel.",
        "Il importe que les jeunes générations soient initiées dès le plus jeune âge à la diversité gustative et aux bienfaits des produits de saison.",
        "En défendant leurs producteurs locaux, les terroirs réaffirment ainsi leur identité singulière face aux assauts de l'uniformisation globale."
      ],
      grammar: ['Subordonnées de but et de conséquence', 'Participe présent et gérondif', 'Accords complexes et vocabulaire académique B2']
    },
    {
      category: 'Monde du Travail & Études',
      title: 'L\'éthique de l\'intelligence artificielle dans le monde académique',
      sentences: [
        "L'introduction fulgurante des modèles génératifs dans l'enseignement supérieur suscite des interrogations fondamentales quant à la nature même du savoir.",
        "D'aucuns s'enthousiasment pour ces assistants virtuels capables d'accélérer la recherche documentaire et de synthétiser des corpus immenses.",
        "Toutefois, de nombreux enseignants s'inquiètent d'une atrophie de l'esprit critique et d'une dépendance cognitive préjudiciable à la rigueur méthodologique.",
        "Pour éviter que l'apprentissage ne se réduise à un simple assemblage automatisé, des protocoles d'évaluation rénovés doivent être promptement adoptés.",
        "Il s'avère donc impératif de concevoir l'intelligence artificielle comme un levier émancipateur et non comme un substitut à la pensée humaine."
      ],
      grammar: ['Subjonctif après pour éviter que (ne explétif)', 'Lexique abstrait de haut niveau', 'Connecteurs d\'opposition (toutefois, néanmoins, d\'aucuns)']
    }
  ],

  C1: [
    {
      category: 'Société & Actualité',
      title: 'L\'éloquence et la dialectique républicaine dans le débat contemporain',
      sentences: [
        "La vitalité démocratique repose fondamentalement sur la vigueur d'une parole publique libre, rigoureuse et scrupuleusement argumentée.",
        "Qu'il s'agisse de convaincre par la raison ou d'émouvoir par la rhétorique, l'orateur se doit d'allier la probité dialectique à l'écoute bienveillante de son contradicteur.",
        "Loin de se réduire à un vain artifice sophistique, l'art oratoire authentique constitue le rempart le plus solide contre les dérives populistes et les faux-semblants médiatiques.",
        "Dès lors que le dissensus civique s'exprime dans le respect mutuel, la controverse féconde devient le moteur indispensable de tout progrès sociétal durable."
      ],
      grammar: ['Subjonctif présent et imparfait', 'Structures concessives et restrictives', 'Vocabulaire rhétorique et philosophique C1']
    },
    {
      category: 'Culture & Gastronomie',
      title: 'La résonance de la mémoire involontaire dans l\'art littéraire',
      sentences: [
        "À l'instant précis où les effluves d'un thé d'antan vinrent caresser ses sens assoupis, un frisson subit traversa son être avec une intensité insoupçonnée.",
        "Cette réminiscence fortuite venait d'abolir l'usure impitoyable du temps pour exhumer des réminiscences enfouies sous les décombres de l'oubli.",
        "Les vicissitudes de l'existence perdaient instantanément leur amertume devant cette plénitude intérieure où la beauté du monde semblait enfin ressuscitée.",
        "Il comprit ainsi que le génie de l'écrivain consiste à fixer ces fulgurances éphémères pour les transmuer en vérités intemporelles et universelles."
      ],
      grammar: ['Passé simple littéraire', 'Accords du participe passé avec antéposition complexe', 'Subordonnées temporelles et de cause']
    },
    {
      category: 'Écologie & Climat',
      title: 'La métamorphose des paradigmes énergétiques et la sobriété éthique',
      sentences: [
        "L'humanité se trouve désormais confrontée à l'impérieuse nécessité de repenser l'ensemble de ses modèles productivistes face à l'épuisement des écosystèmes.",
        "L'illusion tenace d'une croissance exponentielle infinie dans un monde aux ressources finies ne saurait résister plus longtemps aux avertissements étayés des climatologues.",
        "Il incombe aux décideurs d'orchestrer une transition énergétique lucide, qui conjugue décarbonation draconienne des industries et justice redistributive.",
        "Ce tournant civilisationnel exige que l'humanité abandonne l'orgueil de la domination prométhéenne pour embrasser une éthique de la responsabilité partagée."
      ],
      grammar: ['Conditionnel présent soutenu (ne saurait résister)', 'Subjonctif après verbes d\'obligation impersonnels (il incombe... exige que)', 'Lexique abstrait de haut niveau']
    }
  ],

  C2: [
    {
      category: 'Société & Actualité',
      title: 'Les abîmes de la conscience et l\'énigme de la condition humaine',
      sentences: [
        "Il est un spectacle infiniment plus vertigineux que l'immensité de l'océan : c'est l'exploration silencieuse des profondeurs insondables de la conscience humaine.",
        "L'esprit qui sonde ses propres ténèbres découvre des abîmes où la grandeur morale côtoie continuellement la fragilité inhérente au destin des mortels.",
        "Nul ne saurait prétendre à la sagesse sans avoir bravé ce dépouillement intérieur, d'où jaillit la compassion véritable pour autrui et l'humilité philosophique.",
        "Face aux épreuves tragiques de l'histoire, la dignité de l'être s'affirme précisément dans cette souveraine capacité à opposer la droiture éthique à la barbarie aveugle."
      ],
      grammar: ['Syntaxe classique raffinée', 'Concordance des temps complexe', 'Subjonctif imparfait et tournures absolues']
    },
    {
      category: 'Monde du Travail & Études',
      title: 'L\'empire des algorithmes et la métamorphose de l\'esprit critique',
      sentences: [
        "L'omniprésence tentaculaire des systèmes prédictifs dans les sphères décisionnelles contemporaines inaugure une ère de mutation cognitive sans précédent.",
        "À mesure que l'automatisation s'arroge le monopole du calcul, l'intelligence vivante court le risque insidieux d'abdiquer son intuition poétique và sa sagacité heuristique.",
        "Quand bien même les machines égaleraient la vélocité combinatoire du cerveau, jamais elles ne sauraient éprouver le doute salvateur qui nourrit l'authentique quête de la vérité.",
        "Préserver l'intégrité de la pensée libre relève désormais d'une veille intellectuelle intransigeante face aux mirages séduisants d'un scientisme désincarné."
      ],
      grammar: ['Quand bien même + conditionnel', 'Tournures stylistiques de haute voltige', 'Vocabulaire épistémologique et philosophique C2']
    },
    {
      category: 'Culture & Gastronomie',
      title: 'L\'intemporalité de la parole poétique et la transmutation du réel',
      sentences: [
        "La poésie véritable ne se borne point à orner le langage d'artifices caducs : elle opère une alchimie prodigieuse qui transfigure le prosaïque en sublime.",
        "Sous le regard du poète, les objets les plus humbles et les silences les plus épais s'illuminent soudain d'une transcendance qui défie le néant.",
        "En restituant aux vocables leur incandescence primordiale, l'écrivain arrache la mémoire humaine à la dégradation inéluctable des siècles.",
        "Cette célébration mystérieuse de l'existence demeure l'hommage le plus éclatant que l'éphémère puisse rendre à l'éternité."
      ],
      grammar: ['Subjonctif après superlatif relatif (le plus éclatant que... puisse)', 'Négation littéraire (ne se borne point)', 'Accords stylistiques et lexique poétique d\'excellence']
    }
  ]
};

export class AITextGenerator {
  /**
   * Generates or selects a level-calibrated French passage based on user criteria.
   */
  static generateText({ level = 'B1', category = 'random' } = {}) {
    const validLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level) ? level : 'B1';
    const levelTemplates = TOPIC_TEMPLATES[validLevel] || TOPIC_TEMPLATES.B1;

    let matching = levelTemplates;
    if (category && category !== 'random') {
      const filtered = levelTemplates.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
      if (filtered.length > 0) matching = filtered;
    }

    // Pick random from candidates
    const template = matching[Math.floor(Math.random() * matching.length)];

    const fullText = template.sentences.join(' ');
    const wordCount = countFrenchWords(fullText);

    return {
      id: `ai-gen-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: template.title,
      category: template.category,
      level: validLevel,
      fullText,
      sentences: template.sentences.map((text, idx) => ({
        index: idx + 1,
        text,
        wordCount: countFrenchWords(text)
      })),
      grammarPoints: template.grammar,
      wordCount,
      sentenceCount: template.sentences.length,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Returns a random suggested topic across available categories.
   */
  static getRandomTopic() {
    const all = [
      ...TOPIC_TEMPLATES.A1,
      ...TOPIC_TEMPLATES.A2,
      ...TOPIC_TEMPLATES.B1,
      ...TOPIC_TEMPLATES.B2,
      ...TOPIC_TEMPLATES.C1,
      ...TOPIC_TEMPLATES.C2
    ];
    const picked = all[Math.floor(Math.random() * all.length)];
    return {
      title: picked.title,
      category: picked.category,
      level: Object.keys(TOPIC_TEMPLATES).find(lvl => TOPIC_TEMPLATES[lvl].includes(picked)) || 'B1'
    };
  }

  /**
   * Returns list of supported categories.
   */
  static getCategories() {
    return THEMATIC_CATEGORIES;
  }
}
