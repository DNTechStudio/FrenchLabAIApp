/**
 * Taxonomy of French Logical Connectors (Connecteurs Logiques)
 * Used in Débat Arena and Writing Lab to recognize and evaluate rhetorical structure.
 */

export const CONNECTORS_TAXONOMY = {
  cause: {
    category: 'cause',
    label: 'Cause & Justification',
    color: '#38bdf8', // Light blue
    items: [
      'parce que', 'puisque', 'étant donné que', 'car', 'en raison de',
      'grâce à', 'à cause de', 'du fait de', 'vu que', 'sous prétexte que'
    ]
  },
  consequence: {
    category: 'consequence',
    label: 'Conséquence & Déduction',
    color: '#34d399', // Emerald
    items: [
      'par conséquent', "c'est pourquoi", 'ainsi', 'donc', "d'où",
      'de ce fait', 'en conséquence', 'de sorte que', 'si bien que'
    ]
  },
  opposition: {
    category: 'opposition',
    label: 'Opposition & Contraste',
    color: '#fbbf24', // Amber
    items: [
      'en revanche', 'par contre', 'alors que', 'tandis que',
      'au contraire', 'à l\'opposé', 'inversement'
    ]
  },
  concession: {
    category: 'concession',
    label: 'Concession & Nuance',
    color: '#f472b6', // Pink / Rose
    items: [
      'bien que', 'quoique', 'certes', 'même si', 'néanmoins',
      'toutefois', "il n'en reste pas moins que", 'quand bien même',
      'tout de même', 'malgré tout', 'en dépit de'
    ]
  },
  addition: {
    category: 'addition',
    label: 'Addition & Énumération',
    color: '#a78bfa', // Purple
    items: [
      "d'une part", "d'autre part", 'en premier lieu', 'de surcroît',
      'par ailleurs', 'en outre', 'de plus', 'également', 'non seulement'
    ]
  },
  conclusion: {
    category: 'conclusion',
    label: 'Conclusion & Synthèse',
    color: '#22d3ee', // Cyan
    items: [
      'en définitive', 'pour conclure', 'tout bien considéré',
      'en somme', 'finalement', 'en conclusion', 'en résumé'
    ]
  }
};

/**
 * Detects all French logical connectors in a given text.
 * Returns an array of detected instances with positions and category metadata.
 */
export function analyzeConnectors(text) {
  if (!text || typeof text !== 'string') return [];

  const normalized = text.toLowerCase();
  const detected = [];

  for (const [catKey, group] of Object.entries(CONNECTORS_TAXONOMY)) {
    for (const connector of group.items) {
      // Escape for regex and enforce word boundaries where appropriate
      const escaped = connector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      let match;
      while ((match = regex.exec(normalized)) !== null) {
        detected.push({
          connector: match[0],
          category: catKey,
          label: group.label,
          color: group.color,
          index: match.index
        });
      }
    }
  }

  // Sort by appearance in text
  return detected.sort((a, b) => a.index - b.index);
}
