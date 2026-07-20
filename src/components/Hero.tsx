import { motion } from 'motion/react';

type Props = {
  compact?: boolean;
};

export function Hero({ compact = false }: Props) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-3 text-center"
      style={{ paddingTop: compact ? 32 : 64 }}
    >
      <motion.h1
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className={`font-bold tracking-tight ${
          compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
        }`}
        style={{ color: 'var(--text-primary)' }}
      >
        Contrôler des commandes
      </motion.h1>
      <motion.p
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl text-[15px] leading-relaxed sm:text-base"
        style={{ color: 'var(--text-secondary)' }}
      >
        Empilez un ou plusieurs dossiers, chacun avec ses documents Hercule et Chacal.
        L'IA compare les références et signale les écarts avant validation de la fabrication.
      </motion.p>
    </motion.div>
  );
}
