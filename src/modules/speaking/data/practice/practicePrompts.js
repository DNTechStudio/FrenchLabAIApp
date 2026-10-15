/**
 * Curated practice themes and suggested prompts for French oral training (A1 to C2)
 */

export const PRACTICE_PROMPTS = [
  {
    id: 'prompt-travail-01',
    category: 'Travail & Nouveaux Modes de Vie',
    title: 'Le télétravail et l’équilibre de vie',
    description: 'Partagez votre avis sur les opportunités et les limites du travail à distance pour les salariés et les entreprises.',
    sampleQuestions: [
      'Pensez-vous que le télétravail renforce ou détruit la cohésion d’équipe ?',
      'Le travail à domicile permet-il un réel équilibre entre vie privée et professionnelle ?'
    ],
    starterSentence: "À mon avis, le télétravail représente une évolution positive, mais..."
  },
  {
    id: 'prompt-ecologie-01',
    category: 'Environnement & Transition Écologique',
    title: 'La consommation responsable et le zéro déchet',
    description: 'Exprimez votre point de vue sur la responsabilité individuelle face au changement climatique par rapport aux actions des gouvernements.',
    sampleQuestions: [
      'Les petits gestes quotidiens suffisent-ils pour sauver le climat ?',
      'Faut-il imposer des sanctions financières aux pollueurs ou encourager les incitations positives ?'
    ],
    starterSentence: "Il me semble que la préservation de l'environnement requiert à la fois..."
  },
  {
    id: 'prompt-education-01',
    category: 'Éducation & Formation',
    title: 'L’intelligence artificielle à l’école et à l’université',
    description: 'Débattez sur l’intégration des outils d’IA générative dans les devoirs, les examens et la méthode d’apprentissage.',
    sampleQuestions: [
      'L’IA favorise-t-elle la paresse intellectuelle ou développe-t-elle l’esprit critique ?',
      'Comment les enseignants doivent-ils adapter leurs évaluations face à ces technologies ?'
    ],
    starterSentence: "Bien que l'intelligence artificielle suscite de nombreuses inquiétudes dans les écoles..."
  },
  {
    id: 'prompt-societe-01',
    category: 'Société & Culture',
    title: 'Les réseaux sociaux : lien social ou isolement ?',
    description: 'Analysez l’impact des plateformes numériques sur les relations humaines et la santé mentale des jeunes.',
    sampleQuestions: [
      'Les réseaux sociaux rapprochent-ils les individus ou créent-ils une fausse impression de proximité ?',
      'Seriez-vous favorable à une limitation du temps d’écran pour les mineurs ?'
    ],
    starterSentence: "D'un côté, les plateformes sociales permettent de rester en contact avec le monde entier, mais d'un autre côté..."
  },
  {
    id: 'prompt-voyage-01',
    category: 'Loisirs & Tourisme',
    title: 'Le surtourisme et la préservation du patrimoine',
    description: 'Discutez des mesures à prendre face à l’afflux massif de touristes dans les villes historiques et les sites naturels.',
    sampleQuestions: [
      'Faut-il instaurer des quotas de visiteurs pour protéger les sites emblématiques ?',
      'Comment voyager de manière plus respectueuse et durable aujourd’hui ?'
    ],
    starterSentence: "Face aux conséquences néfastes du tourisme de masse sur certaines destinations..."
  }
];

export function getPracticePromptById(id) {
  return PRACTICE_PROMPTS.find(p => p.id === id) || null;
}

export function getRandomPracticePrompt() {
  const index = Math.floor(Math.random() * PRACTICE_PROMPTS.length);
  return PRACTICE_PROMPTS[index];
}

/**
 * Generates an articulate French baseline oral answer for a given practice topic
 * @param {Object} topic 
 * @returns {string} Suggested spoken intervention
 */
export function generateSuggestedSpeech(topic) {
  if (!topic) {
    return "À mon avis, cette question soulève des enjeux très importants pour notre société. D'une part, cela apporte des opportunités certaines pour notre quotidien, mais d'autre part, nous devons rester vigilants face aux risques et trouver un équilibre adapté.";
  }

  const curatedSpeeches = {
    'prompt-travail-01': "À mon avis, le télétravail représente une évolution très positive pour l'autonomie et le bien-être des salariés. Il permet de réduire la fatigue liée aux transports quotidiens et de mieux organiser son temps. Cependant, il ne faut pas sous-estimer le risque d'isolement social et la difficulté à séparer vie privée et professionnelle. Il convient donc de trouver un juste équilibre avec un modèle hybride.",
    'prompt-ecologie-01': "Il me semble que la préservation de l'environnement requiert à la fois des petits gestes individuels comme le zéro déchet, mais aussi des mesures politiques beaucoup plus fermes. Si chaque citoyen a un rôle à jouer au quotidien, les gouvernements doivent impérativement contraindre les grandes entreprises polluantes à réduire leurs émissions pour obtenir un impact durable.",
    'prompt-education-01': "Bien que l'intelligence artificielle suscite de nombreuses inquiétudes dans le milieu éducatif, je pense qu'elle constitue un formidable outil d'apprentissage lorsqu'elle est bien encadrée. Plutôt que de l'interdire, il est essentiel d'apprendre aux étudiants à s'en servir avec un esprit critique et d'adapter les méthodes d'évaluation des enseignants.",
    'prompt-societe-01': "D'un côté, les plateformes sociales permettent de rester en contact avec le monde entier et de partager des idées enrichissantes. Mais d'un autre côté, une utilisation excessive crée souvent une fausse impression de proximité et contribue à l'isolement des jeunes. C'est pourquoi une sensibilisation aux usages numériques équilibrés est indispensable.",
    'prompt-voyage-01': "Face aux conséquences néfastes du tourisme de masse sur certaines destinations emblématiques, je trouve que la mise en place de quotas de visiteurs et de taxes écologiques est devenue une nécessité pour protéger le patrimoine naturel et culturel. Nous devons repenser notre façon de voyager en privilégiant un tourisme durable et respectueux des habitants."
  };

  if (topic.id && curatedSpeeches[topic.id]) {
    return curatedSpeeches[topic.id];
  }

  // Fallback for custom topics or new prompts
  const starter = topic.starterSentence && topic.starterSentence.trim().length > 3
    ? topic.starterSentence.replace(/\.\.\.$/, '').trim()
    : `En ce qui concerne le thème « ${topic.title || 'ce sujet'} »`;

  return `${starter}, je considère que cette thématique soulève des questions fondamentales. D'un côté, nous constatons des opportunités indéniables pour notre société, mais d'un autre côté, il existe des défis importants qu'il ne faut pas négliger. Pour y répondre efficacement, il est primordial d'adopter une démarche progressive et concertée.`;
}
