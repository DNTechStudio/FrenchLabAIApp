/**
 * Domain entity types and constants for DELF-DALF Lab Speaking App
 */

export const ExamPhases = {
  SELECTION: 'SELECTION',
  PREPARATION: 'PREPARATION',
  MONOLOGUE: 'MONOLOGUE',
  MONOLOGUE_REVIEW: 'MONOLOGUE_REVIEW',
  DEBATE: 'DEBATE',
  EVALUATION: 'EVALUATION',
  REPORT: 'REPORT'
};

export const CEFRThemes = {
  TRAVAIL: 'Travail & Nouveaux Modes de Vie',
  ECOLOGIE: 'Écologie & Consommation Durable',
  NUMERIQUE: 'Nouvelles Technologies & IA',
  EDUCATION: 'Éducation & Jeunesse',
  SOCIETE: 'Santé & Société'
};

export const ScoreRubricLimits = {
  MONOLOGUE_MAX: 9.0,
  DEBAT_MAX: 6.0,
  LEXIQUE_MAX: 4.0,
  MORPHOSYNTAXE_MAX: 5.0,
  PHONOLOGIE_MAX: 1.0,
  TOTAL_MAX: 25.0,
  PASS_THRESHOLD: 12.5,
  ELIMINATORY_MARK: 5.0
};
