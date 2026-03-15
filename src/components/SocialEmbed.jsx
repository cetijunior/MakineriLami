/**
 * Social section — distinct from product cards: one banner-style block
 * with platform icons and a clear CTA to follow.
 */
const SOCIAL_LINKS = [
  {
    href: "https://instagram.com/makineri.lami",
    label: "Instagram",
    handle: "@makineri.lami",
    icon: (
      <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    gradient: "from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
  },
  {
    href: "https://www.facebook.com/profile.php?id=61579475937972",
    label: "Facebook",
    handle: "Makineri Lami",
    icon: (
      <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    gradient: "from-[#1877f2] to-[#0d5bb5]",
  },
  {
    href: "https://www.tiktok.com/@makineri.lami",
    label: "TikTok",
    handle: "@makineri.lami",
    icon: (
      <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    gradient: "from-[#00f2ea] to-[#ff0050]",
  },
]

const SocialEmbed = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#374151] bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 md:p-10">
      {/* Subtle animated grid behind content */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(250, 204, 21, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 204, 21, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 text-center">
        <p className="text-[#9ca3af] text-sm md:text-base mb-6 max-w-md mx-auto">
          Ndiqni në rrjetet sociale për foto të reja, video dhe oferta.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
          {SOCIAL_LINKS.map(({ href, label, handle, icon, gradient }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 w-full sm:w-auto min-w-[200px] rounded-xl p-4 md:p-5 bg-[#1e293b]/80 border border-[#334155] hover:border-[#facc15]/50 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#facc15]/10`}
              aria-label={`${label} — ${handle}`}
            >
              <span
                className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}
              >
                {icon}
              </span>
              <div className="text-left flex-1 min-w-0">
                <span className="font-bold text-white block">{label}</span>
                <span className="text-xs text-[#9ca3af] truncate block">{handle}</span>
              </div>
              <span className="text-[#facc15] text-sm font-semibold shrink-0">Ndiqni →</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SocialEmbed
