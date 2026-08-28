import { Property } from "@/types/property";
import { Language } from "./types";

// Exact property glossary
const REAL_ESTATE_GLOSSARY: Record<string, Record<Language, string>> = {
  "Modern Oasis in Silicon Valley": {
    es: "Oasis Moderno en Silicon Valley",
    en: "Modern Oasis in Silicon Valley",
    fr: "Oasis Moderne dans la Silicon Valley",
  },
  "Downtown Skyline Penthouse": {
    es: "Penthouse con Vista al Horizonte Urbano",
    en: "Downtown Skyline Penthouse",
    fr: "Penthouse Panoramique en Centre-Ville",
  },
  "Lakeside Architectural Gem": {
    es: "Joya Arquitectónica Frente al Lago",
    en: "Lakeside Architectural Gem",
    fr: "Joyau Architectural en Bord de Lac",
  },
  "Elegant Suburban Residence": {
    es: "Elegante Residencia Suburbana",
    en: "Elegant Suburban Residence",
    fr: "Élégante Résidence Banlieusarde",
  },
  "Minimalist Coastal Villa": {
    es: "Villa Costera Minimalista",
    en: "Minimalist Coastal Villa",
    fr: "Villa Côtière Minimaliste",
  },
  "Charming Victorian Townhouse": {
    es: "Encantador Townhouse Victoriano",
    en: "Charming Victorian Townhouse",
    fr: "Charmante Maison de Ville Victorienne",
  },
  "Sun-Drenched Oceanfront Villa": {
    es: "Villa Soleada Frente al Mar",
    en: "Sun-Drenched Oceanfront Villa",
    fr: "Villa Ensoleillée en Bord de Mer",
  },
  "Alpine Mountain Ski Chalet": {
    es: "Chalet Alpino de Montaña",
    en: "Alpine Mountain Ski Chalet",
    fr: "Chalet Alpin de Montagne",
  },
  "Industrial Soho Brick Loft": {
    es: "Loft Industrial Soho con Ladrillo",
    en: "Industrial Soho Brick Loft",
    fr: "Loft Industriel SoHo en Briques",
  },
  "Contemporary Desert Sanctuary": {
    es: "Santuario Desértico Contemporáneo",
    en: "Contemporary Desert Sanctuary",
    fr: "Sanctuaire Contemporain du Désert",
  },
  "New Listing": {
    es: "Nuevo en Mercado",
    en: "New Listing",
    fr: "Nouveau Bien",
  },
  "Open House": {
    es: "Jornada de Puertas Abiertas",
    en: "Open House",
    fr: "Portes Ouvertes",
  },
  "Price Drop": {
    es: "Bajada de Precio",
    en: "Price Cut",
    fr: "Baisse de Prix",
  },
  Featured: {
    es: "Propiedad Destacada",
    en: "Featured Property",
    fr: "Propriété en Vedette",
  },
};

// Word & phrase patterns for dynamic database fallback translation
const WORD_TRANSLATIONS: Record<Language, Array<{ pattern: RegExp; replace: string }>> = {
  es: [
    { pattern: /\bModern\b/gi, replace: "Moderno" },
    { pattern: /\bDowntown\b/gi, replace: "Centro" },
    { pattern: /\bSkyline\b/gi, replace: "Horizonte Urbano" },
    { pattern: /\bPenthouse\b/gi, replace: "Penthouse" },
    { pattern: /\bLakeside\b/gi, replace: "Frente al Lago" },
    { pattern: /\bArchitectural\b/gi, replace: "Arquitectónico" },
    { pattern: /\bGem\b/gi, replace: "Joya" },
    { pattern: /\bElegant\b/gi, replace: "Elegante" },
    { pattern: /\bSuburban\b/gi, replace: "Suburbano" },
    { pattern: /\bResidence\b/gi, replace: "Residencia" },
    { pattern: /\bMinimalist\b/gi, replace: "Minimalista" },
    { pattern: /\bCoastal\b/gi, replace: "Costera" },
    { pattern: /\bVilla\b/gi, replace: "Villa" },
    { pattern: /\bCharming\b/gi, replace: "Encantador" },
    { pattern: /\bVictorian\b/gi, replace: "Victoriano" },
    { pattern: /\bTownhouse\b/gi, replace: "Townhouse" },
    { pattern: /\bSun-Drenched\b/gi, replace: "Soleado" },
    { pattern: /\bOceanfront\b/gi, replace: "Frente al Mar" },
    { pattern: /\bAlpine\b/gi, replace: "Alpino" },
    { pattern: /\bMountain\b/gi, replace: "de Montaña" },
    { pattern: /\bSki\b/gi, replace: "de Esquí" },
    { pattern: /\bChalet\b/gi, replace: "Chalet" },
    { pattern: /\bIndustrial\b/gi, replace: "Industrial" },
    { pattern: /\bBrick\b/gi, replace: "de Ladrillo" },
    { pattern: /\bLoft\b/gi, replace: "Loft" },
    { pattern: /\bContemporary\b/gi, replace: "Contemporáneo" },
    { pattern: /\bDesert\b/gi, replace: "Desértico" },
    { pattern: /\bSanctuary\b/gi, replace: "Santuario" },
    { pattern: /\bNew Listing\b/gi, replace: "Nuevo en Mercado" },
    { pattern: /\bOpen House\b/gi, replace: "Puertas Abiertas" },
    { pattern: /\bPrice Cut\b|\bPrice Drop\b/gi, replace: "Oferta Especial" },
    { pattern: /\bFeatured\b/gi, replace: "Destacado" },
  ],
  en: [
    { pattern: /\bOasis Moderno\b/gi, replace: "Modern Oasis" },
    { pattern: /\bPenthouse con Vista\b/gi, replace: "Skyline Penthouse" },
    { pattern: /\bJoya Arquitectónica\b/gi, replace: "Architectural Gem" },
    { pattern: /\bElegante Residencia\b/gi, replace: "Elegant Residence" },
    { pattern: /\bVilla Costera\b/gi, replace: "Coastal Villa" },
    { pattern: /\bChalet Alpino\b/gi, replace: "Alpine Chalet" },
    { pattern: /\bNuevo en Mercado\b|\bNuevo\b/gi, replace: "New Listing" },
    { pattern: /\bJornada de Puertas Abiertas\b/gi, replace: "Open House" },
    { pattern: /\bBajada de Precio\b|\bOferta\b/gi, replace: "Price Cut" },
    { pattern: /\bDestacado\b|\bDestacada\b/gi, replace: "Featured" },
  ],
  fr: [
    { pattern: /\bModern\b|\bModerno\b/gi, replace: "Moderne" },
    { pattern: /\bOasis\b/gi, replace: "Oasis" },
    { pattern: /\bDowntown\b|\bCentro\b/gi, replace: "Centre-Ville" },
    { pattern: /\bPenthouse\b/gi, replace: "Penthouse" },
    { pattern: /\bLakeside\b|\bFrente al Lago\b/gi, replace: "en Bord de Lac" },
    { pattern: /\bArchitectural\b|\bArquitectónico\b/gi, replace: "Architectural" },
    { pattern: /\bGem\b|\bJoya\b/gi, replace: "Joyau" },
    { pattern: /\bElegant\b|\bElegante\b/gi, replace: "Élégant" },
    { pattern: /\bSuburban\b|\bSuburbano\b/gi, replace: "Banlieusard" },
    { pattern: /\bResidence\b|\bResidencia\b/gi, replace: "Résidence" },
    { pattern: /\bMinimalist\b|\bMinimalista\b/gi, replace: "Minimaliste" },
    { pattern: /\bCoastal\b|\bCostera\b/gi, replace: "Côtier" },
    { pattern: /\bVilla\b/gi, replace: "Villa" },
    { pattern: /\bCharming\b|\bEncantador\b/gi, replace: "Charmant" },
    { pattern: /\bVictorian\b|\bVictoriano\b/gi, replace: "Victorien" },
    { pattern: /\bTownhouse\b/gi, replace: "Maison de Ville" },
    { pattern: /\bSun-Drenched\b|\bSoleado\b/gi, replace: "Ensoleillé" },
    { pattern: /\bOceanfront\b|\bFrente al Mar\b/gi, replace: "en Bord de Mer" },
    { pattern: /\bAlpine\b|\bAlpino\b/gi, replace: "Alpin" },
    { pattern: /\bMountain\b|\bde Montaña\b/gi, replace: "de Montagne" },
    { pattern: /\bChalet\b/gi, replace: "Chalet" },
    { pattern: /\bIndustrial\b/gi, replace: "Industriel" },
    { pattern: /\bBrick\b|\bLadrillo\b/gi, replace: "en Brique" },
    { pattern: /\bLoft\b/gi, replace: "Loft" },
    { pattern: /\bContemporary\b|\bContemporáneo\b/gi, replace: "Contemporain" },
    { pattern: /\bDesert\b|\bDesértico\b/gi, replace: "du Désert" },
    { pattern: /\bSanctuary\b|\bSantuario\b/gi, replace: "Sanctuaire" },
    { pattern: /\bNew Listing\b|\bNuevo\b/gi, replace: "Nouveau Bien" },
    { pattern: /\bOpen House\b/gi, replace: "Portes Ouvertes" },
    { pattern: /\bPrice Cut\b|\bPrice Drop\b|\bOferta\b/gi, replace: "Baisse de Prix" },
    { pattern: /\bFeatured\b|\bDestacado\b/gi, replace: "En Vedette" },
  ],
};

function autoTranslateText(
  text: string | undefined,
  language: Language
): string | undefined {
  if (!text) return text;

  // Direct glossary match first
  if (REAL_ESTATE_GLOSSARY[text] && REAL_ESTATE_GLOSSARY[text][language]) {
    return REAL_ESTATE_GLOSSARY[text][language];
  }

  // Sentence replacements for descriptions
  let result = text;
  if (language === "en") {
    result = result
      .replace(/Ubicada en una de las zonas más exclusivas de/gi, "Located in one of the most exclusive areas of")
      .replace(/esta impresionante residencia representa el pináculo de la arquitectura moderna/gi, "this stunning residence represents the pinnacle of modern architecture")
      .replace(/La propiedad ofrece una experiencia de vida inigualable con acabados de primera calidad y vistas panorámicas/gi, "The property offers an unparalleled living experience with top quality finishes and panoramic views")
      .replace(/Impresionante residencia de diseño contemporáneo/gi, "Stunning contemporary-designed residence")
      .replace(/ubicada en el corazón de/gi, "located in the heart of")
      .replace(/Cuenta con concepto abierto, acabados de mármol y un amplio jardín privado/gi, "Features an open concept, marble finishes, and a large private yard")
      .replace(/Espectacular penthouse en piso elevado con ventanales de piso a techo/gi, "Spectacular high-floor penthouse with floor-to-ceiling windows")
      .replace(/y vistas panorámicas al centro urbano y la bahía/gi, "and panoramic skyline and bay views")
      .replace(/Refugio contemporáneo a orillas del lago con muelle privado/gi, "Contemporary lakeside retreat with private dock")
      .replace(/terraza de madera de teca y acabados rústicos de gran lujo/gi, "teak wood deck, and ultra-luxury rustic finishes")
      .replace(/Hermosa propiedad familiar en exclusivo vecindario de/gi, "Beautiful family estate in an exclusive neighborhood of")
      .replace(/Ofrece piscina climatizada, cocina chef y suite principal con vestidor doble/gi, "Offers a heated pool, chef's kitchen, and master suite with double walk-in closet")
      .replace(/Exclusiva villa costera sobre los acantilados de/gi, "Exclusive coastal villa atop the cliffs of")
      .replace(/con vistas de 180° al océano Pacífico y alberca de borde infinito/gi, "with 180° Pacific Ocean views and infinity pool")
      .replace(/Townhouse histórico cuidadosamente restaurado que combina encanto clásico con tecnología smarthome y patio privado arbolado/gi, "Carefully restored historic townhouse combining vintage charm with smarthome technology and a private wooded patio")
      .replace(/Majestuosa villa tropical frente a las playas de/gi, "Majestic tropical oceanfront villa in")
      .replace(/con muelle privado para yates y terraza panorámica/gi, "with private yacht dock and rooftop deck")
      .replace(/Exclusivo chalet con acceso directo a pistas de esquí en/gi, "Exclusive ski-in/ski-out chalet in")
      .replace(/Cuenta con chimenea de piedra natural y jacuzzi exterior/gi, "Features a natural stone fireplace and outdoor hot tub")
      .replace(/Icónico loft neoyorquino con techos de 4 metros, paredes de ladrillo visto y grandes ventanales de hierro fundido/gi, "Iconic New York loft featuring 13-foot ceilings, exposed brick walls, and cast-iron oversized windows")
      .replace(/Residencia sustentable en el desierto con arquitectura pasiva, paneles solares y patio central con estanque de relajación/gi, "Sustainable desert sanctuary with passive architecture, solar panels, and central courtyard with reflection pool")
      .replace(/El nivel principal cuenta con un concepto abierto amplio con grandes ventanales de piso a techo que integran armónicamente los espacios interiores con la terraza exterior/gi, "The main level features a spacious open concept with floor-to-ceiling windows harmoniously integrating interior spaces with the outdoor terrace")
      .replace(/La cocina de diseñador incluye mesadas de mármol y equipamiento de última generación/gi, "The designer kitchen includes marble countertops and state-of-the-art appliances")
      .replace(/La suite principal funciona como un santuario privado, ocupando un ala completa con vestidor a medida, baño tipo spa y balcón privado con vistas despejadas/gi, "The master suite functions as a private sanctuary, occupying an entire wing with a custom walk-in closet, spa-like bathroom, and private balcony with unobstructed views");
  } else if (language === "fr") {
    result = result
      .replace(/Ubicada en una de las zonas más exclusivas de/gi, "Située dans l'un des quartiers les plus exclusifs de")
      .replace(/esta impresionante residencia representa el pináculo de la arquitectura moderna/gi, "cette superbe résidence représente le sommet de l'architecture moderne")
      .replace(/La propiedad ofrece una experiencia de vida inigualable con acabados de primera calidad y vistas panorámicas/gi, "La propriété offre une expérience de vie inégalée avec des finitions haut de gamme et des vues panoramiques")
      .replace(/Impresionante residencia de diseño contemporáneo/gi, "Superbe résidence au design contemporain")
      .replace(/ubicada en el corazón de/gi, "située au cœur de")
      .replace(/Cuenta con concepto abierto, acabados de mármol y un amplio jardín privado/gi, "Offre un espace ouvert, des finitions en marbre et un grand jardin privé")
      .replace(/Espectacular penthouse en piso elevado con ventanales de piso a techo/gi, "Penthouse spectaculaire en étage élevé avec baies vitrées")
      .replace(/y vistas panorámicas al centro urbano y la bahía/gi, "et vues panoramiques sur la ville et la baie")
      .replace(/Refugio contemporáneo a orillas del lago con muelle privado/gi, "Refuge contemporain en bord de lac avec ponton privé")
      .replace(/terraza de madera de teca y acabados rústicos de gran lujo/gi, "terrasse en teck et finitions rustiques de grand luxe")
      .replace(/Hermosa propiedad familiar en exclusivo vecindario de/gi, "Belle propriété familiale dans un quartier exclusif de")
      .replace(/Ofrece piscina climatizada, cocina chef y suite principal con vestidor doble/gi, "Propose une piscine chauffée, une cuisine de chef et une suite parentale avec double dressing")
      .replace(/Exclusiva villa costera sobre los acantilados de/gi, "Villa côtière exclusive sur les falaises de")
      .replace(/con vistas de 180° al océano Pacífico y alberca de borde infinito/gi, "avec vue à 180° sur l'océan Pacifique et piscine à débordement")
      .replace(/Townhouse histórico cuidadosamente restaurado que combina encanto clásico con tecnología smarthome y patio privado arbolado/gi, "Maison de ville historique soigneusement restaurée alliant charme d'antan, domotique moderne et patio arboré privé")
      .replace(/Majestuosa villa tropical frente a las playas de/gi, "Majestueuse villa tropicale en bord de mer à")
      .replace(/con muelle privado para yates y terraza panorámica/gi, "avec ponton privé pour yacht et toit-terrasse")
      .replace(/Exclusivo chalet con acceso directo a pistas de esquí en/gi, "Chalet exclusif au pied des pistes à")
      .replace(/Cuenta con chimenea de piedra natural y jacuzzi exterior/gi, "Offrant une cheminée en pierre naturelle et un jacuzzi extérieur")
      .replace(/Icónico loft neoyorquino con techos de 4 metros, paredes de ladrillo visto y grandes ventanales de hierro fundido/gi, "Loft new-yorkais emblématique avec 4 mètres de hauteur sous plafond, murs en briques et grandes baies en fonte")
      .replace(/Residencia sustentable en el desierto con arquitectura pasiva, paneles solares y patio central con estanque de relajación/gi, "Résidence désertique écologique avec architecture passive, panneaux solaires et patio central avec bassin de réflexion")
      .replace(/El nivel principal cuenta con un concepto abierto amplio con grandes ventanales de piso a techo que integran armónicamente los espacios interiores con la terraza exterior/gi, "Le niveau principal comprend un vaste espace ouvert avec de grandes baies vitrées reliant harmonieusement les espaces intérieurs à la terrasse extérieure")
      .replace(/La cocina de diseñador incluye mesadas de mármol y equipamiento de última generación/gi, "La cuisine de designer comprend des comptoirs en marbre et des équipements de pointe")
      .replace(/La suite principal funciona como un santuario privado, ocupando un ala completa con vestidor a medida, baño tipo spa y balcón privado con vistas despejadas/gi, "La suite parentale sert de sanctuaire privé, occupant une aile entière avec dressing sur mesure, salle de bain type spa et balcon privé avec vue dégagée");
  } else if (language === "es") {
    result = result
      .replace(/Stunning contemporary-designed residence located in the heart of/gi, "Impresionante residencia de diseño contemporáneo ubicada en el corazón de")
      .replace(/Spectacular high-floor penthouse featuring floor-to-ceiling windows/gi, "Espectacular penthouse en piso elevado con ventanales de piso a techo")
      .replace(/Contemporary lakeside retreat featuring a private dock/gi, "Refugio contemporáneo a orillas del lago con muelle privado")
      .replace(/Beautiful family estate in an exclusive Austin neighborhood/gi, "Hermosa propiedad familiar en un exclusivo vecindario de Austin")
      .replace(/Exclusive coastal villa atop Malibu cliffs/gi, "Exclusiva villa costera sobre los acantilados de Malibu");
  }

  // Word-by-word fallback replacement
  const rules = WORD_TRANSLATIONS[language];
  if (rules) {
    for (const rule of rules) {
      result = result.replace(rule.pattern, rule.replace);
    }
  }

  return result;
}

export function getLocalizedProperty(
  property: Property,
  language: Language
): Property {
  if (!property) return property;

  // 1. Localized Title
  let title = property.title;
  if (property.titleTranslations && property.titleTranslations[language]) {
    title = property.titleTranslations[language]!;
  } else {
    title = autoTranslateText(property.title, language) || property.title;
  }

  // 2. Localized Tag
  let tag = property.tag;
  if (property.tagTranslations && property.tagTranslations[language]) {
    tag = property.tagTranslations[language]!;
  } else {
    tag = autoTranslateText(property.tag, language) || property.tag;
  }

  // 3. Localized Description
  const rawDescription =
    property.description ||
    `Ubicada en una de las zonas más exclusivas de ${property.city}, esta impresionante residencia representa el pináculo de la arquitectura moderna. La propiedad ofrece una experiencia de vida inigualable con acabados de primera calidad y vistas panorámicas.`;

  let description = rawDescription;
  if (
    property.descriptionTranslations &&
    property.descriptionTranslations[language]
  ) {
    description = property.descriptionTranslations[language]!;
  } else {
    description = autoTranslateText(rawDescription, language) || rawDescription;
  }

  // 4. Localized Formatted Price according to language standard
  let locale = "en-US";
  if (language === "es") locale = "es-ES";
  if (language === "fr") locale = "fr-FR";

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return {
    ...property,
    title,
    tag,
    description,
    formattedPrice,
  };
}
