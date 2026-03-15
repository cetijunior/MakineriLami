const PHONE = "+355 68 615 6616"
const PHONE_RAW = "355686156616"
const WHATSAPP_URL = "https://wa.me/355686156616"
const LOCATION = "Zall-Herr, Tirana"

const FOOTER_LINKS = [
  { href: "#products", label: "Makineri" },
  { href: "#parts", label: "Pjesë" },
  { href: "#social", label: "Social" },
  { href: "#contact", label: "Kontakt" },
]

const SOCIAL_LINKS = [
  { href: "https://instagram.com/makineri.lami", label: "Instagram" },
  { href: "https://www.facebook.com/profile.php?id=61579475937972", label: "Facebook" },
  { href: "https://www.tiktok.com/@makineri.lami", label: "TikTok" },
]

const Footer = () => {
  return (
    <footer className="bg-[#111111] bg-pattern-section border-t border-[#374151] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="text-center md:text-left">
            <a href="#home" className="inline-flex items-center gap-2 font-bold text-xl text-white hover:text-[#facc15] transition-colors">
              <img src="/LamiPjese/Logo.png" alt="Makineri Lami" className="h-11 w-auto" />
              <span>Makineri Lami</span>
            </a>
            <p className="text-sm text-[#9ca3af] mt-3 max-w-xs">
              Makineri ndërtimi në shitje. Ekskavatorë, dumper dhe pjesë makinerie — Zall-Herr, Tirana.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#9ca3af] mb-4">Lidhje</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-gray-300 hover:text-[#facc15] transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#9ca3af] mb-4">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${PHONE_RAW}`} className="text-[#facc15] font-semibold hover:underline">
                  {PHONE}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#22c55e] font-semibold hover:underline"
                >
                  WhatsApp
                </a>
              </li>
              <li className="text-[#9ca3af]">
                📍 {LOCATION}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#9ca3af] mb-4">Rrjetet sociale</h3>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#1f2937] border border-[#374151] flex items-center justify-center text-gray-400 hover:text-[#facc15] hover:border-[#facc15] transition-colors"
                  aria-label={label}
                >
                  {label === "Instagram" && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  )}
                  {label === "Facebook" && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  {label === "TikTok" && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#6b7280] mt-10 pt-6 border-t border-[#374151]">
          © {new Date().getFullYear()} Makineri Lami. Të gjitha të drejtat e rezervuara.
        </p>
      </div>
    </footer>
  )
}

export default Footer
