/**
 * DebateEngine: Analyzes candidate monologue and produces contextual debate counter-questions
 */

export class DebateEngine {
  constructor() {
    this.questionBankByTheme = {
      'Travail & Nouveaux Modes de Vie': [
        "Vous avez souligné les avantages du télétravail, mais ne craignez-vous pas que la disparition du présentiel fragilise la culture d'entreprise et l'intégration des nouveaux arrivants ?",
        "Certains managers estiment que le travail à distance nuit à la créativité collective et à l'émulation spontanée. Que leur répondez-vous ?",
        "Pour concilier liberté individuelle et cohésion d'équipe, quelles règles précises préconiseriez-vous au sein d'une convention collective ?"
      ],
      'Nouvelles Technologies & IA': [
        "Vous évoquez l'intelligence artificielle comme un tuteur efficace, mais ne pensez-vous pas que la dépendance aux algorithmes risque d'atrophier les capacités d'analyse critique des élèves ?",
        "Comment un enseignant peut-il évaluer équitablement le travail personnel d'un lycéen si les dissertations peuvent être générées automatiquement ?",
        "À votre avis, la solution réside-t-elle dans une interdiction stricte en classe ou dans une refonte globale des épreuves d'examen ?"
      ],
      'Écologie & Consommation Durable': [
        "Vous pointez du doigt les ravages de la surconsommation textile, mais n'est-ce pas d'abord une question de pouvoir d'achat pour les ménages les plus modestes ?",
        "Pensez-vous réellement que les initiatives citoyennes comme la seconde main suffiront à infléchir la production de masse des multinationales ?",
        "Seriez-vous favorable à une taxe carbone contraignante sur les vêtements importés par avion, quitte à renchérir leur coût ?"
      ],
      'default': [
        "Vous avez exposé une position très claire, mais ne pensez-vous pas qu'il existe une contradiction majeure dans votre argumentation ?",
        "Quels arguments opposeriez-vous à ceux qui défendent la position exactement inverse à la vôtre ?",
        "Si vous deviez mettre en œuvre une politique concrète dès demain pour répondre à ce problème, quelle serait votre toute première priorité ?"
      ]
    };
  }

  generateExaminerQuestion(turnIndex, triggerDocument, monologueTranscript = '') {
    const theme = triggerDocument?.category || 'default';
    const questions = this.questionBankByTheme[theme] || this.questionBankByTheme['default'];

    const index = Math.min(turnIndex - 1, questions.length - 1);
    const baseQuestion = questions[index] || questions[0];

    // Dynamic contextual nuance
    if (turnIndex === 1) {
      if (triggerDocument?.isCustom && triggerDocument?.problematique) {
        return `Examinateur : J'ai écouté avec attention votre exposé sur la question : « ${triggerDocument.problematique} ». ${baseQuestion}`;
      } else if (triggerDocument?.isCustom && triggerDocument?.title) {
        return `Examinateur : J'ai suivi votre argumentation au sujet de « ${triggerDocument.title} ». ${baseQuestion}`;
      } else if (monologueTranscript.length > 50) {
        return `Examinateur : J'ai écouté avec attention votre exposé. ${baseQuestion}`;
      } else {
        return `Examinateur : Bonjour. ${baseQuestion}`;
      }
    } else if (turnIndex === 2) {
      return `Examinateur : C'est un point de vue intéressant, mais poussons la réflexion plus loin : ${baseQuestion}`;
    } else {
      return `Examinateur : Pour conclure notre échange : ${baseQuestion}`;
    }
  }
}
