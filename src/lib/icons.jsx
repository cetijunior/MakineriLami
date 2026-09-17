/* eslint-disable react-refresh/only-export-components */
export const ICON_PATHS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  exc: '<path d="M3 19h18"/><path d="M5.5 19v-3.5h6.5V19"/><path d="M9 15.5L11.5 8l4.5 2.6"/><path d="M16 10.6l2.4 4.9h-4.6z"/>',
  bucket: '<path d="M4.5 7.5h13l-1.4 8a3 3 0 0 1-3 2.5H8.9a3 3 0 0 1-3-2.5z"/><path d="M8 18v1.8M12 18v1.8M15.6 18v1.8"/>',
  cyl: '<path d="M3 10h12.5a3.2 3.2 0 0 1 0 4H3z"/><path d="M15.8 12H21"/><path d="M6 10v4"/>',
  pump: '<circle cx="11" cy="12" r="6"/><path d="M11 6V3M17 12h4M11 18v3"/>',
  eng: '<path d="M4 10h3l2-3h6l2 3h3v7H4z"/><path d="M8 17v3M16 17v3"/>',
  gear: '<circle cx="12" cy="12" r="3.4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  track: '<rect x="2.5" y="9" width="19" height="7" rx="3.5"/><circle cx="7" cy="12.5" r="1.6"/><circle cx="12" cy="12.5" r="1.6"/><circle cx="17" cy="12.5" r="1.6"/>',
  tire: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>',
  truck: '<path d="M2.5 16V7.5h11V16"/><path d="M13.5 10h4l3 3.2V16"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  wrench: '<path d="M14.5 4.5a4.2 4.2 0 0 0 5.6 5.6L21 11l-8.8 8.8a2.5 2.5 0 0 1-3.5-3.5L17.5 7.5z"/>',
  bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
  box: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/>',
  filter: '<path d="M4 5h16l-6 7.5V19l-4 1.5v-8z"/>',
  store: '<path d="M4 9.5V20h16V9.5"/><path d="M3 9.5L5 4h14l2 5.5a2.6 2.6 0 0 1-4.5 1.6 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.5 0A2.6 2.6 0 0 1 3 9.5z"/><path d="M9.5 20v-5h5v5"/>',
  logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
}

/** Icons meant for UI chrome, not offered in the category/product icon picker. */
export const UI_ONLY_ICONS = ['grid', 'store', 'logout', 'plus']

export const ICON_LABELS = {
  grid: 'Të gjitha', exc: 'Ekskavator', bucket: 'Kovë', cyl: 'Cilindër', pump: 'Pompë',
  eng: 'Motor', gear: 'Ingranazh', track: 'Zinxhir', tire: 'Gomë', truck: 'Kamion',
  wrench: 'Çelës', bolt: 'Elektrike', box: 'Pjesë', filter: 'Filtër',
}

export function Icon({ name, strokeWidth = 1.7, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || ICON_PATHS.gear }}
      {...rest}
    />
  )
}

export const WaIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2zm5.6 14.2c-.2.7-1.2 1.3-1.9 1.4-.5.1-1.2.2-3.5-.8-2.9-1.2-4.8-4.2-5-4.4-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l1 2.3c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.2.1.4.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2.2 1c.3.2.4.2.5.3.1.2.1.6-.1 1.2z" />
  </svg>
)

const stroke = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
export const CartIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="1.8" {...stroke} {...p}><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.55L21 8H6" /><circle cx="10" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></svg>)
export const SearchIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="2" {...stroke} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.4-3.4" /></svg>)
export const CloseIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="2" {...stroke} {...p}><path d="M5 5l14 14M19 5L5 19" /></svg>)
export const MenuIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="2" {...stroke} {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>)
export const CheckIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="2.4" {...stroke} {...p}><path d="M4 12.5l5 5L20 6.5" /></svg>)
export const InfoIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="1.9" {...stroke} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.6v.1" /></svg>)
export const PinIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="1.9" {...stroke} {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.6" /></svg>)
export const ClockIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="1.9" {...stroke} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></svg>)
export const PhoneIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="1.9" {...stroke} {...p}><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4z" /></svg>)
export const ZoomIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="2" {...stroke} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.4-3.4M11 8.4v5.2M8.4 11h5.2" /></svg>)
export const ShareIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="2" {...stroke} {...p}><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>)
export const IgIcon = (p) => (<svg viewBox="0 0 24 24" strokeWidth="1.8" {...stroke} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></svg>)
export const FbIcon = (p) => (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.2v2.2H7.5V13h2.7v8z" /></svg>)
export const TtIcon = (p) => (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M16.5 3c.4 2.2 1.7 3.6 3.8 3.8v2.6c-1.3.1-2.5-.3-3.8-1v5.7c0 3.6-2.6 6-6 6-3 0-5.5-2.2-5.5-5.4 0-3.4 3-6 6.6-5.2v2.8c-.4-.1-.8-.2-1.3-.2-1.6 0-2.8 1.2-2.8 2.7 0 1.5 1.2 2.6 2.7 2.6 1.6 0 2.8-1.2 2.8-3V3z" /></svg>)
