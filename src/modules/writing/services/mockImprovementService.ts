import type { ImprovementResult, PedagogicalNote } from '../domain/types.ts';
import { computeWordDiff } from '../domain/diffEngine.ts';
import type { ImprovementRequest, ImprovementService } from './improvementService.ts';

export class MockImprovementService implements ImprovementService {
  public async improveEssay(request: ImprovementRequest): Promise<ImprovementResult> {
    // Simulate brief network/AI latency (350ms) for realistic UX feel
    await new Promise((resolve) => setTimeout(resolve, 350));

    const targetLevel = request.targetLevel || 'B2';
    const original = request.essayContent.trim();

    return this.generateByLevel(request, original);
  }

  public generateByLevel(request: ImprovementRequest, original: string): ImprovementResult {
    const targetLevel = request.targetLevel || 'B2';
    switch (targetLevel) {
      case 'A1':
        return this.generateA1(request, original);
      case 'A2':
        return this.generateA2(request, original);
      case 'B1':
        return this.generateB1(request, original);
      case 'C1':
        return this.generateC1(request, original);
      case 'C2':
        return this.generateC2(request, original);
      case 'B2':
      default:
        return this.generateB2(request, original);
    }
  }

  // A1: Discovery - Simple basic phrases, daily vocabulary, present tense
  private generateA1(request: ImprovementRequest, original: string): ImprovementResult {
    const isLetter = request.promptId.startsWith('lettre');
    let improved = '';

    if (isLetter) {
      improved = `Bonjour Monsieur,\n\nJe vous écris un message. Dans notre quartier, ce projet n'est pas bon. Beaucoup de personnes aiment les arbres et la nature. Les enfants jouent dans le parc.\n\nS'il vous plaît, pensez aux habitants.\n\nMerci beaucoup.\nAu revoir.`;
    } else {
      improved = `Bonjour tout le monde,\n\nJe donne mon avis sur ce sujet. Je pense que ce n'est pas bien pour nous. La nature est très importante pour la santé. Les gens ont besoin de calme.\n\nMerci pour votre lecture.`;
    }

    const notes: PedagogicalNote[] = [
      {
        id: 'note-a1-1',
        criterion: 'grammar',
        title: 'Phrases simples au présent de l\'indicatif',
        improvedExcerpt: 'Je vous écris un message... Beaucoup de personnes aiment...',
        explanation: 'Au niveau A1, les structures sont juxtaposées et utilisent exclusivement le présent de l\'indicatif et des phrases affirmatives ou négatives élémentaires.',
      },
      {
        id: 'note-a1-2',
        criterion: 'vocabulary',
        title: 'Vocabulaire concret du quotidien',
        improvedExcerpt: 'arbres, nature, enfants, parc, quartier',
        explanation: 'Le répertoire lexical A1 se limite aux mots concrets et indispensables de la vie quotidienne.',
      },
      {
        id: 'note-a1-3',
        criterion: 'sociolinguistic',
        title: 'Salutations et politesse de base',
        improvedExcerpt: 'Bonjour Monsieur... S\'il vous plaît... Merci beaucoup',
        explanation: 'Niveau d\'entrée : utilisation des formules de civilité les plus simples du français.',
      },
    ];

    const diffTokens = computeWordDiff(original, improved);

    return {
      promptId: request.promptId,
      originalText: original,
      improvedText: improved,
      diffTokens,
      pedagogicalNotes: notes,
      overallFeedback: 'Version A1 (Découverte) : Phrases courtes et directes, temps présent simple, vocabulaire concret du quotidien.',
      evaluatedAt: Date.now(),
      targetLevel: 'A1',
      isAutonomous: !original.trim(),
    };
  }

  // A2: Elementary - Everyday situations, passé composé, basic connectors (et, mais, parce que)
  private generateA2(request: ImprovementRequest, original: string): ImprovementResult {
    const isLetter = request.promptId.startsWith('lettre');
    let improved = '';

    if (isLetter) {
      improved = `Bonjour Monsieur le Maire,\n\nJe vous écris cette lettre parce que j'ai appris le nouveau projet pour notre ville. À mon avis, c'est une mauvaise idée. Dans notre quartier, il y a déjà beaucoup de commerces, mais il n'y a pas assez d'espaces verts.\n\nLa semaine dernière, j'ai discuté avec mes voisins et ils sont aussi inquiets pour leurs enfants. C'est pourquoi nous voulons garder les parcs.\n\nMerci pour votre attention.\nCordialement,\nUn habitant du quartier.`;
    } else {
      improved = `Bonjour à tous,\n\nJe veux donner mon opinion sur ce projet. J'ai lu les articles récents et je pense que ce n'est pas une bonne solution. D'abord, cela coûte très cher et ensuite, les habitants préfèrent protéger la nature.\n\nL'année dernière, nous avons déjà vu les conséquences négatives de ces décisions. Il faut donc faire attention.\n\nBonne journée à tous.`;
    }

    const notes: PedagogicalNote[] = [
      {
        id: 'note-a2-1',
        criterion: 'grammar',
        title: 'Alternance du présent et du passé composé',
        improvedExcerpt: 'j\'ai appris le nouveau projet... j\'ai discuté avec mes voisins',
        explanation: 'Au niveau A2, le candidat sait relater un événement passé simple en utilisant le passé composé.',
      },
      {
        id: 'note-a2-2',
        criterion: 'coherence',
        title: 'Connecteurs logiques élémentaires',
        improvedExcerpt: 'parce que, mais, c\'est pourquoi, d\'abord, ensuite',
        explanation: 'Les phrases sont reliées par des conjonctions de coordination courantes pour exprimer la cause et l\'opposition directe.',
      },
      {
        id: 'note-a2-3',
        criterion: 'sociolinguistic',
        title: 'Registre courant adapté',
        improvedExcerpt: 'Bonjour Monsieur le Maire... Cordialement',
        explanation: 'Formules de politesse standard adaptées à une communication courante sans formalisme excessif.',
      },
    ];

    const diffTokens = computeWordDiff(original, improved);

    return {
      promptId: request.promptId,
      originalText: original,
      improvedText: improved,
      diffTokens,
      pedagogicalNotes: notes,
      overallFeedback: 'Version A2 (Élémentaire) : Narration au passé composé, connecteurs simples (et, mais, parce que) et expression directe des sentiments.',
      evaluatedAt: Date.now(),
      targetLevel: 'A2',
      isAutonomous: !original.trim(),
    };
  }

  // B1: Intermediate - Connected discourse, structured arguments, standard opinion expressions
  private generateB1(request: ImprovementRequest, original: string): ImprovementResult {
    const isLetter = request.promptId.startsWith('lettre');
    let improved = '';

    if (isLetter) {
      improved = `Monsieur le Maire,\n\nEn tant que résident engagé de notre commune, je me permets de vous écrire afin de vous faire part de mes inquiétudes concernant le projet de réaménagement récemment annoncé.\n\nEn premier lieu, je constate que ce chantier va réduire considérablement les zones végétalisées, alors que notre ville souffre déjà de la pollution. De plus, les commerces de proximité risquent de fermer à cause de cette nouvelle concurrence. Bien que je comprenne le besoin de moderniser nos infrastructures, je pense qu'il est indispensable de préserver notre cadre de vie.\n\nC'est pourquoi je vous demande d'organiser une réunion publique pour consulter les riverains.\n\nDans l'attente de votre réponse, je vous prie d'agréer, Monsieur le Maire, mes salutations respectueuses.\n\nUn représentant des riverains.`;
    } else {
      improved = `Chers membres du forum,\n\nJe souhaite réagir à ce débat passionnant qui nous concerne tous directement. À mon sens, il est indéniable que la transition écologique doit rester la priorité absolue de notre génération.\n\nD'un côté, certains privilégient la rentabilité financière immédiate. Mais d'un autre côté, nous constatons chaque jour les conséquences néfastes sur notre santé et notre bien-être. C'est la raison pour laquelle nous devons privilégier des alternatives durables et solidaires.\n\nEt vous, qu'en pensez-vous ? N'hésitez pas à partager vos témoignages.`;
    }

    const notes: PedagogicalNote[] = [
      {
        id: 'note-b1-1',
        criterion: 'coherence',
        title: 'Organisation chronologique et logique',
        improvedExcerpt: 'En premier lieu... De plus... Bien que... C\'est pourquoi...',
        explanation: 'Au niveau B1, le candidat sait articuler ses arguments de manière fluide et structurée.',
      },
      {
        id: 'note-b1-2',
        criterion: 'vocabulary',
        title: 'Nuances d\'opinion et lexique thématique',
        improvedExcerpt: 'résident engagé, zones végétalisées, commerces de proximité, cadre de vie',
        explanation: 'Utilisation d\'un lexique fonctionnel précis en lien direct avec la thématique citoyenne.',
      },
      {
        id: 'note-b1-3',
        criterion: 'grammar',
        title: 'Subordonnées circonstancielles et concessions',
        improvedExcerpt: 'Bien que je comprenne... alors que notre ville souffre...',
        explanation: 'Introduction de propositions subordonnées complexes (concession, opposition, cause).',
      },
    ];

    const diffTokens = computeWordDiff(original, improved);

    return {
      promptId: request.promptId,
      originalText: original,
      improvedText: improved,
      diffTokens,
      pedagogicalNotes: notes,
      overallFeedback: 'Version B1 (Intermédiaire) : Discours articulé avec connecteurs variés, argumentation cohérente et vocabulaire thématique précis.',
      evaluatedAt: Date.now(),
      targetLevel: 'B1',
      isAutonomous: !original.trim(),
    };
  }

  // B2: Upper Intermediate (DELF B2 Exam Standard) - Formal register, subjunctive, varied connectors
  private generateB2(request: ImprovementRequest, original: string): ImprovementResult {
    const isLetter = request.promptId.startsWith('lettre');
    const improved = isLetter
      ? `Monsieur le Maire,

En tant que représentant dévoué du collectif citoyen des résidents de notre commune, je me permets de porter respectueusement à votre haute attention nos plus vives préoccupations quant au vaste projet d'aménagement urbain récemment rendu public par les services municipaux.

En premier lieu, il me semble indéniable que la réduction drastique des espaces végétalisés portera un préjudice irréversible à la biodiversité locale ainsi qu'au bien-être quotidien de l'ensemble de nos concitoyens. Alors que le dérèglement climatique impose la multiplication urgente d'îlots de fraîcheur au cœur même de nos cités, sacrifier ces zones indispensables de respiration au profit exclusif d'infrastructures commerciales s'avère manifestement contraire à l'intérêt général.

De surcroît, ce projet d'envergure risque d'engendrer une saturation routière permanente particulièrement préjudiciable à la tranquillité des riverains, tout en aggravant notablement la pollution sonore et atmosphérique. Loin de stimuler l'économie de proximité, pareille orientation pourrait au contraire fragiliser le tissu précieux des artisans et des commerces traditionnels de notre centre-ville historique.

Bien que nous comprenions parfaitement les impératifs budgétaires et économiques guidant les arbitrages municipaux, nous estimons impératif qu'une véritable concertation publique transparente soit organisée sans délai. Dès lors, nous vous suggérons avec insistance de privilégier un compromis ambitieux qui concilierait harmonieusement les nécessités légitimes de modernisation urbaine et la préservation stricte de notre patrimoine végétal.

Dans l'attente d'une décision concertée et résolument soucieuse de la qualité de vie durable de vos administrés, je vous prie d'agréer, Monsieur le Maire, l'expression de ma considération la plus distinguée.

Pour le collectif des résidents engagés`
      : `À l'attention des participants au débat,

Je souhaite apporter aujourd'hui une contribution constructive et approfondie au débat actuel concernant l'avenir de nos modes de travail et les mutations organisationnelles qui transforment notre quotidien professionnel.

D'une part, il me semble indéniable que le développement du télétravail offre des opportunités considérables aux salariés comme aux entreprises contemporaines. Cette flexibilité accrue favorise une conciliation harmonieuse entre vie professionnelle et engagements personnels, tout en allégeant substantiellement les temps de trajet quotidiens et les émissions polluantes associées aux transports individuels. Les gains en autonomie et en efficacité opérationnelle sont d'ailleurs largement corroborés par de multiples observations de terrain.

D'autre part, néanmoins, force est de constater que la généralisation précipitée du travail à distance n'est point dépourvue d'écueils majeurs. L'effacement progressif des frontières temporelles entre travail et sphère privée expose nombre de collaborateurs à des risques réels de surmenage psychologique et d'isolement social. De surcroît, la cohésion d'équipe et la transmission informelle des savoirs se trouvent parfois grandement affaiblies par l'absence d'interactions directes régulières au sein des locaux.

En conclusion, il est impératif que les partenaires sociaux instaurent un cadre réglementaire équilibré combinant souplesse organisationnelle et droit effectif à la déconnexion, afin de garantir un épanouissement professionnel pérenne pour chacun.`;

    const notes: PedagogicalNote[] = [
      {
        id: 'note-b2-model-1',
        criterion: 'sociolinguistic',
        title: isLetter ? "Formule d'appel et protocole épistolaire B2" : "Registre soutenu et prise de position argumentée",
        improvedExcerpt: isLetter ? "Monsieur le Maire... je vous prie d'agréer..." : "À l'attention des participants... Je souhaite apporter une contribution...",
        explanation: "Exemple de salutation protocolaire et de clôture formelle requises dans les épreuves officielles DELF B2.",
      },
      {
        id: 'note-b2-model-2',
        criterion: 'coherence',
        title: "Connecteurs argumentatifs formels et progression logique",
        improvedExcerpt: "En premier lieu... De surcroît... Bien que... Dès lors...",
        explanation: "Structure rigoureusement articulée guidant le lecteur à travers les différents arguments.",
      },
      {
        id: 'note-b2-model-3',
        criterion: 'grammar',
        title: "Subordonnées complexes et modes impersonnels",
        improvedExcerpt: "Alors que le réchauffement impose... il nous semble impératif qu'une concertation soit organisée...",
        explanation: "Maîtrise des structures syntaxiques complexes (subjonctif après 'impératif que', concessions).",
      },
      {
        id: 'note-b2-model-4',
        criterion: 'vocabulary',
        title: "Lexique abstrait, précis et valorisant",
        improvedExcerpt: "réduction drastique, préjudice irréversible, îlots de fraîcheur, arbitrages municipaux",
        explanation: "Utilisation d'un vocabulaire thématique soutenu adapté aux enjeux sociétaux contemporains.",
      },
    ];

    const diffTokens = computeWordDiff(original, improved);

    return {
      promptId: request.promptId,
      originalText: original,
      improvedText: improved,
      diffTokens,
      pedagogicalNotes: notes,
      overallFeedback: "Version B2 (Intermédiaire supérieur - Modèle) : Exemple complet de production écrite conforme aux critères d'évaluation de l'examen DELF B2 (250+ mots, argumentation articulée, registre soutenu).",
      evaluatedAt: Date.now(),
      targetLevel: 'B2',
      isAutonomous: !original.trim(),
    };
  }

  // C1: Advanced - Stylistic nuances, inverted syntax, elevated vocabulary, rhetorical precision
  private generateC1(request: ImprovementRequest, original: string): ImprovementResult {
    const isLetter = request.promptId.startsWith('lettre');
    let improved = '';

    if (isLetter) {
      improved = `Monsieur le Maire,\n\nPermettez-moi de porter respectueusement à votre haute attention de vives préoccupations citoyennes quant aux incidences urbanistiques et environnementales inhérentes au projet récemment soumis à délibération.\n\nLoin de constituer un catalyseur d'essor économique pérenne, pareille initiative risquerait d'altérer irrémédiablement l'harmonie sociale de notre agglomération. Force est de constater que la densification excessive fragilise nos équilibres écologiques les plus élémentaires. Nul ne saurait occulter l'impérieuse nécessité de préserver nos poumons verts face aux séductions éphémères du mercantilisme.\n\nDussé-je insister sur la gravité de la situation, il m'apparaît capital qu'une concertation d'envergure soit promptement initiée avec le corps citoyen.\n\nDans l'attente d'une décision éclairée guidée par l'intérêt général, je vous prie d'agréer, Monsieur le Maire, l'hommage de ma considération la plus distinguée.\n\nPour le collectif civique des administrés.`;
    } else {
      improved = `Chers concitoyens et participants au débat,\n\nQu'il me soit permis d'apporter un éclairage prospectif sur cette épineuse problématique. Il serait réducteur, voire préjudiciable, d'envisager ce dossier sous le seul prisme des contingences économiques immédiates.\n\nEn effet, la soutenabilité environnementale ne saurait être reléguée au rang de variable d'ajustement. Bien que certains arguent de la complexité des mutations sociétales, il incombe aux forces vives de la nation d'impulser une dynamique vertueuse. Dès lors, conjuguer lucidité écologique et prospérité partagée demeure le véritable défi contemporain auquel nous devons collectivement répondre.`;
    }

    const notes: PedagogicalNote[] = [
      {
        id: 'note-c1-1',
        criterion: 'grammar',
        title: 'Syntaxe sophistiquée et subjonctif inversé',
        improvedExcerpt: 'Dussé-je insister... Qu\'il me soit permis de... Nul ne saurait occulter...',
        explanation: 'Le niveau C1 se distingue par une maîtrise intuitive de tournures syntaxiques rares (inversion stylistique, conditionnel épistémique).',
      },
      {
        id: 'note-c1-2',
        criterion: 'vocabulary',
        title: 'Lexique académique et figures rhétoriques',
        improvedExcerpt: 'catalyseur d\'essor, impérieuse nécessité, variable d\'ajustement, dynamique vertueuse',
        explanation: 'Emploi de collocations abstraites hautement valorisées dans les écrits académiques et professionnels avancés.',
      },
      {
        id: 'note-c1-3',
        criterion: 'sociolinguistic',
        title: 'Élégance diplomatique et protocolaire',
        improvedExcerpt: 'porter respectueusement à votre haute attention... l\'hommage de ma considération la plus distinguée',
        explanation: 'Nuance et déférence parfaite dans l\'interpellation institutionnelle sans emphase superflue.',
      },
    ];

    const diffTokens = computeWordDiff(original, improved);

    return {
      promptId: request.promptId,
      originalText: original,
      improvedText: improved,
      diffTokens,
      pedagogicalNotes: notes,
      overallFeedback: 'Version C1 (Autonome) : Style raffiné, syntaxe complexe, vocabulaire abstrait de haut vol et finesse argumentative.',
      evaluatedAt: Date.now(),
      targetLevel: 'C1',
      isAutonomous: !original.trim(),
    };
  }

  // C2: Mastery - Academic eloquence, literary precision, native eloquence
  private generateC2(request: ImprovementRequest, original: string): ImprovementResult {
    const isLetter = request.promptId.startsWith('lettre');
    let improved = '';

    if (isLetter) {
      improved = `Monsieur le Premier Magistrat,\n\nQu'il me soit permis de soumettre à votre sagacité quelques réflexions empreintes de gravité touchant au devenir de notre cité et aux arbitrages récents de la municipalité.\n\nL'entreprise envisagée, en ce qu'elle procède d'une vision par trop contingente de l'espace civique, porte en germe une dénaturation profonde de notre patrimoine commun. Il échoit dès lors à la puissance publique de ne point sacrifier à des impératifs mercantiles ce qui constitue le socle immémorial de notre qualité d'être au monde. L'impératif écologique, loin de s'ériger en entrave, s'affirme comme le garant indépassable de toute pérennité.\n\nPénétré de la conviction que votre magistère saura privilégier la grandeur du bien commun, je vous prie de croire, Monsieur, en l'assurance de ma très haute considération.\n\nUn citoyen au nom de la postérité communale.`;
    } else {
      improved = `À l'attention de l'assemblée délibérante,\n\nAborder pareille controverse exige que l'on se dépouille des sophismes d'usage pour embrasser la complexité intrinsèque du fait contemporain. Sous les oripeaux de la modernité triomphante se dissimule trop souvent une fuite en avant délétère pour nos équilibres anthropologiques et naturels.\n\nC'est pourquoi il importe de réhabiliter une pensée de la mesure, où le progrès technique et économique s'ordonne rigoureusement aux exigences transcendantes de la dignité humaine et de l'intégrité biosphérique.`;
    }

    const notes: PedagogicalNote[] = [
      {
        id: 'note-c2-1',
        criterion: 'vocabulary',
        title: 'Précision littéraire et richesse lexicale native',
        improvedExcerpt: 'sagacité, arbitrages, dénaturation, socle immémorial, oripeaux, transcendantes',
        explanation: 'Au niveau C2, le vocabulaire atteint une précision d\'orfèvre, digne des meilleurs écrits d\'intellectuels ou d\'éditorialistes francophones.',
      },
      {
        id: 'note-c2-2',
        criterion: 'coherence',
        title: 'Rhétorique classique et dialectique magistrale',
        improvedExcerpt: 'en ce qu\'elle procède de... Il échoit dès lors à... loin de s\'ériger en... s\'affirme comme...',
        explanation: 'Maîtrise absolue du rythme des périodes oratoires et de la progression argumentative.',
      },
      {
        id: 'note-c2-3',
        criterion: 'grammar',
        title: 'Morphosyntaxe d\'exception',
        improvedExcerpt: 'ne point sacrifier... Pénétré de la conviction que votre magistère saura...',
        explanation: 'Maniement sans faille des participes apposés, des négations littéraires et des constructions complexes.',
      },
    ];

    const diffTokens = computeWordDiff(original, improved);

    return {
      promptId: request.promptId,
      originalText: original,
      improvedText: improved,
      diffTokens,
      pedagogicalNotes: notes,
      overallFeedback: 'Version C2 (Maîtrise) : Éloquence littéraire et académique souveraine, perfection formelle et totale aisance stylistique native.',
      evaluatedAt: Date.now(),
      targetLevel: 'C2',
      isAutonomous: !original.trim(),
    };
  }
}

export function getDefaultModelEssay(promptId: string, level: string = 'B2'): string {
  const service = new MockImprovementService();
  const req: ImprovementRequest = {
    promptId,
    promptTitle: '',
    promptScenario: '',
    promptInstructions: '',
    essayContent: '',
    targetLevel: level as any,
    isAutonomous: true,
  };
  return service.generateByLevel(req, '').improvedText;
}

