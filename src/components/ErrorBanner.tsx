import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

type Props = {
  message: string | null;
  onDismiss?: () => void;
};

export function ErrorBanner({ message, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div
            className="glass flex items-start gap-3 rounded-xl px-4 py-3"
            style={{
              borderColor: 'rgba(239,68,68,0.35)',
              background:
                'linear-gradient(180deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.05) 100%)',
            }}
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--error)' }} />
            <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {message}
            </p>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Fermer"
                className="shrink-0 rounded-md p-1 text-[color:var(--text-secondary)] transition hover:bg-white/5 hover:text-[color:var(--text-primary)]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
