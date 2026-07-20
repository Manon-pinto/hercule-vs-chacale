import { motion, useReducedMotion } from 'motion/react';

type Props = {
  current: number;
  total: number;
  label: string;
};

export function AnalyzingView({ current, total, label }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col items-center gap-12"
    >
      <OrbitalSpinner reducedMotion={!!reducedMotion} />

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-base sm:text-lg" style={{ color: 'var(--text-primary)' }}>
          Envoi {current}/{total}
          <span className="ml-1 inline-block" style={{ color: 'var(--accent-primary)' }}>
            …
          </span>
        </p>
        <p className="max-w-md truncate text-sm" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </p>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-10 h-[2px] overflow-hidden"
        style={{ background: 'rgba(243,146,0,0.08)' }}
      >
        <div className="shimmer-orange h-full w-full" />
      </div>
    </motion.div>
  );
}

function OrbitalSpinner({ reducedMotion }: { reducedMotion: boolean }) {
  const size = 240;
  const radius = 96;
  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        filter: 'drop-shadow(0 12px 32px rgba(243,146,0,0.18))',
      }}
      role="status"
      aria-label="Envoi en cours"
    >
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 18,
          height: 18,
          marginLeft: -9,
          marginTop: -9,
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          boxShadow:
            '0 0 32px rgba(243,146,0,0.85), 0 0 64px rgba(243,146,0,0.42), 0 0 96px rgba(243,146,0,0.22)',
        }}
        animate={
          reducedMotion
            ? undefined
            : { scale: [1, 1.5, 1], opacity: [1, 0.55, 1] }
        }
        transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {[0, 1, 2].map((i) => {
        const angle = i * 120;
        return (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ rotate: angle }}
            animate={reducedMotion ? { rotate: angle } : { rotate: angle + 360 }}
            transition={{ duration: 2.0, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute left-1/2"
              style={{
                top: size / 2 - radius,
                marginLeft: -5,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                boxShadow: '0 0 18px rgba(243,146,0,0.7), 0 0 36px rgba(243,146,0,0.3)',
              }}
            />
          </motion.div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          border: '1px dashed rgba(243,146,0,0.18)',
        }}
      />
    </div>
  );
}
