# Buenas Prácticas para Aplicaciones Inmobiliarias (Real Estate) en Next.js

Este documento recopila las mejores prácticas, recomendaciones técnicas, guías de UX/UI e ideas innovadoras para el desarrollo de la plataforma inmobiliaria **EstateFlow** utilizando **Next.js (App Router)**.

---

## 1. Rendimiento y Optimización Multimedia

Las imágenes y tours multimedia representan más del 70% del peso en una web inmobiliaria. Maximizar el rendimiento visual es crítico para la conversión y el SEO.

- **Uso estricto de `next/image`:**
  - Definir tamaños específicos mediante la propiedad `sizes` para generar versiones adaptadas a móvil, tablet y desktop.
  - Aplicar `priority` únicamente a la imagen principal (Hero / primera foto del carrusel) Above the Fold en la página de detalle y tarjetas destacadas.
  - Implementar blur placeholders (`placeholder="blur"` o `blurDataURL`) para evitar saltos de diseño (CLS) durante la carga.
- **Carga diferida de Videos y Tours Virtuales:**
  - No cargar iFrames de tours 3D (Matterport, 360°) o YouTube al renderizar la página.
  - Utilizar el patrón de *Facade/Thumbnail interactivo*: mostrar una vista previa con botón "Ver Tour 3D" y montar el iFrame solo bajo demanda/clic del usuario.
- **Optimización de Tipografías e Iconos:**
  - Cargar **SF Pro Display** optimizada para evitar parpadeos de fuente (FOUT/FOIT).
  - Utilizar un set ligero de iconos en formato SVG o librerías optimizadas como `lucide-react`.

---

## 2. SEO Inmobiliario y Metadatos Dinámicos

El tráfico orgánico local es clave en bienes raíces. Cada propiedad debe estar perfectamente indexada y estructurada.

- **Dynamic Metadata (`generateMetadata`):**
  - Configurar títulos SEO estructurados: `[Tipo de Propiedad] en [Barrio/Ciudad] - [Precio] | EstateFlow`.
  - Crear descripciones dinámicas atrayentes incluyendo superficie ($m^2$), número de ambientes y ubicación.
- **Datos Estructurados (Schema.org / JSON-LD):**
  - Incluir esquemas tipo `SingleFamilyResidence`, `RealEstateListing` o `Product` con atributos de precio, moneda (`USD`/`ARS`), coordenadas geográficas (`geo`), dirección y estado (`InStock`/`Sold`).
  - Esto facilita la aparición en rich snippets de Google y tarjetas enriquecidas.
- **Open Graph Dinámico (`next/og`):**
  - Generar imágenes OG dinámicas para compartir en WhatsApp o redes sociales que muestren automáticamente la foto principal, precio, cantidad de dormitorios y logo de EstateFlow.
- **Sitemap Dinámico (`sitemap.ts`):**
  - Generar sitemaps automatizados para refrescar la indexación cuando se añaden o actualizan inmuebles.

---

## 3. Arquitectura y Patrones en Next.js (App Router)

Aprovechar la arquitectura de Server Components para lograr una carga ultrarrápida y un código mantenible.

- **Server Components (RSC) por defecto:**
  - Realizar el fetching de datos de propiedades directamente en el servidor para reducir el JavaScript enviado al cliente.
- **Client Components delimitados:**
  - Aislar el uso de `'use client'` únicamente a partes interactivas:
    - Barra de filtros y buscadores.
    - Galería fotográfica (lightbox/zoom).
    - Botón de "Favoritos" (corazón).
    - Mapa interactivo de ubicaciones.
- **Streaming con `Suspense` y Skeletons:**
  - Implementar estados de carga (`loading.tsx` y `<Suspense>`) con skeleton loaders personalizados respetando la paleta de colores para una sensación de respuesta instantánea.
- **Estrategia de Caching e ISR:**
  - Utilizar Incremental Static Regeneration (ISR) o `revalidate` en las fichas de detalle de inmuebles para servirlas instantáneamente desde la CDN mientras se actualizan en segundo plano.

---

## 4. Búsqueda, Filtros y Mapas Interactivos

La experiencia de búsqueda debe ser ágil, precisa y permitir guardar o compartir parámetros.

- **Sincronización con URL (URL Search Params):**
  - Guardar el estado de los filtros (operación, tipo de inmueble, rango de precios, zonas, ambientes) directamente en los query params de la URL (`useSearchParams`, `useRouter`).
  - Permite que los usuarios compartan enlaces exactos de sus búsquedas o vuelvan atrás fácilmente en el navegador.
- **Búsqueda ágil y Debounce:**
  - Aplicar `debounce` (300ms - 500ms) en la barra de texto libre para evitar peticiones innecesarias mientras el usuario escribe la zona o palabra clave.
- **Mapas Optimizados (Mapbox / Leaflet / Google Maps):**
  - Cargar el componente de mapa de forma asíncrona (`next/dynamic` con `ssr: false`).
  - Implementar agrupación de pines (*Marker Clustering*) cuando se visualizan muchas propiedades simultáneamente.
  - Sincronización bidireccional: al pasar el cursor sobre un pin, resaltar la tarjeta en la lista y viceversa.
  - Por privacidad y seguridad del propietario, mostrar un radio o zona aproximada en lugar del punto exacto si la propiedad está pública.

---

## 5. Diseño y Experiencia de Usuario (UX/UI Premium)

El diseño debe transmitir exclusividad, claridad y confianza.

- **Paleta de Colores Oficial (Estricto cumplimiento):**
  - **Nordic (`#19322F`):** Headers, navegación, títulos y texto principal.
  - **Mosque (`#006655`):** Botones de acción principal (CTA), enlaces destacados y badges primarios.
  - **Hint of Green (`#D9ECC8`):** Fondos suaves, tarjetas destacadas y banners sutiles.
  - **Clear Day (`#EEF6F6`):** Fondo general de la aplicación.
- **Claridad de Datos Clave:**
  - Mostrar siempre de forma visible y uniforme: precio (con moneda), expensas/mantenimiento, $m^2$ totales y cubiertos, cantidad de ambientes, dormitorios y baños.
  - Etiquetas/Badges claros: *Venta*, *Alquiler*, *Reservado*, *Oportunidad*, *A Estrenar*.
- **Micro-interacciones y Muting Visual:**
  - Animaciones de hover suaves en las tarjetas de propiedades.
  - Actualización optimista del botón de favoritos (corazón) para respuesta visual inmediata antes del guardado en base de datos.
- **Formularios de Contacto Directos y Agiles:**
  - Botón flotante o fijo de consulta directa por **WhatsApp** prellenando datos de la propiedad (`Hola, me interesa la propiedad Ref #123 en...`).
  - Formulario de solicitud de visita con selector de fecha y horario integrado.

---

## 6. Gestión de Datos, Base de Datos y Seguridad

- **Row Level Security (RLS) en Supabase/PostgreSQL:**
  - Proteger los datos de los usuarios: listas de favoritos, búsquedas guardadas y mensajes de consulta deben ser accesibles solo por sus dueños.
- **Paginación Eficiente:**
  - Emplear paginación basada en cursor (*cursor-based pagination*) o paginación por offset optimizada para garantizar respuestas rápidas al navegar entre cientos de propiedades.
- **Sanitización y Validación (Zod):**
  - Validar todos los filtros y formularios tanto en el cliente como en Server Actions/API Routes usando Zod.

---

## 7. Ideas y Funcionalidades de Alto Valor (Diferenciadores)

Características sugeridas para hacer sobresalir a **EstateFlow** frente a portales tradicionales:

1. **Calculadora Hipotecaria y de Cuotas:**
   - Herramienta interactiva dentro del detalle de la propiedad para estimar cuotas mensuales según pago inicial, tasa de interés y plazo.
2. **Comparador de Propiedades Lado a Lado:**
   - Permitir al usuario seleccionar hasta 3 o 4 propiedades y compararlas en una tabla dinámica (precio por $m^2$, expensas, amenidades, antigüedad, ubicación).
3. **Ficha Técnica en PDF Descargable:**
   - Botón para generar un dossier/folleto en PDF elegante de la propiedad en un clic para que el cliente lo imprima o reenvíe.
4. **Alertas de Búsqueda Guardada:**
   - Permitir a usuarios registrados guardar una búsqueda y recibir notificaciones (o emails) cuando ingrese un inmueble matching o baje de precio uno guardado en favoritos.
5. **Compartir en Redes y WhatsApp con Un Clic:**
   - Botón rápido para copiar enlace con mensaje personalizado listo para enviar por WhatsApp o correo.
