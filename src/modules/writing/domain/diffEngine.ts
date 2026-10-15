import type { DiffToken } from './types.ts';

/**
 * Computes word-level diff between original and improved French essay using
 * Longest Common Subsequence (LCS) algorithm.
 * Preserves all whitespace and punctuation for natural paragraph rendering.
 */
export function computeWordDiff(originalText: string, improvedText: string): DiffToken[] {
  if (!originalText && !improvedText) return [];
  if (!originalText) return [{ value: improvedText, type: 'added' }];
  if (!improvedText) return [{ value: originalText, type: 'removed' }];

  // Tokenize preserving words and whitespace sequences
  const tokenize = (text: string): string[] => {
    return text.match(/\S+|\s+/g) || [];
  };

  const words1 = tokenize(originalText);
  const words2 = tokenize(improvedText);

  const m = words1.length;
  const n = words2.length;

  // Build LCS matrix
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (words1[i - 1] === words2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to assemble diff tokens
  let i = m;
  let j = n;
  const rawTokens: DiffToken[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && words1[i - 1] === words2[j - 1]) {
      rawTokens.push({ value: words1[i - 1], type: 'unchanged' });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawTokens.push({ value: words2[j - 1], type: 'added' });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawTokens.push({ value: words1[i - 1], type: 'removed' });
      i--;
    }
  }

  rawTokens.reverse();

  // Merge contiguous tokens of the same type for clean DOM rendering
  const merged: DiffToken[] = [];
  for (const token of rawTokens) {
    if (merged.length > 0 && merged[merged.length - 1].type === token.type) {
      merged[merged.length - 1].value += token.value;
    } else {
      merged.push({ ...token });
    }
  }

  return merged;
}
