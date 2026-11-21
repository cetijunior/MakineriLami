/** Inventari i ri, fotografuar më 21.11.2026 në Zall-Herr. */

export const INVENTORY_CATEGORIES = [
  { slug: 'kamione', label: 'Kamionë & kabina', icon: 'eng', order: 6, active: true },
  { slug: 'pjese', label: 'Pjesë të ndryshme', icon: 'gear', order: 7, active: true },
]

export const INVENTORY_PRODUCTS = [
  {
    "ref": "KOM-PC340",
    "category": "makineri",
    "stock": "makine",
    "name": "Ekskavator Komatsu PC340NLC",
    "short": "Klasa 33 ton, me kovë. Për riparim ose pjesë.",
    "images": [
      "/assets/inv/komatsu-pc340-03-front-img6922.webp",
      "/assets/inv/komatsu-pc340-01-side-img6919.webp",
      "/assets/inv/komatsu-pc340-02-front-3q-img6920.webp"
    ],
    "tags": [
      "Komatsu",
      "33 ton",
      "Zinxhirë"
    ],
    "bullets": [
      "Ekskavator me zinxhirë Komatsu PC340NLC",
      "Vjen me kovë gërmimi të montuar",
      "Kabina pa xhama në derë, motori i ekspozuar",
      "Për riparim ose për pjesë këmbimi"
    ],
    "specs": [
      {
        "label": "Klasa",
        "value": "~33 ton (PC340NLC-7)"
      },
      {
        "label": "Motor",
        "value": "Komatsu SAA6D114E-3"
      },
      {
        "label": "Fuqia",
        "value": "184 kW / 247 hp"
      },
      {
        "label": "Gjendja",
        "value": "Për riparim / pjesë"
      }
    ],
    "note": "Seria (-6 ose -7) dhe orët e punës konfirmohen në fushë.",
    "badge": "Klasa 33 ton",
    "featured": true,
    "active": true,
    "order": -100
  },
  {
    "ref": "AST-HD7-MIX",
    "category": "kamione",
    "stock": "makine",
    "name": "Betonierë Astra HD7 6x4",
    "short": "Kamion betonierë Astra (Iveco) 6x4, daulle e plotë, targë shqiptare.",
    "images": [
      "/assets/inv/astra-hd7-03-front-3q-left-img6928.webp",
      "/assets/inv/astra-hd7-01-front-3q-right-img6926.webp",
      "/assets/inv/astra-hd7-02-front-img6927.webp",
      "/assets/inv/astra-hd7-04-side-img6929.webp",
      "/assets/inv/astra-hd7-05-rear-3q-drum-img6930.webp",
      "/assets/inv/astra-hd7-06-rear-img6931.webp"
    ],
    "tags": [
      "Astra",
      "6x4",
      "Betonierë"
    ],
    "bullets": [
      "Shasi Astra HD7, 6x4",
      "Daulle betoni e bardhë/kuqe me shkallë",
      "Targë shqiptare",
      "Kabinë e kuqe, gati për shikim"
    ],
    "specs": [
      {
        "label": "Tërheqja",
        "value": "6x4"
      },
      {
        "label": "Motori",
        "value": "Iveco diesel"
      },
      {
        "label": "Trupi",
        "value": "Daulle betoni"
      }
    ],
    "note": "Viti, km dhe vëllimi i daulles jepen me kontakt.",
    "badge": "6x4",
    "featured": true,
    "active": true,
    "order": -99
  },
  {
    "ref": "SCA-114L-380",
    "category": "kamione",
    "stock": "makine",
    "name": "Trektor Scania 114L 380",
    "short": "Kokë tërheqëse Scania 114L, motor DC11 380 hp, kabinë e lartë.",
    "images": [
      "/assets/inv/scania114l-01-front-img6902.webp",
      "/assets/inv/scania114l-02-side-img6903.webp",
      "/assets/inv/scania114l-03-side-b-img6904.webp",
      "/assets/inv/scania114l-04-rear-3q-cab-tilted-img6905.webp",
      "/assets/inv/scania114l-05-rear-chassis-img6906.webp"
    ],
    "tags": [
      "Scania",
      "380 hp",
      "Trektor"
    ],
    "bullets": [
      "Scania seria 114L, 380 hp",
      "Motor DC11, 6 cilindra, 10.6 litra",
      "Kabinë e lartë me spoiler",
      "Targë shqiptare"
    ],
    "specs": [
      {
        "label": "Motori",
        "value": "Scania DC11 · 10.6 L"
      },
      {
        "label": "Fuqia",
        "value": "380 hp"
      },
      {
        "label": "Momenti",
        "value": "1,750–1,800 Nm"
      },
      {
        "label": "Seria",
        "value": "114 (1995–2004)"
      }
    ],
    "note": "Kilometrazhi dhe kutia e shpejtësisë konfirmohen me kontakt.",
    "badge": "380 hp",
    "featured": true,
    "active": true,
    "order": -98
  },
  {
    "ref": "TRX-PS6000",
    "category": "makineri",
    "stock": "makine",
    "name": "Dumper Terex PS6000, 6 ton",
    "short": "Dumper 4x4 me kosh rrotullues 180°, 6 ton. Regjistrim UK 2009.",
    "images": [
      "/assets/inv/terex-ps6000-04-rear-3q-img6890.webp",
      "/assets/inv/terex-ps6000-01-front-3q-img6887.webp",
      "/assets/inv/terex-ps6000-02-side-seat-img6888.webp",
      "/assets/inv/terex-ps6000-03-rear-img6889.webp"
    ],
    "tags": [
      "Terex",
      "6 ton",
      "Kosh 180°"
    ],
    "bullets": [
      "4x4 me artikulim, kosh rrotullues",
      "Kapacitet 6,000 kg, kosh ~3.5 m³",
      "Motor Perkins diesel",
      "Regjistrim UK 2009"
    ],
    "specs": [
      {
        "label": "Ngarkesa",
        "value": "6,000 kg"
      },
      {
        "label": "Koshi",
        "value": "~3.5 m³, rrotullues"
      },
      {
        "label": "Motori",
        "value": "Perkins 1004-4 · ~62 kW"
      },
      {
        "label": "Pesha",
        "value": "~4.3 ton"
      }
    ],
    "note": "Orët e punës jepen me kontakt.",
    "badge": "6 ton",
    "featured": true,
    "active": true,
    "order": -97
  },
  {
    "ref": "THW-DMP-HYD",
    "category": "makineri",
    "stock": "makine",
    "name": "Dumper Thwaites hidrostatik",
    "short": "Dumper me transmision hidrostatik dhe kosh rrotullues.",
    "images": [
      "/assets/inv/thwaites-08-rear-3q-e-img6898.webp",
      "/assets/inv/thwaites-01-side-img6891.webp",
      "/assets/inv/thwaites-02-front-3q-img6892.webp",
      "/assets/inv/thwaites-03-rear-3q-top-img6893.webp"
    ],
    "tags": [
      "Thwaites",
      "Hidrostatik",
      "Kosh rrotullues"
    ],
    "bullets": [
      "Transmision hidrostatik",
      "Kosh me shkarkim rrotullues",
      "Ndryshk në trup, mekanika për kontroll"
    ],
    "specs": [],
    "note": "Tonazhi i saktë konfirmohet nga pllaka e serisë.",
    "featured": false,
    "active": true,
    "order": -96
  },
  {
    "ref": "TLD-DMP-4X4",
    "category": "makineri",
    "stock": "makine",
    "name": "Dumper Toldo 4x4",
    "short": "Dumper kantieri italian 4x4, kosh rrotullues, hark ROPS.",
    "images": [
      "/assets/inv/toldo-04-rear-3q-img6886.webp",
      "/assets/inv/toldo-01-side-skip-tipped-img6883.webp",
      "/assets/inv/toldo-02-side-left-img6884.webp",
      "/assets/inv/toldo-03-front-3q-img6885.webp"
    ],
    "tags": [
      "Toldo",
      "4x4",
      "Kosh rrotullues"
    ],
    "bullets": [
      "Prodhim italian, 4x4",
      "Kosh me shkarkim rrotullues",
      "Hark mbrojtës ROPS",
      "Bojë në gjendje të mirë"
    ],
    "specs": [],
    "note": "Modeli dhe kapaciteti konfirmohen me kontakt.",
    "featured": false,
    "active": true,
    "order": -95
  },
  {
    "ref": "KV-LOT-15",
    "category": "kova",
    "stock": "stok",
    "name": "Kova ekskavatori, lot ~15 copë",
    "short": "Kova gërmimi dhe pastrimi kanalesh në gjerësi të ndryshme.",
    "images": [
      "/assets/inv/kova-01-lot-overview-img6867.webp",
      "/assets/inv/kova-02-bucket-02-img6868.webp",
      "/assets/inv/kova-03-bucket-03-img6869.webp",
      "/assets/inv/kova-04-bucket-04-img6870.webp",
      "/assets/inv/kova-05-bucket-05-img6871.webp",
      "/assets/inv/kova-06-bucket-06-img6872.webp",
      "/assets/inv/kova-07-bucket-07-img6873.webp",
      "/assets/inv/kova-08-bucket-08-img6874.webp",
      "/assets/inv/kova-09-bucket-09-img6875.webp",
      "/assets/inv/kova-10-bucket-10-img6876.webp",
      "/assets/inv/kova-11-bucket-11-img6877.webp",
      "/assets/inv/kova-12-bucket-12-img6878.webp",
      "/assets/inv/kova-13-bucket-13-img6879.webp",
      "/assets/inv/kova-14-bucket-14-img6880.webp",
      "/assets/inv/kova-15-bucket-15-img6881.webp",
      "/assets/inv/kova-16-bucket-16-img6882.webp"
    ],
    "tags": [
      "Lot",
      "Kova",
      "Me pina"
    ],
    "bullets": [
      "Rreth 15 kova të përmasave të ndryshme",
      "Kova me dhëmbë dhe kova kanali",
      "Lidhje me pina",
      "Shiten veç e veç ose të gjitha"
    ],
    "specs": [],
    "note": "Gjerësia dhe pinat maten sipas kërkesës.",
    "featured": false,
    "active": true,
    "order": -94
  },
  {
    "ref": "IVE-480-CAB-Y",
    "category": "kamione",
    "stock": "porosi",
    "name": "Kabinë Iveco Stralis 480 (e verdhë)",
    "short": "Kabinë e çmontuar pjesërisht, për pjesë këmbimi.",
    "images": [
      "/assets/inv/iveco480-yellow-02-front-3q-img6900.webp",
      "/assets/inv/iveco480-yellow-01-front-img6899.webp",
      "/assets/inv/iveco480-yellow-03-rear-img6908.webp"
    ],
    "tags": [
      "Iveco",
      "Stralis",
      "Kabinë"
    ],
    "bullets": [
      "Kabinë Iveco Stralis 480",
      "Për pjesë këmbimi",
      "Dyert dhe xhami i përparmë në vend"
    ],
    "specs": [],
    "note": "Pjesë të veçanta shiten me kërkesë.",
    "featured": false,
    "active": true,
    "order": -93
  },
  {
    "ref": "IVE-CAB-B",
    "category": "kamione",
    "stock": "porosi",
    "name": "Kabinë Iveco Stralis (blu)",
    "short": "Kabinë e çmontuar, për pjesë këmbimi.",
    "images": [
      "/assets/inv/iveco-blue-01-front-img6901.webp",
      "/assets/inv/iveco-blue-02-rear-img6907.webp"
    ],
    "tags": [
      "Iveco",
      "Kabinë"
    ],
    "bullets": [
      "Kabinë Iveco Stralis",
      "Për pjesë këmbimi"
    ],
    "specs": [],
    "note": "Pjesë të veçanta shiten me kërkesë.",
    "featured": false,
    "active": true,
    "order": -92
  },
  {
    "ref": "IVE-CAB-G",
    "category": "kamione",
    "stock": "porosi",
    "name": "Kabinë Iveco Stralis (jeshile)",
    "short": "Kabinë e çmontuar përpara, për pjesë.",
    "images": [
      "/assets/inv/iveco-green-02-front-img6917.webp",
      "/assets/inv/iveco-green-01-side-img6915.webp"
    ],
    "tags": [
      "Iveco",
      "Kabinë"
    ],
    "bullets": [
      "Kabinë Iveco Stralis",
      "Radiatori dhe pedalet në vend",
      "Për pjesë këmbimi"
    ],
    "specs": [],
    "note": "Pjesë të veçanta shiten me kërkesë.",
    "featured": false,
    "active": true,
    "order": -91
  },
  {
    "ref": "EXC-TIEKU",
    "category": "makineri",
    "stock": "makine",
    "name": "Ekskavator me zinxhirë (nga Gjermania)",
    "short": "Ekskavator me krah të verdhë, ardhur nga Gjermania. Për riparim ose pjesë.",
    "images": [
      "/assets/inv/excavator-tieku-03-cab-front-3q-img6911.webp",
      "/assets/inv/excavator-tieku-01-side-boom-img6909.webp",
      "/assets/inv/excavator-tieku-02-side-boom-b-img6910.webp",
      "/assets/inv/excavator-tieku-04-cab-front-3q-b-img6912.webp",
      "/assets/inv/excavator-tieku-05-rear-3q-img6914.webp",
      "/assets/inv/excavator-tieku-06-side-body-img6916.webp"
    ],
    "tags": [
      "Zinxhirë",
      "Gjermani"
    ],
    "bullets": [
      "Ekskavator me zinxhirë, krah i plotë",
      "Ardhur nga një firmë gjermane",
      "Vaj hidraulik bio",
      "Për riparim ose pjesë"
    ],
    "specs": [],
    "note": "Marka dhe modeli konfirmohen nga pllaka e serisë.",
    "featured": false,
    "active": true,
    "order": -90
  },
  {
    "ref": "FRK-ORANGE",
    "category": "makineri",
    "stock": "porosi",
    "name": "Pirun (forklift) portokalli",
    "short": "Pirun i vjetër me mast, për restaurim ose pjesë.",
    "images": [
      "/assets/inv/forklift-01-side-img6913.webp"
    ],
    "tags": [
      "Pirun",
      "Për pjesë"
    ],
    "bullets": [
      "Pirun me mast",
      "Për restaurim ose pjesë"
    ],
    "specs": [],
    "note": "Foto shtesë dërgohen në WhatsApp.",
    "featured": false,
    "active": true,
    "order": -89
  },
  {
    "ref": "STL-LATTICE",
    "category": "pjese",
    "stock": "porosi",
    "name": "Seksion strukture hekuri (i kuq)",
    "short": "Seksion me grilë hekuri, i përshtatshëm për ripërdorim.",
    "images": [
      "/assets/inv/steel-lattice-01-overview-img6918.webp",
      "/assets/inv/steel-lattice-02-side-img6921.webp"
    ],
    "tags": [
      "Hekur",
      "Strukturë"
    ],
    "bullets": [
      "Strukturë grilë hekuri",
      "Ngjyrë e kuqe"
    ],
    "specs": [],
    "note": "Përmasat jepen me kontakt.",
    "featured": false,
    "active": true,
    "order": -88
  },
  {
    "ref": "PJS-LOT-11",
    "category": "pjese",
    "stock": "porosi",
    "name": "Pjesë të ndryshme (lot)",
    "short": "Pllaka hekuri, pjesë hidraulike, goma, trarë dhe cilindra.",
    "images": [
      "/assets/inv/parts-03-steel-beams-img6925.webp",
      "/assets/inv/parts-01-track-plates-img6923.webp",
      "/assets/inv/parts-02-hydraulic-parts-tyres-img6924.webp",
      "/assets/inv/parts-04-steel-frame-img6932.webp"
    ],
    "tags": [
      "Lot",
      "Hidraulikë",
      "Hekur"
    ],
    "bullets": [
      "Pllaka zinxhiri / hekuri",
      "Pompa dhe motorë hidraulikë, goma",
      "Trarë, profile dhe cilindra",
      "Kafaz hekuri me susta"
    ],
    "specs": [],
    "note": "Na tregoni çfarë ju duhet dhe ju dërgojmë foto.",
    "featured": false,
    "active": true,
    "order": -87
  },
]
