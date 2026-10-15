/**
 * conversationScenarios.js: Authentic French situational dialogue scenarios
 * Categorized by real-life contexts, supporting 2 or 3 participants across CEFR levels A1-C2
 */

export const CONVERSATION_CATEGORIES = [
  { id: 'sante', label: 'Santé & Soins (Dentiste, Médecin)', icon: '🏥' },
  { id: 'travail', label: 'Monde Professionnel & Entreprise', icon: '💼' },
  { id: 'quotidien', label: 'Vie Quotidienne & Commerces', icon: '🥖' },
  { id: 'etudes', label: 'Études & Milieu Universitaire', icon: '🎓' },
  { id: 'administration', label: 'Démarches Administratives', icon: '🏛️' }
];

export const CONVERSATION_SCENARIOS = [
  {
    id: 'conv-scen-sante-dentiste',
    title: "Rendez-vous d'urgence chez le dentiste",
    category: 'sante',
    participantCount: 2,
    defaultLevel: 'B1',
    context: "Vous souffrez d'une rage de dents intense depuis hier soir. Vous vous présentez sans rendez-vous au cabinet dentaire du quartier.",
    objective: "Décrire précisément votre douleur dentaire, insister courtoisement sur l'urgence et obtenir une consultation ou des soins dans la journée.",
    characters: [
      { id: 'char-user', name: 'Vous (Patient)', isUser: true, role: 'Patient souffrant d’une rage de dents' },
      { id: 'char-sec', name: 'Mme Leroy (Secrétaire médicale)', isUser: false, role: 'Secrétaire médicale accueillante avec un agenda complet', voiceGender: 'female' }
    ],
    initialTurn: {
      speakerId: 'char-sec',
      text: "Cabinet dentaire du Dr Vasseur, bonjour. En quoi puis-je vous être utile aujourd'hui ?"
    },
    sampleResponses: {
      A1: ["Bonjour, j'ai très mal à une dent depuis hier. C'est urgent, s'il vous plaît."],
      A2: ["Bonjour Madame, excusez-moi, j'ai une grosse douleur à une dent depuis hier soir. Est-ce que le docteur peut me recevoir aujourd'hui ?"],
      B1: ["Bonjour Madame, je n'ai pas de rendez-vous mais j'ai une rage de dents insupportable depuis hier soir. Serait-il possible de voir le docteur entre deux consultations ?"],
      B2: ["Bonjour Madame, je suis désolé de me présenter à l'improviste, mais la douleur est devenue intolérable au niveau d'une molaire. Pourriez-vous me trouver un créneau d'urgence aujourd'hui ?"],
      C1: ["Bonjour Madame, navré de vous solliciter sans rendez-vous préalable, mais je subis une pulpite aiguë insoutenable. Y aurait-il le moindre désistement qui me permettrait d'être pris en charge rapidement ?"],
      C2: ["Bonjour Madame, je me permets de faire irruption dans votre cabinet car une névralgie dentaire fulgurante m'empêche de fonctionner depuis cette nuit. Je m'en remets à votre bienveillance pour m'intercaler."]
    }
  },
  {
    id: 'conv-scen-sante-hopital',
    title: "Consultation et bilan médical à l'hôpital",
    category: 'sante',
    participantCount: 3,
    defaultLevel: 'B2',
    context: "Vous consultez aux urgences médicales pour des vertiges répétés et une grande fatigue. Le médecin urgentiste et son interne examinent votre cas.",
    objective: "Expliquer vos symptômes, répondre aux questions sur vos antécédents et vous entendre sur les examens complémentaires à réaliser.",
    characters: [
      { id: 'char-user', name: 'Vous (Patient)', isUser: true, role: 'Patient souffrant de vertiges' },
      { id: 'char-doc', name: 'Dr Morel (Médecin urgentiste)', isUser: false, role: 'Médecin urgentiste posé et rigoureux', voiceGender: 'male' },
      { id: 'char-intern', name: 'Camille (Interne)', isUser: false, role: 'Interne attentive prenant les constantes', voiceGender: 'female' }
    ],
    initialTurn: {
      speakerId: 'char-doc',
      text: "Bonjour, installez-vous. Camille m'a transmis vos constantes, votre tension est un peu basse. Depuis quand ressentez-vous ces vertiges exactement ?"
    },
    sampleResponses: {
      B1: ["Bonjour Docteur. Ça a commencé il y a trois jours, surtout quand je me lève rapidement le matin. Je me sens très fatigué."],
      B2: ["Bonjour Docteur. Ces épisodes de vertiges se manifestent depuis environ quatre jours, en particulier lors des changements de posture brusques, accompagnés d'un état d'épuisement persistant."]
    }
  },
  {
    id: 'conv-scen-travail-teletravail',
    title: "Arbitrage sur le télétravail en réunion d'équipe",
    category: 'travail',
    participantCount: 3,
    defaultLevel: 'B2',
    context: "Réunion d'arbitrage hebdomadaire avec votre manager et un collègue pour organiser les plannings de télétravail du trimestre.",
    objective: "Négocier 2 jours de télétravail hebdomadaires fixes tout en garantissant le suivi des projets d'équipe et la présence aux réunions clés.",
    characters: [
      { id: 'char-user', name: 'Vous (Collaborateur)', isUser: true, role: 'Membre de l’équipe demandant 2 jours de télétravail' },
      { id: 'char-manager', name: 'Hélène (Manager)', isUser: false, role: 'Responsable soucieuse de la présence au bureau et du suivi', voiceGender: 'female' },
      { id: 'char-colleague', name: 'Thomas (Collègue)', isUser: false, role: 'Collègue favorable à une flexibilité partagée', voiceGender: 'male' }
    ],
    initialTurn: {
      speakerId: 'char-manager',
      text: "Merci à tous les deux d'être là. La direction générale nous demande d'harmoniser le télétravail pour le trimestre à venir. Quelles sont vos attentes respectives ?"
    },
    sampleResponses: {
      B1: ["Pour ma part, j'aimerais avoir deux jours de télétravail par semaine, par exemple le mardi et le jeudi, car cela me permet d'être plus concentré sur mes dossiers."],
      B2: ["De mon côté, je préconise un rythme de deux jours fixes par semaine. Cela me permettrait d'optimiser les tâches nécessitant une forte concentration, tout en garantissant ma présence physique pour les comités de pilotage."]
    }
  },
  {
    id: 'conv-scen-travail-entretien',
    title: "Entretien d'embauche : valeur ajoutée & vision",
    category: 'travail',
    participantCount: 2,
    defaultLevel: 'B2',
    context: "Vous passez le second tour d'un entretien d'embauche auprès du Directeur des Ressources Humaines pour un poste qualifié.",
    objective: "Convaincre le recruteur de votre pertinence, mettre en valeur vos compétences clés et négocier positivement vos perspectives de collaboration.",
    characters: [
      { id: 'char-user', name: 'Vous (Candidat)', isUser: true, role: 'Candidat motivé et expérimenté' },
      { id: 'char-recruiter', name: 'M. Mercier (Directeur RH)', isUser: false, role: 'Recruteur exigeant mais bienveillant', voiceGender: 'male' }
    ],
    initialTurn: {
      speakerId: 'char-recruiter',
      text: "Bonjour et bienvenue. Les retours de votre test technique étaient particulièrement élogieux. Pourriez-vous me préciser en quoi votre expérience fait la différence pour ce poste ?"
    },
    sampleResponses: {
      B1: ["Merci Monsieur. Mon expérience passée m'a appris à gérer des situations complexes en équipe et à respecter scrupuleusement les délais."],
      B2: ["Je vous remercie. Au-delà de mes compétences techniques, ma valeur ajoutée réside dans ma capacité à fédérer des profils pluridisciplinaires et à anticiper les risques opérationnels."]
    }
  },
  {
    id: 'conv-scen-admin-prefecture',
    title: "Renouvellement de titre de séjour à la préfecture",
    category: 'administration',
    participantCount: 2,
    defaultLevel: 'B1',
    context: "Vous vous présentez au guichet du service des étrangers de la préfecture pour déposer votre dossier de renouvellement de séjour.",
    objective: "Remettre vos pièces justificatives, répondre aux questions avec précision et obtenir un récépissé de demande de renouvellement.",
    characters: [
      { id: 'char-user', name: 'Vous (Usager)', isUser: true, role: 'Usager régulier déposant son dossier' },
      { id: 'char-agent', name: 'M. Girard (Agent de préfecture)', isUser: false, role: 'Agent administratif méthodique et rigoureux', voiceGender: 'male' }
    ],
    initialTurn: {
      speakerId: 'char-agent',
      text: "Numéro 42, bonjour. Vous déposez une demande de renouvellement de titre de séjour ? Avez-vous la convocation et l'ensemble des pièces exigées ?"
    },
    sampleResponses: {
      A2: ["Bonjour Monsieur. Oui, voici ma convocation, mon passeport et mes trois dernières fiches de paie."],
      B1: ["Bonjour Monsieur. Oui, tout à fait. J'ai préparé l'original de ma convocation ainsi que les copies certifiées de mes justificatifs de domicile et de ressources."]
    }
  },
  {
    id: 'conv-scen-etudes-groupe',
    title: "Répartition des tâches pour un projet d'études",
    category: 'etudes',
    participantCount: 3,
    defaultLevel: 'B1',
    context: "Vous retrouvez deux camarades de promotion à la bibliothèque universitaire pour préparer un dossier de recherche commun noté.",
    objective: "Établir un plan de recherche équilibré, vous attribuer les parties thématiques et fixer des jalons de relecture avant le rendu.",
    characters: [
      { id: 'char-user', name: 'Vous (Étudiant)', isUser: true, role: 'Étudiant force de proposition' },
      { id: 'char-student-a', name: 'Léa (Étudiante)', isUser: false, role: 'Camarade organisée et attentive à la méthodologie', voiceGender: 'female' },
      { id: 'char-student-b', name: 'Maxime (Étudiant)', isUser: false, role: 'Camarade créatif mais ayant un emploi du temps chargé', voiceGender: 'male' }
    ],
    initialTurn: {
      speakerId: 'char-student-a',
      text: "Salut à tous les deux ! C'est super qu'on se voie aujourd'hui. L'enseignant attend notre première ébauche pour la fin du mois. Comment souhaitez-vous qu'on s'organise ?"
    },
    sampleResponses: {
      B1: ["Salut ! Je propose qu'on commence par définir les trois grands axes du plan, puis chacun de nous prendra en charge la rédaction d'une partie."]
    }
  },
  {
    id: 'conv-scen-quotidien-boulangerie',
    title: "Commande personnalisée à la boulangerie",
    category: 'quotidien',
    participantCount: 2,
    defaultLevel: 'A2',
    context: "Vous vous rendez dans une pâtisserie pour commander un gâteau pour un anniversaire de 8 personnes sans allergènes aux fruits à coque.",
    objective: "Décrire vos besoins, vérifier l'absence d'allergènes et réserver le gâteau pour samedi après-midi avec une bougie personnalisée.",
    characters: [
      { id: 'char-user', name: 'Vous (Client)', isUser: true, role: 'Client passant une commande de pâtisserie' },
      { id: 'char-baker', name: 'Mme Bernard (Boulangère)', isUser: false, role: 'Artisane commerçante et accueillante', voiceGender: 'female' }
    ],
    initialTurn: {
      speakerId: 'char-baker',
      text: "Bonjour ! Bienvenue chez nous. Qu'est-ce qui vous ferait plaisir pour aujourd'hui ou pour une commande ?"
    },
    sampleResponses: {
      A1: ["Bonjour, je voudrais commander un gâteau au chocolat pour huit personnes, s'il vous plaît."],
      A2: ["Bonjour Madame, je voudrais commander un gâteau pour samedi prochain, pour huit personnes, sans fruits à coque s'il vous plaît."]
    }
  },
  {
    id: 'conv-scen-quotidien-logement',
    title: "Visite d'un appartement en colocation",
    category: 'quotidien',
    participantCount: 3,
    defaultLevel: 'B1',
    context: "Vous visitez une chambre meublée disponible dans un appartement en présence du colocataire occupant et de la propriétaire.",
    objective: "Poser des questions sur les charges locatives, le rythme de vie de l'appartement et manifester votre intérêt sérieux.",
    characters: [
      { id: 'char-user', name: 'Vous (Candidat locataire)', isUser: true, role: 'Candidat sérieux et sociable' },
      { id: 'char-owner', name: 'Mme Dubois (Propriétaire)', isUser: false, role: 'Propriétaire vigilante sur les garanties et le calme', voiceGender: 'female' },
      { id: 'char-roommate', name: 'Antoine (Colocataire)', isUser: false, role: 'Colocataire cherchant une personne calme et ordonnée', voiceGender: 'male' }
    ],
    initialTurn: {
      speakerId: 'char-owner',
      text: "Entrez, faites comme chez vous ! Antoine est avec nous pour la visite. La chambre donne sur la cour intérieure. Qu'en pensez-vous ?"
    },
    sampleResponses: {
      B1: ["Bonjour Madame, bonjour Antoine. L'appartement est très lumineux et le calme me convient parfaitement. Pourriez-vous me préciser ce qui est inclus dans les charges ?"]
    }
  }
];

export function getConversationScenarios() {
  return [...CONVERSATION_SCENARIOS];
}

export function getRandomConversationScenario({ category = null, participantCount = null } = {}) {
  let list = CONVERSATION_SCENARIOS;
  if (category) {
    list = list.filter(s => s.category === category);
  }
  if (participantCount) {
    list = list.filter(s => s.participantCount === Number(participantCount));
  }
  if (list.length === 0) list = CONVERSATION_SCENARIOS;
  const index = Math.floor(Math.random() * list.length);
  return { ...list[index] };
}

export function filterConversationScenarios({ category = null, participantCount = null, level = null } = {}) {
  return CONVERSATION_SCENARIOS.filter(s => {
    if (category && s.category !== category) return false;
    if (participantCount && s.participantCount !== Number(participantCount)) return false;
    if (level && s.defaultLevel !== level) return false;
    return true;
  });
}
