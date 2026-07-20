import { motion } from 'motion/react';
import { Logo } from './Logo';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-20"
    >
      <div
        className="border-b backdrop-blur-xl"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'rgba(10,10,11,0.6)',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <Logo size={36} />
          <div className="flex flex-col leading-tight">
            <span
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              RPI Menuiserie
            </span>
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              Contrôle Hercule × Chacal
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
