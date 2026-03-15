import { useState, useEffect } from "react"

const NAV_LINKS = [
  { href: "#products", label: "Makineri" },
  { href: "#parts", label: "Pjesë" },
  { href: "#social", label: "Social" },
  { href: "#contact", label: "Kontakt" },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="bg-[#111111] border-b border-[#374151] text-white fixed w-full z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <a
          href="#home"
          onClick={closeMenu}
          className="flex items-center gap-2 font-bold text-lg text-white hover:text-[#facc15] transition-colors min-w-0"
        >
          <img src="/LamiPjese/Logo.png" alt="Makineri Lami" className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0" />
          <span className="truncate">Makineri Lami</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex gap-5 text-sm font-semibold">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="text-gray-300 hover:text-[#facc15] transition-colors whitespace-nowrap">
              {label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg text-gray-300 hover:text-white hover:bg-[#374151] transition-colors touch-manipulation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Mbyll menunë" : "Hap menunë"}
        >
          <span className={`block w-5 h-0.5 bg-current rounded transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current rounded my-1 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current rounded transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ease-out ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 pb-4 pt-1 border-t border-[#374151] bg-[#0d0d0d]">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="block py-3 text-gray-300 hover:text-[#facc15] font-semibold transition-colors border-b border-[#374151]/50 last:border-0"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
