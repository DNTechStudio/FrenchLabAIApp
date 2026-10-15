/**
 * Situational Scenarios Repository for Daily Conversation Lab (Pillar III - PRO-07)
 * Authentic 2-Party and 3-Party Everyday Roleplays across CEFR A1-C2.
 */

export const CONVERSATION_SCENARIOS = [
  {
    id: 'cabinet-medical',
    category: 'Santé & Médical',
    title: 'Consultation chez le médecin généraliste',
    level: 'B1',
    description: 'Vous consultez un médecin suite à une fatigue persistante et des maux de tête depuis une semaine.',
    objective: 'Décrire avec précision vos symptômes, comprendre les conseils du praticien et poser des questions sur la posologie.',
    partyModeDefault: '2-party',
    characters: [
      { id: 'char-1', name: 'Dr. Martin', role: 'Médecin généraliste', avatar: '🩺', isUser: false },
      { id: 'user', name: 'Vous (Patient)', role: 'Patient(e)', avatar: '👤', isUser: true }
    ],
    threePartyCharacters: [
      { id: 'char-1', name: 'Dr. Martin', role: 'Médecin généraliste', avatar: '🩺', isUser: false },
      { id: 'char-2', name: 'Sophie', role: 'Secrétaire médicale', avatar: '📋', isUser: false },
      { id: 'user', name: 'Vous (Patient)', role: 'Patient(e)', avatar: '👤', isUser: true }
    ],
    starterA2: "Bonjour docteur, je viens parce que je me sens très fatigué depuis lundi.",
    starterB2: "Bonjour Docteur, je consulte aujourd'hui en raison d'une asthénie inhabituelle accompagnée de céphalées récurrentes depuis une semaine.",
    openingMessage: "Bonjour, entrez je vous en prie. Asseyez-vous. Dites-moi ce qui vous amène aujourd'hui ?"
  },
  {
    id: 'negociation-teletravail',
    category: 'Monde Professionnel',
    title: 'Négociation de jours de télétravail avec votre responsable',
    level: 'B2',
    description: 'Vous demandez à votre manager de passer de 1 à 3 jours de télétravail par semaine pour un projet de recherche.',
    objective: 'Argumenter sur votre productivité, rassurer sur votre disponibilité et négocier un compromis viable.',
    partyModeDefault: '2-party',
    characters: [
      { id: 'char-1', name: 'Laurent', role: 'Directeur d\'équipe', avatar: '💼', isUser: false },
      { id: 'user', name: 'Vous (Salarié)', role: 'Chef de projet', avatar: '👤', isUser: true }
    ],
    threePartyCharacters: [
      { id: 'char-1', name: 'Laurent', role: 'Directeur d\'équipe', avatar: '💼', isUser: false },
      { id: 'char-2', name: 'Claire', role: 'Responsable RH', avatar: '📊', isUser: false },
      { id: 'user', name: 'Vous (Salarié)', role: 'Chef de projet', avatar: '👤', isUser: true }
    ],
    starterA2: "Bonjour Laurent, je voudrais te demander si je peux travailler chez moi 3 jours par semaine.",
    starterB2: "Bonjour Laurent, je souhaitais faire un point avec toi concernant les modalités de mon organisation de travail et envisager une extension du télétravail à trois jours.",
    openingMessage: "Bonjour ! Oui bien sûr, je t'écoute. De quoi voulais-tu me parler précisément ?"
  },
  {
    id: 'prefecture-titre-sejour',
    category: 'Démarches Administratives',
    title: 'Guichet de la Préfecture : Renouvellement de titre de séjour',
    level: 'B1',
    description: 'Il manque une pièce justificative à votre dossier de renouvellement et vous venez obtenir un récépissé provisoire.',
    objective: 'Expliquer poliment la situation administrative, solliciter un délai et obtenir un récépissé de dépôt.',
    partyModeDefault: '2-party',
    characters: [
      { id: 'char-1', name: 'Agent Préfecture', role: 'Agent d\'accueil', avatar: '🏛️', isUser: false },
      { id: 'user', name: 'Vous (Usager)', role: 'Demandeur', avatar: '👤', isUser: true }
    ],
    threePartyCharacters: [
      { id: 'char-1', name: 'Agent Guichet', role: 'Agent instructeur', avatar: '🏛️', isUser: false },
      { id: 'char-2', name: 'Mme Bernard', role: 'Responsable de bureau', avatar: '🗂️', isUser: false },
      { id: 'user', name: 'Vous (Usager)', role: 'Demandeur', avatar: '👤', isUser: true }
    ],
    starterA2: "Bonjour madame, j'ai apporté mes papiers pour mon titre de séjour, mais j'attends encore mon attestation d'emploi.",
    starterB2: "Bonjour Madame, je me présente concernant ma demande de renouvellement de titre de séjour. Mon dossier est complet à l'exception de l'attestation patronale en cours d'acheminement.",
    openingMessage: "Bonjour. Numéro de dossier s'il vous plaît ? Présentez-moi vos pièces originales."
  },
  {
    id: 'visite-logement',
    category: 'Logement & Vie Pratique',
    title: 'Visite d\'un appartement et échange avec le propriétaire',
    level: 'A2',
    description: 'Vous visitez un studio dans le centre-ville et posez des questions sur les charges, le chauffage et les garanties.',
    objective: 'Poser des questions concrètes sur l\'état du bien, le loyer charges comprises et déposer votre dossier.',
    partyModeDefault: '2-party',
    characters: [
      { id: 'char-1', name: 'M. Dubois', role: 'Propriétaire', avatar: '🔑', isUser: false },
      { id: 'user', name: 'Vous (Locataire)', role: 'Candidat locataire', avatar: '👤', isUser: true }
    ],
    threePartyCharacters: [
      { id: 'char-1', name: 'M. Dubois', role: 'Propriétaire', avatar: '🔑', isUser: false },
      { id: 'char-2', name: 'Mme Leroux', role: 'Agente immobilière', avatar: '🏠', isUser: false },
      { id: 'user', name: 'Vous (Locataire)', role: 'Candidat locataire', avatar: '👤', isUser: true }
    ],
    starterA2: "Bonjour monsieur, l'appartement est très lumineux. Est-ce que le chauffage est compris dans le loyer ?",
    starterB2: "Bonjour Monsieur Dubois, ce logement correspond parfaitement à mes attentes. Pourriez-vous me préciser la quote-part des charges locatives et le mode de chauffage ?",
    openingMessage: "Bienvenue ! Voici le séjour, orienté plein sud comme vous pouvez le constater. Qu'en pensez-vous à première vue ?"
  },
  {
    id: 'projet-universitaire',
    category: 'Études & Université',
    title: 'Réunion de cadrage pour un exposé en binôme à la faculté',
    level: 'B2',
    description: 'Vous devez définir la problématique et répartir les parties de votre présentation orale avec votre camarade de promotion.',
    objective: 'Proposer une problématique originale, délimiter le plan et convenir d\'un calendrier de travail.',
    partyModeDefault: '2-party',
    characters: [
      { id: 'char-1', name: 'Camille', role: 'Étudiant(e) binôme', avatar: '🎓', isUser: false },
      { id: 'user', name: 'Vous (Étudiant)', role: 'Étudiant(e)', avatar: '👤', isUser: true }
    ],
    threePartyCharacters: [
      { id: 'char-1', name: 'Camille', role: 'Étudiant(e) binôme', avatar: '🎓', isUser: false },
      { id: 'char-2', name: 'Lucas', role: 'Coéquipier de groupe', avatar: '📚', isUser: false },
      { id: 'user', name: 'Vous (Étudiant)', role: 'Étudiant(e)', avatar: '👤', isUser: true }
    ],
    starterA2: "Salut Camille, on commence à préparer notre exposé ? Je propose de faire deux parties.",
    starterB2: "Salut Camille ! Je te propose de cadrer d'emblée notre problématique pour éviter les écueils descriptifs et structurer un plan en deux axes équilibrés.",
    openingMessage: "Salut ! Heureusement qu'on se voit aujourd'hui, l'exposé est dans deux semaines et je n'arrive pas à me décider sur l'angle d'attaque. Tu as des pistes ?"
  }
];
