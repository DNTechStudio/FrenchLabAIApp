/**
 * Debate Topics Repository for Débat Arena (Pillar IV - PRO-07)
 * High-stakes societal, ecological, ethical, and economic controversies.
 */

export const DEBATE_TOPICS = [
  {
    id: 'ia-emploi',
    category: 'Technologie & Société',
    title: "L'Intelligence Artificielle et l'avenir de l'emploi",
    thesis: "Le déploiement massif de l'IA générative détruira plus d'emplois qualifiés qu'il n'en créera.",
    pourArguments: [
      "Automatisation rapide des professions intellectuelles (traduction, droit, programmation).",
      "Risque d'accroissement des inégalités économiques au profit des géants technologiques.",
      "Précarisation des jeunes diplômés face aux agents autonomes."
    ],
    contreArguments: [
      "Création de nouveaux métiers spécialisés et émergence de filières innovantes.",
      "Gain de productivité permettant de libérer l'humain des tâches répétitives et rébarbatives.",
      "Historiquement, chaque révolution technologique a fini par engendrer un solde net d'emplois positif."
    ],
    starterPour: "Certes, certains affirment que l'IA stimulera l'économie, mais il est incontestable qu'elle fragilise brutalement le marché du travail qualifié.",
    starterContre: "Bien que l'IA transforme indéniablement certains secteurs, il me semble réducteur d'ignorer son formidable potentiel de création de valeur et de nouveaux métiers."
  },
  {
    id: 'semaine-4-jours',
    category: 'Travail & Économie',
    title: "La semaine de travail de 4 jours (32 heures sans perte de salaire)",
    thesis: "La généralisation de la semaine de 4 jours est une nécessité sociale et écologique.",
    pourArguments: [
      "Amélioration majeure de la santé mentale et réduction drastique du burn-out.",
      "Diminution de l'empreinte carbone liée aux déplacements pendulaires.",
      "Gain d'efficacité et de motivation mesuré dans de nombreuses entreprises pilotes."
    ],
    contreArguments: [
      "Perte de compétitivité pour les PME face à la concurrence internationale.",
      "Difficulté d'application dans les services d'urgence, la santé et l'industrie continue.",
      "Risque d'intensification excessive du travail sur les 4 jours restants."
    ],
    starterPour: "La semaine de 4 jours n'est pas un luxe, c'est une mesure d'équilibre essentielle pour la santé des travailleurs et l'environnement.",
    starterContre: "Si l'idée est séduisante sur le papier, son coût économique risque de fragiliser notre tissu d'entreprises et nos services publics."
  },
  {
    id: 'vols-interieurs-train',
    category: 'Écologie & Transports',
    title: "Interdiction des vols intérieurs courts au profit du train",
    thesis: "L'État doit interdire tous les vols commerciaux dès lors qu'une alternative en train de moins de 4 heures existe.",
    pourArguments: [
      "L'aviation émet jusqu'à 80 fois plus de CO2 par passager que le train électrique.",
      "Nécessité de sobriété énergétique face à l'urgence climatique.",
      "Incitation à moderniser et baisser les tarifs des lignes ferroviaires nationales."
    ],
    contreArguments: [
      "Entrave à la liberté de circulation et désenclavement plus difficile de certaines régions.",
      "Menace sur la viabilité économique des aéroports régionaux et l'emploi aéronautique.",
      "Fiabilité parfois contestée et saturation des réseaux ferroviaires actuels."
    ],
    starterPour: "Face au péril climatique, maintenir des liaisons aériennes là où le train existe est un anachronisme injustifiable.",
    starterContre: "Interdire brutalement ces vols sans avoir préalablement fiabilisé et rendu accessible le réseau ferroviaire est une mesure punitive inefficace."
  },
  {
    id: 'reseaux-sociaux-mineurs',
    category: 'Jeunesse & Numérique',
    title: "Interdiction des réseaux sociaux aux moins de 16 ans",
    thesis: "L'accès aux plateformes algorithmiques (TikTok, Instagram) doit être strictement prohibé pour les mineurs de moins de 16 ans.",
    pourArguments: [
      "Augmentation alarmante des troubles anxio-dépressifs et du cyberharcèlement chez les adolescents.",
      "Mécanismes d'addiction prédateurs conçus pour capter l'attention sans discernement.",
      "Impact néfaste avéré sur le sommeil, la concentration scolaire et l'image corporelle."
    ],
    contreArguments: [
      "Les réseaux sociaux sont des vecteurs majeurs de socialisation, d'expression civique et de créativité.",
      "Impossibilité technique de vérification d'âge sans porter atteinte à la vie privée des internautes.",
      "La solution réside dans l'éducation aux médias plutôt que dans la prohibition autoritaire."
    ],
    starterPour: "La protection psychologique de la jeunesse exige une régulation ferme face aux algorithmes toxiques des géants du numérique.",
    starterContre: "Interdire les réseaux sociaux isole les jeunes et esquive le vrai débat qui est celui de l'éducation numérique et de la responsabilité parentale."
  },
  {
    id: 'ecriture-inclusive',
    category: 'Culture & Société',
    title: "L'usage de l'écriture inclusive dans les documents administratifs",
    thesis: "L'écriture inclusive doit être adoptée dans les communications publiques et administratives.",
    pourArguments: [
      "Démontre que la langue façonne les représentations mentales et lutte contre l'invisibilisation des femmes.",
      "Modernisation d'une règle grammaticale archaïque ('le masculin l'emporte sur le féminin').",
      "Égalité symbolique fondamentale dans une république démocratique."
    ],
    contreArguments: [
      "Complexifie inutilement la lecture, notamment pour les personnes dyslexiques ou allophones.",
      "Menace l'unité et la clarté séculaire de la langue française.",
      "Détourne l'attention des combats concrets pour l'égalité salariale et professionnelle."
    ],
    starterPour: "La langue française doit refléter l'égalité réelle des genres plutôt que de perpétuer des stéréotypes patriarcaux séculaires.",
    starterContre: "La clarté et l'universalité de la langue doivent primer sur des artifices typographiques qui nuisent à la lisibilité générale."
  }
];
