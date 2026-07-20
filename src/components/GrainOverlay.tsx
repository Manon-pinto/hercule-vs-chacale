export function GrainOverlay() {
  return (
    <>
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.05] mix-blend-overlay"
      >
        <filter id="rpi-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#rpi-noise)" />
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[60vh]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(243,146,0,0.14) 0%, rgba(243,146,0,0.04) 40%, transparent 70%)',
        }}
      />
    </>
  );
}
