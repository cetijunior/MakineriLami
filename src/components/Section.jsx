import BlurText from "./BlurText"

const Section = ({ id, title, children, dark = false }) => {
  const bg = dark ? "bg-[#111111]" : "bg-[#1f2937]"
  return (
    <section id={id} className={`${bg} bg-pattern-section max-w-6xl mx-auto py-16 md:py-20 px-4 md:px-6 relative`}>
      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-white uppercase tracking-tight">
        <BlurText text={title} delay={50} animateBy="words" stepDuration={0.3} />
      </h2>
      {children}
    </section>
  )
}

export default Section
