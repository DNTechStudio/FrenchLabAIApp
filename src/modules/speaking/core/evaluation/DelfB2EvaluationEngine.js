/**
 * DelfB2EvaluationEngine: Deterministic, transparent 25-point CEFR evaluation engine
 * Aligned with France Éducation international official scoring grid, with multilingual pedagogical support.
 */

import { ScoreRubricLimits } from '../../types/index.js';
import { i18n } from '../i18n/I18nManager.js';

export class DelfB2EvaluationEngine {
  constructor() {
    this.recommendedConnectors = [
      {
        french: 'Néanmoins',
        en: 'Nevertheless / Nonetheless',
        zh: '然而 / 尽管如此',
        vi: 'Tuy nhiên / Dẫu vậy'
      },
      {
        french: 'Par conséquent',
        en: 'Consequently / Therefore',
        zh: '因此 / 从而',
        vi: 'Do đó / Bởi vậy'
      },
      {
        french: 'Il convient de souligner que',
        en: 'It should be emphasized that',
        zh: '应当强调的是',
        vi: 'Cần phải nhấn mạnh rằng'
      },
      {
        french: 'Force est de constater que',
        en: 'It is clear that / One must admit that',
        zh: '不得不承认的是',
        vi: 'Rõ ràng phải thừa nhận rằng'
      },
      {
        french: 'D’un côté... d’un autre côté',
        en: 'On one hand... on the other hand',
        zh: '一方面... 另一方面',
        vi: 'Một mặt... mặt khác'
      },
      {
        french: 'En ce qui concerne',
        en: 'Regarding / As for',
        zh: '关于 / 至于',
        vi: 'Liên quan đến / Về phần'
      },
      {
        french: 'Non seulement... mais encore',
        en: 'Not only... but also',
        zh: '不仅... 而且',
        vi: 'Không những... mà còn'
      },
      {
        french: 'Bien que (+ subjonctif)',
        en: 'Although / Even though (+ subjunctive)',
        zh: '尽管 (+ 虚拟式)',
        vi: 'Mặc dù (+ thức giả định)'
      }
    ];

    // Common French learner error heuristics with multilingual explanations
    this.grammarCheckPatterns = [
      {
        regex: /\b(un|le)\s+chose\b/i,
        category: 'morphosyntaxe',
        severity: 'moderate',
        correction: 'une chose',
        explanation: "Le mot 'chose' est un nom féminin en français.",
        localizations: {
          en: "Gender error: The noun 'chose' is feminine in French ('une chose').",
          zh: "词性错误：'chose' 在法语中是阴性名词，应使用 'une chose'。",
          vi: "Lỗi giống từ: Danh từ 'chose' là giống cái trong tiếng Pháp ('une chose')."
        }
      },
      {
        regex: /\b(les\s+gens)\s+(il|elle)\b/i,
        category: 'morphosyntaxe',
        severity: 'critical',
        correction: 'les gens ils / ils',
        explanation: "Accord sujet-verbe : 'les gens' est un pluriel et commande la 3e personne du pluriel.",
        localizations: {
          en: "Subject-verb agreement: 'les gens' is plural and requires a 3rd-person plural verb.",
          zh: "主谓一致错误：'les gens' 为复数主语，必须搭配第三人称复数动词。",
          vi: "Hòa hợp chủ vị: 'les gens' là danh từ số nhiều, bắt buộc chia động từ ngôi thứ 3 số nhiều."
        }
      },
      {
        regex: /\bje\s+suis\s+d'accord\s+avec\s+ça\b/i,
        category: 'lexique',
        severity: 'minor',
        correction: "je partage ce point de vue / j'y souscris",
        explanation: "Registre B2/C1 : privilégier des formules plus soutenues que 'avec ça'.",
        localizations: {
          en: "Register refinement: Prefer formal expressions like 'je partage ce point de vue' over informal 'avec ça'.",
          zh: "语体升级建议：在B2口语中，建议使用 'je partage ce point de vue' 替代口语化的 'avec ça'。",
          vi: "Nâng cao sắc thái: Nên dùng cụm từ trang trọng như 'je partage ce point de vue' thay vì văn nói 'avec ça'."
        }
      },
      {
        regex: /\baprès\s+que\s+je\s+sois\b/i,
        category: 'morphosyntaxe',
        severity: 'moderate',
        correction: 'après que je fus / après avoir été',
        explanation: "Règle classique : 'après que' est traditionnellement suivi de l'indicatif.",
        localizations: {
          en: "Mood error: 'après que' traditionally takes the indicative mood, not the subjunctive.",
          zh: "语式错误：传统语法中，'après que' 表时间先后，其后接直陈式而非虚拟式。",
          vi: "Lỗi thức: Cụm từ 'après que' diễn tả hành động đã xảy ra nên đi với lối trực trình (indicatif)."
        }
      }
    ];
  }

  async evaluateSession({ triggerDocument, monologue, debateTurns = [] }) {
    const monoText = monologue?.transcript || '';
    const monoDuration = monologue?.durationSeconds || 0;
    const debateCount = debateTurns.length;
    const currentLocale = i18n.getLocale();

    // 1. Monologue Suivi (/9.0)
    let presentationProblematique = 2.0;
    if (monoText.length > 250 && monoDuration >= 240) presentationProblematique = 2.5;
    if (monoText.length > 400 && monoDuration >= 300) presentationProblematique = 3.0;
    if (monoDuration < 120) presentationProblematique = 1.0;

    let argumentationExemples = 2.0;
    if (monoText.includes('par exemple') || monoText.includes('notamment') || monoText.includes('ainsi')) {
      argumentationExemples += 0.5;
    }
    if (monoText.includes('d’une part') || monoText.includes("d'autre part") || monoText.includes('premièrement')) {
      argumentationExemples += 0.5;
    }
    argumentationExemples = Math.min(3.0, argumentationExemples);

    let coherenceOrganisation = 2.0;
    if (monoText.includes('en conclusion') || monoText.includes('pour conclure') || monoText.includes('finalement')) {
      coherenceOrganisation += 0.5;
    }
    if (monoText.includes('cependant') || monoText.includes('néanmoins') || monoText.includes('toutefois')) {
      coherenceOrganisation += 0.5;
    }
    coherenceOrganisation = Math.min(3.0, coherenceOrganisation);

    const monologueSubtotal = Number((presentationProblematique + argumentationExemples + coherenceOrganisation).toFixed(1));

    // 2. Débat (/6.0)
    let defensePointDeVue = 2.0;
    let reactiviteInteraction = 2.0;

    if (debateCount >= 3) {
      defensePointDeVue = 2.5;
      reactiviteInteraction = 2.5;
      const totalDebateWords = debateTurns.reduce((acc, t) => acc + (t.candidateTranscript?.length || 0), 0);
      if (totalDebateWords > 200) {
        defensePointDeVue = 3.0;
        reactiviteInteraction = 3.0;
      }
    } else if (debateCount === 0) {
      defensePointDeVue = 0.5;
      reactiviteInteraction = 0.5;
    }

    const debatSubtotal = Number((defensePointDeVue + reactiviteInteraction).toFixed(1));

    // 3. Linguistic Competence (/10.0)
    let lexique = 3.0;
    const detectedConnectors = this.recommendedConnectors.filter(c => 
      monoText.toLowerCase().includes(c.french.toLowerCase()) || 
      debateTurns.some(t => t.candidateTranscript?.toLowerCase().includes(c.french.toLowerCase()))
    );
    if (detectedConnectors.length >= 3) lexique = 3.5;
    if (detectedConnectors.length >= 5) lexique = 4.0;
    if (monoText.length < 150) lexique = 2.0;

    const detectedErrors = this.detectErrors(monoText, debateTurns);
    let morphosyntaxe = 4.0;
    if (detectedErrors.length === 0) morphosyntaxe = 4.5;
    if (detectedErrors.length >= 2) morphosyntaxe = 3.5;
    if (detectedErrors.length >= 4) morphosyntaxe = 2.5;
    if (monoText.includes('bien que') || monoText.includes('conditionnel')) {
      morphosyntaxe = Math.min(5.0, morphosyntaxe + 0.5);
    }

    let phonologie = 1.0;
    if (monoDuration < 120 && debateCount === 0) phonologie = 0.5;

    const linguisticSubtotal = Number((lexique + morphosyntaxe + phonologie).toFixed(1));
    const totalScore = Number((monologueSubtotal + debatSubtotal + linguisticSubtotal).toFixed(1));
    const isPassing = totalScore >= ScoreRubricLimits.PASS_THRESHOLD && totalScore >= ScoreRubricLimits.ELIMINATORY_MARK;

    const lexicalRecommendations = this.recommendedConnectors
      .filter(c => !detectedConnectors.some(dc => dc.french === c.french))
      .slice(0, 4);

    return {
      id: 'eval-' + Date.now(),
      createdAt: Date.now(),
      totalScore,
      isPassing,
      scoreBreakdown: {
        monologue: {
          presentationProblematique,
          argumentationExemples,
          coherenceOrganisation,
          subtotal: monologueSubtotal
        },
        debat: {
          defensePointDeVue,
          reactiviteInteraction,
          subtotal: debatSubtotal
        },
        linguistic: {
          lexique,
          morphosyntaxe,
          phonologie,
          subtotal: linguisticSubtotal
        }
      },
      linguisticErrors: detectedErrors,
      lexicalRecommendations,
      qualitativeSynthesis: this.getLocalizedSynthesis(currentLocale, monoDuration, debateCount, detectedErrors.length, detectedConnectors.length)
    };
  }

  detectErrors(monoText, debateTurns) {
    const errors = [];
    const allText = monoText + ' ' + debateTurns.map(d => d.candidateTranscript || '').join(' ');

    this.grammarCheckPatterns.forEach((item, idx) => {
      const match = allText.match(item.regex);
      if (match) {
        errors.push({
          id: 'err-' + idx,
          category: item.category,
          severity: item.severity,
          originalSnippet: match[0],
          suggestedCorrection: item.correction,
          explanation: item.explanation,
          localizations: item.localizations
        });
      }
    });

    return errors;
  }

  getLocalizedSynthesis(locale, monoDuration, debateCount, errorCount, connectorCount) {
    if (locale === 'vi') {
      return {
        strengths: [
          monoDuration >= 300 
            ? 'Phân bổ thời gian thuyết trình chuẩn mực (đạt mốc 5 đến 7 phút theo quy định).'
            : 'Mở đầu bài nói tự tin với cấu trúc dàn ý rõ ràng.',
          debateCount >= 3 
            ? 'Phản xạ đối thoại nhanh nhẹn trước các câu hỏi phản biện của giám khảo.'
            : 'Bảo vệ được lập trường chính trong suốt cuộc trao đổi.'
        ],
        weaknesses: [
          errorCount > 0 
            ? 'Cần chú ý hơn về hòa hợp giống/số và cách dùng thức giả định (subjonctif).'
            : 'Tiếp tục mở rộng vốn từ vựng học thuật để diễn đạt tinh tế hơn.',
          connectorCount < 3
            ? 'Bổ sung thêm các từ nối logic B2/C1 để liên kết các luận điểm mượt mà hơn.'
            : 'Đưa ra thêm dẫn chứng thực tế phong phú hơn trong phần đối thoại.'
        ],
        actionPlan: [
          'Luyện tập sử dụng thức giả định (subjonctif) sau các liên từ nhượng bộ (bien que, quoique).',
          'Thay thế các từ ngữ thông thường bằng các cấu trúc diễn đạt B2/C1 nâng cao.',
          'Rèn luyện kỹ năng bảo vệ quan điểm khi giám khảo đặt câu hỏi nghi vấn ngược lại.'
        ]
      };
    } else if (locale === 'zh') {
      return {
        strengths: [
          monoDuration >= 300 
            ? '陈述时间把控精准，完全符合官方5-7分钟时长标准。'
            : '口语表达自然，提纲引言逻辑清晰。',
          debateCount >= 3 
            ? '在辩论互动中应对敏捷，能迅速组织法语反驳。'
            : '在整场辩论中立场坚定，观点明确。'
        ],
        weaknesses: [
          errorCount > 0 
            ? '注意部分阴阳性配合与虚拟式/直陈式的语法规范。'
            : '继续拓宽B2高级词汇量以增强用词精准度。',
          connectorCount < 3
            ? '建议增加B2/C1逻辑连接词的使用，使论证更为紧凑严密。'
            : '在辩论环节可增加更多具体的个人实际事例。'
        ],
        actionPlan: [
          '系统复习虚拟式在表示让步的连词短语 (bien que, quoique) 后的用法。',
          '减少泛泛而谈的口头套话，改用更具说服力的学术表达。',
          '强化面对考官质疑时的反驳与论证防守技巧。'
        ]
      };
    } else if (locale === 'en') {
      return {
        strengths: [
          monoDuration >= 300 
            ? 'Excellent time management strictly adhering to the 5–7 minute speaking window.'
            : 'Confident oral delivery with a clearly identifiable problem statement.',
          debateCount >= 3 
            ? 'Highly responsive and agile interaction during the examiner debate turns.'
            : 'Clear and consistent defense of the main thesis.'
        ],
        weaknesses: [
          errorCount > 0 
            ? 'Mind grammatical agreements and subjunctive mood triggers.'
            : 'Expand nuanced lexical registers to elevate vocabulary precision.',
          connectorCount < 3
            ? 'Incorporate more sophisticated B2/C1 connectors to enhance discourse cohesion.'
            : 'Provide deeper concrete counter-examples during debate exchanges.'
        ],
        actionPlan: [
          'Practice automatic use of the subjunctive mood following concessive conjunctions (bien que, quoique).',
          'Diversify argumentative vocabulary away from repetitive phrases like "je pense que".',
          'Strengthen counter-argumentation techniques when challenged by the examiner.'
        ]
      };
    }

    // Default French
    return {
      strengths: [
        monoDuration >= 300 
          ? 'Bonne gestion du temps d’exposé respectant le créneau des 5 à 7 minutes.'
          : 'Prise de parole spontanée avec amorce de plan identifiable.',
        debateCount >= 3 
          ? 'Participation active et réactive aux relances de l’examinateur.'
          : 'Expression claire des idées principales.'
      ],
      weaknesses: [
        errorCount > 0 
          ? 'Quelques hésitations d’accords morphosyntaxiques et de concordance des temps.'
          : 'Poursuivre l’enrichissement des nuances lexicales.',
        connectorCount < 3
          ? 'Intégrer davantage de connecteurs logiques de niveau B2/C1 pour fluidifier les transitions.'
          : 'Développer des contre-exemples plus approfondis pendant le débat.'
      ],
      actionPlan: [
        'Pratiquer l’emploi systématique du subjonctif après les locutions concessives (bien que, quoique).',
        'Varier le lexique d’argumentation pour éviter les répétitions.',
        'Consolider les techniques de défense d’opinion face aux objections.'
      ]
    };
  }
}
