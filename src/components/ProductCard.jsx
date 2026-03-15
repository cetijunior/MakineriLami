const PHONE = "+355686156616"
const WHATSAPP_URL = `https://wa.me/${PHONE}`

const ProductCard = ({ title, description, image }) => {
  return (
    <div className="bg-[#1f2937] border border-[#374151] rounded-lg overflow-hidden flex flex-col">
      <div className="h-52 md:h-56 w-full bg-[#374151] flex items-center justify-center text-[#9ca3af] text-sm shrink-0">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span>Foto</span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-[#9ca3af] flex-1">
          {description}
        </p>
        <p className="mt-3 text-[#facc15] font-semibold text-sm">
          Kontaktoni për çmim
        </p>
        <div className="mt-4 flex gap-3">
          <a
            href={`tel:${PHONE}`}
            className="flex-1 text-center bg-[#facc15] text-[#111111] font-bold py-2.5 rounded text-sm hover:bg-[#eab308] transition-colors"
          >
            Telefono
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-[#22c55e] text-[#22c55e] font-bold py-2.5 rounded text-sm hover:bg-[#22c55e] hover:text-white transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
