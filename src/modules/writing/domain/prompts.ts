import type { Prompt } from './types.ts';

export const OFFICIAL_DELF_B2_PROMPTS: Prompt[] = [
  {
    id: 'lettre-maire-espaces-verts',
    category: 'lettre_formelle',
    title: 'Lettre au Maire — Préservation du parc municipal',
    scenario: 'Le conseil municipal de votre ville a décidé de remplacer un parc arboré emblématique du centre-ville par un complexe commercial et un parking souterrain. En tant que représentant(e) d’un collectif de riverains, vous écrivez au maire pour contester ce projet.',
    instructions: 'Rédigez une lettre formelle argumentée (minimum 250 mots). Vous exposerez les préjudices environnementaux et sociaux de cette décision, mettrez en valeur les bienfaits du parc pour la biodiversité et le bien-être des habitants, et proposerez des solutions alternatives concrètes.',
    targetWordCount: 250,
  },
  {
    id: 'lettre-drh-teletravail',
    category: 'lettre_formelle',
    title: 'Lettre à la Direction — Maintien et encadrement du télétravail',
    scenario: 'La direction de votre entreprise envisage de supprimer totalement le télétravail pour imposer un retour à 100% en présentiel. En qualité de délégué(e) du personnel, vous adressez un courrier formel au Directeur des Ressources Humaines.',
    instructions: 'Rédigez une lettre formelle et courtoise (minimum 250 mots). Vous défendrez les avantages du travail hybride pour la productivité et l’équilibre vie professionnelle/vie personnelle, tout en soumettant un protocole de suivi pour lever les craintes de la direction.',
    targetWordCount: 250,
  },
  {
    id: 'essai-ia-education',
    category: 'essai_argumentatif',
    title: 'Essai — L\'intelligence artificielle dans le milieu éducatif',
    scenario: 'L’intégration fulgurante des outils d’intelligence artificielle générative dans les écoles et universités suscite de vifs débats entre pédagogues, parents et étudiants.',
    instructions: 'Dans un essai argumenté et structuré (minimum 250 mots), vous prendrez position sur la question : « L\'intelligence artificielle représente-t-elle une opportunité pédagogique majeure ou un risque d\'appauvrissement intellectuel pour les apprenants ? ». Vous illustrerez votre propos d\'exemples précis.',
    targetWordCount: 250,
  },
  {
    id: 'essai-ecologie-transports',
    category: 'essai_argumentatif',
    title: 'Essai — Interdiction des vols intérieurs courts au profit du train',
    scenario: 'Pour lutter contre le dérèglement climatique, plusieurs gouvernements envisagent d’interdire tous les vols commerciaux lorsqu’une liaison ferroviaire directe de moins de 3 heures existe.',
    instructions: 'Rédigez un essai argumentatif (minimum 250 mots). Vous présenterez les arguments écologiques, économiques et pratiques entourant cette mesure, avant d’exprimer votre point de vue personnel nuancé et étayé.',
    targetWordCount: 250,
  },
  {
    id: 'article-semaine-4-jours',
    category: 'article_forum',
    title: 'Article / Forum — Faut-il généraliser la semaine de 4 jours ?',
    scenario: 'Un magazine en ligne dédié au monde du travail lance un grand forum participatif : « La semaine de 4 jours payée 35 heures : utopie ou modèle d\'avenir ? »',
    instructions: 'Rédigez un article d’opinion dynamique pour le forum (minimum 250 mots). Vous capterez l’attention du lectorat, partagerez des arguments percutants sur la santé mentale, la consommation d\'énergie et la compétitivité, et inviterez les lecteurs à réagir.',
    targetWordCount: 250,
  },
  {
    id: 'article-mode-ephemere',
    category: 'article_forum',
    title: 'Courrier des lecteurs — L\'impact écologique de la fast-fashion',
    scenario: 'À la suite d’un reportage télévisé sur la surconsommation textile et ses désastres écologiques dans les pays du Sud, vous décidez de contribuer à la rubrique « Citoyens engagés » d\'un quotidien national.',
    instructions: 'Rédigez un courrier des lecteurs / article engagé (minimum 250 mots) dénonçant les dérives de la mode éphémère et proposant des modes de consommation alternatifs (seconde main, sobriété, régulation légale).',
    targetWordCount: 250,
  },
];
