/**
 * Animated grid background — React Bits style
 * Subtle moving grid for sections. https://reactbits.dev
 */
const AnimatedGridBg = ({ className = "", lineColor = "rgba(55, 65, 81, 0.2)" }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-60 animate-grid-scroll"
        style={{
          backgroundImage: `
            linear-gradient(${lineColor} 1px, transparent 1px),
            linear-gradient(90deg, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  )
}

export default AnimatedGridBg
