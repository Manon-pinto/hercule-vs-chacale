import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

type Props = {
  ready: boolean;
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export function AnalyzeButton({ ready, onClick, disabled, label }: Props) {
  const isInactive = !ready || disabled;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isInactive}
      whileHover={!isInactive ? { scale: 1.02 } : undefined}
      whileTap={!isInactive ? { scale: 0.98 } : undefined}
      animate={
        ready && !disabled
          ? {
              boxShadow: [
                '0 0 24px rgba(243,146,0,0.22), 0 0 0 1px rgba(243,146,0,0.35)',
                '0 0 48px rgba(243,146,0,0.4), 0 0 0 1px rgba(243,146,0,0.5)',
                '0 0 24px rgba(243,146,0,0.22), 0 0 0 1px rgba(243,146,0,0.35)',
              ],
            }
          : { boxShadow: '0 0 0 0 rgba(243,146,0,0)' }
      }
      transition={{
        boxShadow: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="flex w-full max-w-[480px] items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-[15px] font-bold tracking-tight transition-opacity"
      style={{
        background: isInactive ? 'rgba(243,146,0,0.18)' : 'var(--accent-primary)',
        color: isInactive ? 'rgba(255,255,255,0.5)' : '#0a0a0b',
        opacity: isInactive ? 0.55 : 1,
        cursor: isInactive ? 'not-allowed' : 'pointer',
      }}
    >
      <Sparkles size={18} strokeWidth={2.4} />
      <span>{label ?? "Lancer l'analyse"}</span>
    </motion.button>
  );
}
