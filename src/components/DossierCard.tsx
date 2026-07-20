import { motion } from 'motion/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Dropzone } from './Dropzone';
import { ErrorBanner } from './ErrorBanner';
import {
  type Dossier,
  type DossierStatus,
  dossierDisplayName,
} from '../lib/dossier';

type Props = {
  dossier: Dossier;
  index: number;
  canRemove: boolean;
  disabled: boolean;
  onChange: (patch: Partial<Pick<Dossier, 'label' | 'hercule' | 'chacal'>>) => void;
  onRemove: () => void;
};

const STATUS_META: Record<
  DossierStatus,
  { text: string; color: string; bg: string; border: string }
> = {
  'en attente': {
    text: 'En attente',
    color: 'var(--text-muted)',
    bg: 'rgba(255,255,255,0.04)',
    border: 'var(--border-subtle)',
  },
  'envoi en cours': {
    text: 'Envoi en cours',
    color: 'var(--accent-primary)',
    bg: 'rgba(243,146,0,0.1)',
    border: 'rgba(243,146,0,0.3)',
  },
  'envoyé': {
    text: 'Envoyé',
    color: 'var(--success)',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
  },
  'erreur': {
    text: 'Erreur',
    color: 'var(--error)',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.35)',
  },
};

export function DossierCard({ dossier, index, canRemove, disabled, onChange, onRemove }: Props) {
  const [herculeErr, setHerculeErr] = useState<string | null>(null);
  const [chacalErr, setChacalErr] = useState<string | null>(null);

  const name = dossierDisplayName(dossier, index);
  const status = STATUS_META[dossier.status];
  const showStatus = dossier.status !== 'en attente';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass flex w-full flex-col gap-4 rounded-2xl p-5"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-7 min-w-7 items-center justify-center rounded-lg px-2 font-mono text-xs font-semibold"
          style={{
            background: 'rgba(243,146,0,0.1)',
            border: '1px solid rgba(243,146,0,0.22)',
            color: 'var(--accent-primary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {index + 1}
        </span>
        <input
          type="text"
          value={dossier.label}
          onChange={(e) => onChange({ label: e.target.value })}
          disabled={disabled}
          placeholder={`${name} — libellé (optionnel, ex. nom client)`}
          className="flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-[color:var(--accent-primary)] disabled:opacity-50"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        />
        {showStatus && (
          <span
            className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium"
            style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.color }}
          >
            {status.text}
          </span>
        )}
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Supprimer ${name}`}
            className="shrink-0 rounded-md p-2 transition hover:bg-white/5 disabled:opacity-30"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="flex flex-col gap-2">
          <Dropzone
            label="Document Hercule"
            subtitle="Confirmation de commande"
            files={dossier.hercule}
            onFilesChange={(files) => onChange({ hercule: files })}
            onError={setHerculeErr}
            disabled={disabled}
          />
          <ErrorBanner message={herculeErr} onDismiss={() => setHerculeErr(null)} />
        </div>
        <div className="flex flex-col gap-2">
          <Dropzone
            label="Document Chacal"
            subtitle="Fiche de fabrication"
            files={dossier.chacal}
            onFilesChange={(files) => onChange({ chacal: files })}
            onError={setChacalErr}
            disabled={disabled}
          />
          <ErrorBanner message={chacalErr} onDismiss={() => setChacalErr(null)} />
        </div>
      </div>

      {dossier.status === 'erreur' && dossier.error && (
        <ErrorBanner message={dossier.error} />
      )}
    </motion.div>
  );
}
