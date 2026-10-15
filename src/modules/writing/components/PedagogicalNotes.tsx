import React, { useState } from 'react';
import { PedagogicalNote, DelfCriterion, CEFRLevel } from '../domain/types';
import { GraduationCap, Filter } from 'lucide-react';
import { AppTranslations } from '../domain/translations';

interface PedagogicalNotesProps {
  notes: PedagogicalNote[];
  overallFeedback: string;
  translations?: AppTranslations;
  level?: CEFRLevel;
}

export const PedagogicalNotes: React.FC<PedagogicalNotesProps> = ({ notes, overallFeedback, translations, level }) => {
  const [selectedCriterion, setSelectedCriterion] = useState<DelfCriterion | 'all'>('all');

  const getCriterionLabel = (crit: DelfCriterion): string => {
    if (!translations) {
      if (crit === 'sociolinguistic') return 'Sociolinguistique';
      if (crit === 'coherence') return 'Cohérence';
      if (crit === 'grammar') return 'Morphosyntaxe';
      return 'Vocabulaire';
    }
    return translations.criteria[crit];
  };

  const filteredNotes = selectedCriterion === 'all'
    ? notes
    : notes.filter((n) => n.criterion === selectedCriterion);

  return (
    <div className="notes-section">
      <div className="notes-header">
        <GraduationCap size={18} color="var(--accent-primary)" />
        <span>
          {level
            ? (translations?.comparison.pedagogicalNotesTitle || "Notes pédagogiques B2").replace(/B2/g, level)
            : (translations?.comparison.pedagogicalNotesTitle || "Critères d'évaluation DELF B2 & Notes pédagogiques")}
        </span>
      </div>

      {overallFeedback && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          lineHeight: 1.5,
        }}>
          <strong>{translations?.comparison.overallFeedbackTitle || "Bilan général"} : </strong> {overallFeedback}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center', margin: '0.35rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Filter size={13} />
          <span>Filtrer :</span>
        </div>
        <button
          className={`btn-secondary ${selectedCriterion === 'all' ? 'active' : ''}`}
          style={{
            padding: '0.25rem 0.55rem',
            fontSize: '0.72rem',
            borderColor: selectedCriterion === 'all' ? 'var(--accent-primary)' : 'var(--border-subtle)',
          }}
          onClick={() => setSelectedCriterion('all')}
        >
          {translations?.comparison.filterAll || "Tous"} ({notes.length})
        </button>
        {(['sociolinguistic', 'coherence', 'grammar', 'vocabulary'] as DelfCriterion[]).map((crit) => {
          const count = notes.filter((n) => n.criterion === crit).length;
          if (count === 0) return null;
          return (
            <button
              key={crit}
              className={`btn-secondary ${selectedCriterion === crit ? 'active' : ''}`}
              style={{
                padding: '0.25rem 0.55rem',
                fontSize: '0.72rem',
                borderColor: selectedCriterion === crit ? 'var(--accent-primary)' : 'var(--border-subtle)',
              }}
              onClick={() => setSelectedCriterion(crit)}
            >
              {getCriterionLabel(crit)} ({count})
            </button>
          );
        })}
      </div>

      {/* Notes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredNotes.map((note) => (
          <div key={note.id} className="note-card">
            <span className={`note-badge ${note.criterion}`}>
              {getCriterionLabel(note.criterion)}
            </span>
            <div className="note-title">{note.title}</div>
            {note.originalExcerpt && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                <span style={{ textDecoration: 'line-through', color: 'var(--diff-removed-text)' }}>
                  {note.originalExcerpt}
                </span>
                <span style={{ margin: '0 0.4rem' }}>➔</span>
                <span style={{ color: 'var(--diff-added-text)', fontWeight: 500 }}>
                  {note.improvedExcerpt}
                </span>
              </div>
            )}
            <p className="note-explanation">{note.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
