import { ImprovementResult, PedagogicalNote } from '../domain/types.ts';
import { computeWordDiff } from '../domain/diffEngine.ts';
import { ImprovementRequest, ImprovementService } from './improvementService.ts';
import { MockImprovementService } from './mockImprovementService.ts';

export class GeminiImprovementService implements ImprovementService {
  private apiKey: string;
  private fallbackMock = new MockImprovementService();

  constructor(apiKey: string) {
    this.apiKey = apiKey.trim();
  }

  public async improveEssay(request: ImprovementRequest): Promise<ImprovementResult> {
    if (!this.apiKey) {
      console.warn('No Gemini API key provided. Falling back to offline Mock service.');
      return this.fallbackMock.improveEssay(request);
    }

    const targetLevel = request.targetLevel || 'B2';
    const isAutonomous = !request.essayContent.trim();

    const systemPrompt = isAutonomous
      ? `Tu es un examinateur expert et linguiste spécialiste du Cadre européen commun de référence pour les langues (CECRL).
L'apprenant n'a rédigé aucun brouillon. Ton rôle est de composer de manière autonome une production écrite modèle et exemplaire répondant intégralement au sujet et aux consignes, calibrée pour le niveau CECRL ${targetLevel}.
Si le niveau est B2, compose une lettre formelle ou un texte argumentatif exemplaire complet (environ 250 mots) respectant toutes les exigences du DELF B2.
Directives pour le niveau ${targetLevel} :
- Si A1 : phrases très simples juxtaposées, présent de l'indicatif, vocabulaire concret et élémentaire du quotidien.
- Si A2 : narration simple au passé composé, connecteurs élémentaires (et, mais, parce que), situations courantes.
- Si B1 : discours connecté, connecteurs logiques standards (d'abord, ensuite, c'est pourquoi), expression de l'opinion personnelle, argumentation cohérente.
- Si B2 : registre formel soutenu (DELF B2), connecteurs logiques riches, subjonctif, passif, tournures impersonnelles, lettre formelle protocolaire.
- Si C1 : syntaxe élaborée, lexique académique et abstrait, nuances fines, inversion stylistique, aisance argumentative supérieure.
- Si C2 : éloquence littéraire souveraine, perfection stylistique native, dialectique philosophique/académique magistrale.

Produis également des notes pédagogiques explicatives valorisant les réussites du texte modèle selon les critères :
- sociolinguistic (registre, politesse, adéquation)
- coherence (connecteurs, transitions)
- grammar (morphosyntaxe, modes et temps verbaux)
- vocabulary (précision lexicale, richesse)

Réponds STRICTEMENT sous forme d'un objet JSON avec la structure suivante :
{
  "improvedText": "Le texte complet modèle en français",
  "pedagogicalNotes": [
    {
      "id": "note-1",
      "criterion": "sociolinguistic" | "coherence" | "grammar" | "vocabulary",
      "title": "Titre explicatif du procédé linguistique",
      "originalExcerpt": "Extrait marquant du texte",
      "improvedExcerpt": "Extrait marquant du texte",
      "explanation": "Explication pédagogique pour l'apprenant"
    }
  ],
  "overallFeedback": "Commentaire global d'évaluation du modèle pour le niveau ${targetLevel}"
}`
      : `Tu es un examinateur expert et linguiste spécialiste du Cadre européen commun de référence pour les langues (CECRL).
Ton rôle est de réécrire la production écrite du candidat pour l'adapter fidèlement aux descripteurs et attentes linguistiques du niveau CECRL ${targetLevel}.
Directives pour le niveau ${targetLevel} :
- Si A1 : phrases très simples juxtaposées, présent de l'indicatif, vocabulaire concret et élémentaire du quotidien.
- Si A2 : narration simple au passé composé, connecteurs élémentaires (et, mais, parce que), situations courantes.
- Si B1 : discours connecté, connecteurs logiques standards (d'abord, ensuite, c'est pourquoi), expression de l'opinion personnelle, argumentation cohérente.
- Si B2 : registre formel soutenu (DELF B2), connecteurs logiques riches, subjonctif, passif, tournures impersonnelles, lettre formelle protocolaire.
- Si C1 : syntaxe élaborée, lexique académique et abstrait, nuances fines, inversion stylistique, aisance argumentative supérieure.
- Si C2 : éloquence littéraire souveraine, perfection stylistique native, dialectique philosophique/académique magistrale.

Consignes générales :
1. Conserve le sujet de départ et l'intention communicative de l'écrit.
2. Respecte le genre requis (lettre formelle, essai argumentatif, article).
3. Produis des notes pédagogiques explicatives classées selon les critères :
   - sociolinguistic (registre, politesse, adéquation)
   - coherence (connecteurs, transitions)
   - grammar (morphosyntaxe, modes et temps verbaux)
   - vocabulary (précision lexicale, richesse)

Réponds STRICTEMENT sous forme d'un objet JSON avec la structure suivante :
{
  "improvedText": "Le texte complet amélioré en français",
  "pedagogicalNotes": [
    {
      "id": "note-1",
      "criterion": "sociolinguistic" | "coherence" | "grammar" | "vocabulary",
      "title": "Titre bref de la règle",
      "originalExcerpt": "Extrait original corrigé (optionnel)",
      "improvedExcerpt": "Nouvel extrait amélioré",
      "explanation": "Explication pédagogique claire pour le candidat"
    }
  ],
  "overallFeedback": "Commentaire global d'évaluation pour le niveau ${targetLevel}"
}`;

    const userPrompt = isAutonomous
      ? `Sujet : ${request.promptTitle}
Contexte : ${request.promptScenario}
Consignes : ${request.promptInstructions}

L'utilisateur n'a rédigé aucun brouillon. Rédige une production modèle exemplaire complète (d'environ 250 mots pour B2) répondant directement à ce sujet au niveau ${targetLevel}.`
      : `Sujet : ${request.promptTitle}
Contexte : ${request.promptScenario}
Consignes : ${request.promptInstructions}

Production écrite du candidat :
"""
${request.essayContent}
"""`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Empty response from Gemini API');
      }

      const parsed = JSON.parse(rawText);
      const improvedText: string = parsed.improvedText || request.essayContent;
      const pedagogicalNotes: PedagogicalNote[] = Array.isArray(parsed.pedagogicalNotes) ? parsed.pedagogicalNotes : [];
      const overallFeedback: string = parsed.overallFeedback || 'Évaluation générée par Gemini.';

      const diffTokens = computeWordDiff(request.essayContent, improvedText);

      return {
        promptId: request.promptId,
        originalText: request.essayContent,
        improvedText,
        diffTokens,
        pedagogicalNotes,
        overallFeedback,
        evaluatedAt: Date.now(),
        targetLevel,
        isAutonomous,
      };
    } catch (err) {
      console.warn('Gemini request failed, using Mock fallback:', err);
      const mockResult = await this.fallbackMock.improveEssay(request);
      mockResult.overallFeedback += ' (Note : Connexion API Gemini indisponible, correction générée via le moteur local).';
      return mockResult;
    }
  }
}
