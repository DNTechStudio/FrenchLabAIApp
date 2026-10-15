/**
 * CEFR Level Definitions and Linguistic Calibration Matrix (A1 to C2)
 * for French Oral Production & AI Elevation
 */

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const CEFR_METADATA = {
  A1: {
    code: 'A1',
    name: 'Découverte (Introductif)',
    ttsRate: 0.88,
    summary: 'Phrases simples SVO (Sujet-Verbe-Objet), vocabulaire familier du quotidien, connecteurs élémentaires (et, mais, parce que).'
  },
  A2: {
    code: 'A2',
    name: 'Survie (Intermédiaire)',
    ttsRate: 0.90,
    summary: 'Propositions coordonnées, repères temporels (d’abord, ensuite, puis), passé composé et futur proche, descriptions d’habitudes.'
  },
  B1: {
    code: 'B1',
    name: 'Seuil (Indépendant)',
    ttsRate: 0.94,
    summary: 'Expression claire d’opinions personnelles (à mon avis, selon moi), propositions relatives (qui, que, où), connecteurs logiques de base (donc, cependant).'
  },
  B2: {
    code: 'B2',
    name: 'Avancé (Spontané & Argumenté)',
    ttsRate: 0.98,
    summary: 'Argumentation structurée, nominalisation, mode subjonctif, connecteurs de concession (bien que, toutefois, en revanche, d’une part... d’autre part).'
  },
  C1: {
    code: 'C1',
    name: 'Autonome (Académique & Nuancé)',
    ttsRate: 1.02,
    summary: 'Discours complexe et fluide, inversions stylistiques, vocabulaire soutenu et abstrait, formules rhétoriques (force est de constater, nonobstant, dès lors).'
  },
  C2: {
    code: 'C2',
    name: 'Maîtrise (Aisance Bilingue / Biculturelle)',
    ttsRate: 1.04,
    summary: 'Maîtrise parfaite des subtilités stylistiques, tournures idiomatiques rares, nuances d’ironie ou d’emphase (quand bien même, pour peu que, il appert que).'
  }
};

/**
 * Common lexical transformation rules across CEFR levels
 */
export const LEXICAL_ELEVATION_MAP = [
  {
    pattern: /\b((c'est|est)\s+(très\s+)?(bien|bon))\b/gi,
    original: "c'est bien / bon",
    A1: "est bien",
    A2: "est une bonne chose",
    B1: "est un avantage important",
    B2: "s'avère particulièrement bénéfique",
    C1: "s'avère indéniablement fécond",
    C2: "recèle des vertus inestimables"
  },
  {
    pattern: /\b(je\s+pense\s+que|à\s+mon\s+avis)\b/gi,
    original: "je pense que",
    A1: "je pense que",
    A2: "selon moi",
    B1: "à mon avis",
    B2: "il me semble opportun de souligner que",
    C1: "force est de constater que",
    C2: "il appert sans conteste que"
  },
  {
    pattern: /\b(il\s+y\s+a\s+beaucoup\s+de\s+(gens|personnes))\b/gi,
    original: "il y a beaucoup de gens",
    A1: "beaucoup de gens",
    A2: "de nombreuses personnes",
    B1: "une grande partie de la population",
    B2: "un nombre considérable de concitoyens",
    C1: "une frange non négligeable du corps social",
    C2: "une myriade d'acteurs de la société civile"
  },
  {
    pattern: /\b(c'est\s+un\s+(gros|grand)\s+problème)\b/gi,
    original: "c'est un gros problème",
    A1: "c'est un problème",
    A2: "c'est une vraie difficulté",
    B1: "cela pose un défi majeur",
    B2: "cette situation soulève une problématique préoccupante",
    C1: "cet écueil constitue un obstacle prégnant",
    C2: "cette aporie cristallise les tensions sociétales"
  },
  {
    pattern: /\b(mais\s+aussi)\b/gi,
    original: "mais aussi",
    A1: "et aussi",
    A2: "de plus",
    B1: "en outre",
    B2: "non seulement... mais encore",
    C1: "sans omettre de surcroît",
    C2: "concomitamment à cette dimension"
  }
];

/**
 * Level-specific discourse connector toolkits
 */
export const CEFR_CONNECTORS = {
  A1: ['et', 'mais', 'parce que'],
  A2: ['d’abord', 'ensuite', 'puis', 'aussi', 'donc'],
  B1: ['cependant', 'en effet', 'grâce à', 'à cause de', 'ainsi', 'selon moi'],
  B2: ['bien que (+ subjonctif)', 'en revanche', 'toutefois', 'd’une part... d’autre part', 'néanmoins', 'dans la mesure où'],
  C1: ['force est de constater', 'nonobstant', 'dès lors', 'il n’en demeure pas moins', 'à cet égard', 'qui plus est'],
  C2: ['quand bien même', 'pour peu que', 'en l’occurrence', 'il va sans dire que', 'tant s’en faut', 'subsidiairement']
};
