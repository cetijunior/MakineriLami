import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore, useReveal } from '../lib/store.jsx'
import { UtilBar, Header } from '../components/Header.jsx'
import { Hero } from '../components/Hero.jsx'
import { Catalogue } from '../components/Catalogue.jsx'
import { ProductModal } from '../components/ProductModal.jsx'
import { InquiryTray } from '../components/InquiryTray.jsx'
import { Trust, Machines, Steps, Band, Faq, Contact, Footer, StickyBar, Toast } from '../components/Sections.jsx'

export default function Home() {
  const { byRef, loading, products, settings } = useStore()
  const { ref } = useParams()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('all')

  useReveal([loading, products.length])

  useEffect(() => {
    document.title = `${settings.businessName} · Pjesë dhe makineri ndërtimi`
  }, [settings.businessName])

  const goCatalogue = useCallback(() => {
    const el = document.getElementById('katalog')
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - (window.innerWidth > 980 ? 104 : 70)
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  const pickCategory = useCallback((slug) => {
    setCategory(slug)
    goCatalogue()
  }, [goCatalogue])

  const onQuery = (q) => {
    setQuery(q)
    if (q && window.scrollY < 300) goCatalogue()
  }

  const product = ref ? byRef.get(decodeURIComponent(ref)) : null
  const closeModal = useCallback(() => navigate('/', { preventScrollReset: true }), [navigate])

  // unknown product link: send back to the store once data has loaded
  useEffect(() => {
    if (ref && !loading && !product) navigate('/', { replace: true })
  }, [ref, loading, product, navigate])

  return (
    <>
      <UtilBar />
      <Header query={query} onQuery={onQuery} category={category} onCategory={pickCategory} />
      <main>
        <Hero onCategory={pickCategory} />
        <Catalogue query={query} onQuery={setQuery} category={category} stock={stock} onStock={setStock} />
        <Trust />
        <Machines />
        <Steps />
        <Band />
        <Faq />
        <Contact />
      </main>
      <Footer onCategory={pickCategory} />
      <StickyBar />
      <Toast />
      <InquiryTray />
      <ProductModal product={product} onClose={closeModal} />
    </>
  )
}
