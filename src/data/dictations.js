/**
 * Curated French Dictation Exercises Catalog (CECRL A1 - C2)
 * Designed for authentic listening comprehension and orthographic training.
 */

export const DICTATION_EXERCISES = [
  // --- NIVEAU A1 ---
  {
    id: 'a1-rencontre-paris',
    title: 'Une première rencontre à Paris',
    level: 'A1',
    category: 'Vie Quotidienne',
    description: 'Présentation simple, salutations et coordonnées de base dans un café.',
    fullText: "Bonjour ! Je m'appelle Thomas et j'habite à Paris. J'aime beaucoup apprendre les langues. Et vous, comment vous vous appelez ?",
    author: 'French Lab A1 Studio'
  },
  {
    id: 'a1-au-marche',
    title: 'Au marché du quartier',
    level: 'A1',
    category: 'Vie Quotidienne',
    description: 'Achats simples de fruits et légumes pour le dîner.',
    fullText: "Le samedi matin, je vais au marché avec un grand panier. J'achète des pommes rouges, du pain frais et un bon fromage.",
    author: 'French Lab A1 Studio'
  },

  // --- NIVEAU A2 ---
  {
    id: 'a2-vacances-bretagne',
    title: 'Souvenir de vacances en Bretagne',
    level: 'A2',
    category: 'Voyage & Loisirs',
    description: 'Récit au passé composé et à l\'imparfait avec accords simples.',
    fullText: "L'été dernier, nous sommes partis une semaine en Bretagne. Chaque matin, le vent soufflait doucement sur la plage. Nous avons visité un vieux phare et mangé de délicieuses crêpes au beurre salé.",
    author: 'French Lab A2 Studio'
  },
  {
    id: 'a2-changement-logement',
    title: 'Mon nouveau logement',
    level: 'A2',
    category: 'Vie Quotidienne',
    description: 'Description d\'un appartement et de son environnement.',
    fullText: "J'ai enfin déménagé dans un petit appartement près de la gare. Les pièces sont calmes et très lumineuses. Mes voisins sont charmants et m'ont invité à prendre le thé hier soir.",
    author: 'French Lab A2 Studio'
  },

  // --- NIVEAU B1 ---
  {
    id: 'b1-engagement-ecologique',
    title: 'Les gestes pour la planète au quotidien',
    level: 'B1',
    category: 'Culture & Société',
    description: 'Expression de l\'opinion, conseils et subjonctif présent.',
    fullText: "Il est indispensable que chacun prenne conscience des enjeux écologiques contemporains. Trier ses déchets et privilégier les transports en commun constituent des habitudes simples mais efficaces. Si nous agissons ensemble dès aujourd'hui, nous préserverons l'avenir des générations futures.",
    author: 'French Lab B1 Studio'
  },
  {
    id: 'b1-voyage-inattendu',
    title: 'Une escale inattendue à Lyon',
    level: 'B1',
    category: 'Voyage & Loisirs',
    description: 'Narration structurée avec connecteurs temporels et accords du participe passé.',
    fullText: "Alors que notre train avait pris du retard, nous avons dû passer la nuit à Lyon. Cette escale imprévue nous a permis de découvrir les traboules du Vieux-Lyon et d'admirer la basilique de Fourvière illuminée. Les surprises de voyage s'avèrent souvent les plus mémorables.",
    author: 'French Lab B1 Studio'
  },

  // --- NIVEAU B2 ---
  {
    id: 'b2-essor-teletravail',
    title: 'L\'essor du télétravail et l\'équilibre de vie',
    level: 'B2',
    category: 'DELF-DALF',
    description: 'Texte d\'argumentation formelle type DELF B2 (homophones, accords complexes, lexique sociétal).',
    fullText: "La généralisation du travail à distance a profondément bouleversé l'organisation des entreprises. Certes, les salariés apprécient l'autonomie et le temps épargné sur les trajets quotidiens. Néanmoins, l'effacement de la frontière entre vie professionnelle et sphère privée suscite des inquiétudes légitimes. Il convient donc d'instaurer une charte éthique qui garantisse le droit effectif à la déconnexion.",
    author: 'DELF B2 Annales Officielles'
  },
  {
    id: 'b2-intelligence-artificielle',
    title: 'L\'intelligence artificielle à l\'école',
    level: 'B2',
    category: 'Culture & Société',
    description: 'Débat éducatif avec connecteurs d\'opposition et structures impersonnelles.',
    fullText: "L'introduction des technologies génératives dans le milieu scolaire soulève un vif débat parmi les pédagogues. D'un côté, ces outils interactifs favorisent une personnalisation féconde des apprentissages. De l'autre, ils risquent d'émousser l'esprit critique et d'encourager la passivité intellectuelle si leur usage n'est pas scrupuleusement encadré.",
    author: 'DELF B2 Débats Contemporains'
  },

  // --- NIVEAU C1 ---
  {
    id: 'c1-litterature-proust',
    title: 'La mémoire involontaire (D\'après Marcel Proust)',
    level: 'C1',
    category: 'Littérature',
    description: 'Style soutenu, subordonnées relatives imbriquées, accords raffinés.',
    fullText: "Mais à l'instant même où la gorgée mêlée des miettes du gâteau toucha mon palais, je tressaillis, attentif à ce qui se passait d'extraordinaire en moi. Un plaisir délicieux m'avait envahi, isolé, sans la notion de sa cause. Il m'avait aussitôt rendu les vicissitudes de la vie indifférentes, ses désastres inoffensifs, sa brièveté illusoire.",
    author: 'Marcel Proust, Du côté de chez Swann'
  },
  {
    id: 'c1-eloquence-republique',
    title: 'Éloge de l\'éloquence et du débat démocratique',
    level: 'C1',
    category: 'DELF-DALF',
    description: 'Discours rhétorique de haut niveau avec subjonctif imparfait et vocabulaire abstrait.',
    fullText: "La vitalité démocratique repose sur la vigueur d'une parole publique libre et argumentée. Qu'il s'agisse de convaincre ou de persuader, l'orateur se doit d'allier la rigueur logique à la bienveillance dialectique. Loin d'être un vain artifice, l'éloquence demeure le rempart le plus solide contre la démagogie et les faux-semblants.",
    author: 'DALF C1 Tribune Académique'
  },

  // --- NIVEAU C2 ---
  {
    id: 'c2-hugo-miserables',
    title: 'La conscience humaine (D\'après Victor Hugo)',
    level: 'C2',
    category: 'Littérature',
    description: 'Haute voltige littéraire, concordance des temps complexe, syntaxe classique.',
    fullText: "Il y a un spectacle plus grand que la mer, c'est le ciel ; il y a un spectacle plus grand que le ciel, c'est l'intérieur de l'âme. Qu'était-ce que cette figure sombre qui venait de traverser sa destinée ? Il l'examinait avec cette fixité terrible de l'esprit qui scrute les abîmes intérieurs, sans que rien d'extérieur ne pût troubler son austère méditation.",
    author: 'Victor Hugo, Les Misérables'
  }
];
