import { motion } from 'motion/react';

type Props = {
  size?: number;
  className?: string;
};

export function Logo({ size = 40, className }: Props) {
  const fontSize = Math.round(size * 0.32);
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`inline-flex select-none items-center justify-center rounded-full font-[800] leading-none text-black ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        fontSize,
        letterSpacing: '1px',
        background: 'var(--accent-primary)',
        boxShadow: '0 0 0 0 rgba(243,146,0,0)',
      }}
      initial={{ boxShadow: '0 0 0 0 rgba(243,146,0,0)' }}
      whileFocus={{ boxShadow: '0 0 32px rgba(243,146,0,0.5)' }}
    >
      <motion.span
        whileHover={{ textShadow: '0 0 8px rgba(0,0,0,0.2)' }}
        style={{ display: 'inline-block' }}
      >
        RPI
      </motion.span>
    </motion.div>
  );
}
