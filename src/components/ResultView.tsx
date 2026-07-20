import { motion } from 'motion/react';
import { AlertTriangle, Check, Mail, RefreshCw, RotateCcw } from 'lucide-react';

export type DossierFailure = {
  label: string;
  error?: string;
};

type Props = {
  total: number;
  failures: DossierFailure[];
  onReset: () => void;
  onRetryFailed?: () => void;
};

export function ResultView({ total, failures, onReset, onRetryFailed }: Props) {
  const failed = failures.length;
  const sent = total - failed;
  const allOk = failed === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full max-w-md flex-col items-center gap-8 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full"
        style={{
          background: allOk ? 'rgba(16,185,129,0.12)' : 'rgba(243,146,0,0.12)',
          border: `1px solid ${allOk ? 'rgba(16,185,129,0.3)' : 'rgba(243,146,0,0.3)'}`,
          boxShadow: `0 0 48px ${allOk ? 'rgba(16,185,129,0.2)' : 'rgba(243,146,0,0.2)'}`,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.25 }}
        >
          {allOk ? (
            <Check size={44} strokeWidth={3} style={{ color: 'var(--success)' }} />
          ) : (
            <AlertTriangle size={40} strokeWidth={2.5} style={{ color: 'var(--accent-primary)' }} />
          )}
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: 'var(--text-primary)' }}
      >
        {allOk
          ? `${sent} dossier${sent > 1 ? 's' : ''} envoyé${sent > 1 ? 's' : ''}`
          : `${sent}/${total} envoyé${sent > 1 ? 's' : ''}`}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="glass flex w-full items-start gap-3 rounded-2xl px-5 py-4 text-left"
      >
        <Mail size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
          Vous recevrez un rapport par email pour chacun.
        </p>
      </motion.div>

      {failed > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="flex w-full flex-col gap-2 rounded-2xl px-5 py-4 text-left"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
          }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--error)' }}>
            {failed} dossier{failed > 1 ? 's' : ''} en échec
          </span>
          <ul className="flex flex-col gap-1.5">
            {failures.map((f, i) => (
              <li key={`${f.label}-${i}`} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {f.label}
                </span>
                {f.error ? ` — ${f.error}` : ''}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.65 }}
        className="flex flex-col items-center gap-3 sm:flex-row"
      >
        {failed > 0 && onRetryFailed && (
          <button
            type="button"
            onClick={onRetryFailed}
            className="flex items-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold tracking-tight"
            style={{ background: 'var(--accent-primary)', color: '#0a0a0b' }}
          >
            <RotateCcw size={16} strokeWidth={2.5} />
            Relancer les échecs
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold tracking-tight transition hover:bg-white/5"
          style={
            failed > 0 && onRetryFailed
              ? { border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }
              : { background: 'var(--accent-primary)', color: '#0a0a0b' }
          }
        >
          <RefreshCw size={16} strokeWidth={2.5} />
          Nouveau lot
        </button>
      </motion.div>
    </motion.div>
  );
}
