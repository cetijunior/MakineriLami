import Section from "../components/Section"
import ProductCard from "../components/ProductCard"
import SocialEmbed from "../components/SocialEmbed"
import BlurText from "../components/BlurText"
import AnimatedGridBg from "../components/AnimatedGridBg"

const PHONE = "+355686156616"
const PHONE_DISPLAY = "+355 68 615 6616"
const WHATSAPP_URL = `https://wa.me/${PHONE.replace(/\s/g, "")}`

const Home = () => {
  return (
    <main className="pt-14 min-h-screen">
      {/* Hero — full height, modern */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center px-4 py-24 overflow-hidden border-b border-[#374151]">
        <img
          src="/LamiPjese/Banner.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/90 via-[#111111]/75 to-[#111111]/95" aria-hidden />
        <AnimatedGridBg className="opacity-40" lineColor="rgba(250, 204, 21, 0.08)" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <img src="/LamiPjese/Logo.png" alt="Makineri Lami" className="h-24 md:h-28 mx-auto mb-6 w-auto drop-shadow-lg" />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white uppercase tracking-tight mb-4 drop-shadow-md">
            <BlurText text="Makineri Lami" delay={80} animateBy="words" stepDuration={0.4} className="inline-block" />
          </h1>
          <p className="text-lg md:text-xl text-[#d1d5db] mb-1 font-medium">
            Makineri ndërtimi në shitje.
          </p>
          <p className="text-[#9ca3af] mb-8">
            Ekskavatorë, dumper dhe pjesë makinerie — Zall-Herr, Tirana.
          </p>
          <a href={`tel:${PHONE}`} className="inline-block text-2xl md:text-3xl font-bold text-[#facc15] hover:text-[#fde047] transition-colors mb-10">
            {PHONE_DISPLAY}
          </a>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`tel:${PHONE}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#facc15] text-[#111111] font-bold px-8 py-4 rounded-xl hover:bg-[#eab308] hover:scale-[1.02] transition-all shadow-lg shadow-[#facc15]/20"
            >
              Telefono Tani
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#22c55e] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#16a34a] hover:scale-[1.02] transition-all shadow-lg"
            >
              WhatsApp
            </a>
            <a
              href="#products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-[#111111] transition-all"
            >
              Shiko Makineritë
            </a>
          </div>
        </div>
      </section>

      {/* Machines */}
      <Section id="products" title="Makineritë" dark>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          <ProductCard
            title="Ekskavator CAT 330 Hidraulik"
            description="Ekskavator profesional për punë të rënda në ndërtim."
            image="/LamiPjese/Skavator%20CAT%20330%20Hidraulik/Exavator.jpeg"
          />
          <ProductCard
            title="Terex Benford Dumper"
            description="Dumper 4x4 për transport materiali në kantier."
            image="/LamiPjese/Dumper%20Terex%20Benford/DumperFront.jpeg"
          />
        </div>
      </Section>

      {/* Parts / Attachments */}
      <Section id="parts" title="Pjesë dhe Kovë">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            title="Kovë Ekskavatori"
            description="Kovë për CAT 330 dhe makina 25–35 ton."
            image="/LamiPjese/Koka%20Skavatori/Kova1.jpeg"
          />
          <ProductCard
            title="Kovë Ekskavatori (modele të ndryshme)"
            description="Kovë dhe koka skavatori në dispozicion."
            image="/LamiPjese/Koka%20Skavatori/Kova2.jpeg"
          />
          <ProductCard
            title="Kovë dhe pajisje"
            description="Pjesë dhe bashkëngjitje për makineri ndërtimi."
            image="/LamiPjese/Koka%20Skavatori/Kova3.jpeg"
          />
        </div>
      </Section>

      {/* Social */}
      <Section id="social" title="Na Ndiqni">
        <SocialEmbed />
      </Section>

      {/* Contact */}
      <section id="contact" className="bg-[#111111] bg-pattern-section border-t border-[#374151] py-12 sm:py-16 px-4 relative">
        <AnimatedGridBg className="opacity-30" lineColor="rgba(55, 65, 81, 0.25)" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-6 sm:mb-8">
            <BlurText text="Kontakt" delay={0} stepDuration={0.35} />
          </h2>
          <p className="text-[#9ca3af] mb-4 sm:mb-6 text-sm sm:text-base">Telefoni dhe WhatsApp. Na kontaktoni për makineri dhe çmime.</p>
          <a
            href={`tel:${PHONE}`}
            className="block text-2xl sm:text-3xl md:text-4xl font-bold text-[#facc15] hover:underline mb-4 sm:mb-6 break-all"
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#22c55e] text-white font-bold px-6 py-3.5 sm:px-8 sm:py-4 rounded-lg hover:bg-[#16a34a] transition-colors mb-4 sm:mb-6 w-full sm:w-auto text-sm sm:text-base"
          >
            Kontakt në WhatsApp
          </a>
          <p className="text-[#d1d5db] text-sm sm:text-base">
            📍 Zall-Herr, Tirana
          </p>
        </div>
      </section>
    </main>
  )
}

export default Home
