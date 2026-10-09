# Página por foto, indexable y vendible

Documentación del plan implementado. Nada está subido todavía: todo vive en el
árbol de trabajo para que lo puedas revisar antes de commitear.

## Objetivo

Cada una de las 190 fotos tenía como única URL un parámetro (`?foto=`), que
acaba de pasar a `noindex, follow`. Eso significa 190 fotos invisibles para
Google. El plan les da una URL plana y real, convierte esa página en la ficha de
producto con datos estructurados `Product`/`Offer` para que el precio pueda
aparecer en resultados enriquecidos, y abre el catálogo a las mejor valoradas.

## Decisiones de partida

1. **La modal no cambia de comportamiento.** Un click en una tarjeta sigue
   abriendo el visor sobre la galería, con `?foto=` y navegación `shallow`.
2. **Pero el enlace sí cambia.** Ahora el `href` apunta a la página plana, y el
   click se intercepta. Ver "Enlaces internos" más abajo.
3. **URL plana**, no anidada: `/foto/<slug>`, `/ca/foto/<slug>`,
   `/en/photo/<slug>`. Son 190 × 3 = 570 páginas.
4. **No añadir `photo` a `SECTIONS`** (`config/index.ts:6`). Su ausencia es
   justo lo que hace que `fromLocalesToAlternates` resuelva la ruta plana.
5. **Nunca emitir `Product` sin precio real.**
6. **Nunca borrar en Stripe.** Como mucho `active: false`.
7. **El esquema de `data/store/products.json` se mantiene intacto**, para no
   romper `lib/gallery/mappers.ts:13` ni `lib/store/prints.ts`.
8. **Todas las fotos tienen página indexable**, pero **solo se venden las
   mejor valoradas**. Son dos cosas independientes: 190 páginas para SEO, 55 con
   `Product` y precio. Ver "Qué se vende" más abajo.
9. Márgenes y paddings en múltiplos de 3.

## Enlaces internos, el punto fino

El problema: si la tarjeta de la galería solo hace una navegación `shallow` a
`?foto=`, Google no ve ningún enlace a las páginas nuevas y estas quedan
huérfanas, solo alcanzables desde el sitemap.

La solución es el patrón de mejora progresiva, en `components/image.tsx`:

- El `<a>` lleva `href` a la página real de la foto. Eso es lo que rastrea
  Google y lo que ve el usuario en la barra de estado.
- Un click normal hace `preventDefault()` y empuja `?foto=` en `shallow`, o sea
  que la modal se abre igual que siempre.
- Un click con Cmd, Ctrl, Shift o Alt no se intercepta, así que abrir en pestaña
  nueva lleva a la página de la foto, que es lo que uno espera.
- `prefetch={false}` en estos enlaces, porque el click no navega de verdad y no
  tiene sentido precargar cientos de páginas al hacer scroll por un álbum.

Puntos de llamada actualizados: `components/gallery-list-items.tsx` (la rejilla
de los álbumes) y `components/home-latest-pictures.tsx` (la tira de la home).
Las tarjetas de álbum y de categoría de tienda no cambian, siguen navegando de
verdad.

Comprobado en el build: cada página de álbum sirve 60 enlaces reales a
`/foto/...` y cero `?foto=` en el HTML. `?foto=` sigue existiendo en runtime y
sigue siendo `noindex, follow`, pero ya no aparece como enlace en el HTML.

## Breadcrumb

La foto **cuelga de su álbum**, no de la galería a secas:
`Kiko Ruiz / Galería / Viajes / Night Spectrum` (`lib/mappers.ts:41-58`).

No es raro, y es lo correcto. El breadcrumb expresa la posición lógica dentro
del sitio, no la ruta de la URL, y Google lo documenta así de forma explícita: el
`BreadcrumbList` puede no coincidir con la jerarquía de la URL. De hecho interesa
que no coincida, porque la URL plana es buena para compartir y para que el slug
no cambie si una foto cambia de álbum, mientras el breadcrumb aporta el contexto
temático que ayuda a posicionar.

Cada foto pertenece a un solo álbum, que se resuelve con `getPictureAlbumId` a
partir de sus keywords, así que no hay ambigüedad.

## Indexabilidad: todas

La versión anterior ponía `noindex, follow` a las fotos sin descripción ni lugar,
46 de 190. Eso se ha quitado: ahora **las 190 tienen página indexable**.

El razonamiento: una página con una imagen única, su título, su álbum, sus
etiquetas, su mapa cuando hay coordenadas y una tabla de disparo distinta en cada
caso (cámara, óptica, exposición, fecha, relación de aspecto) no es contenido
delgado. Es contenido fino pero legítimamente único, y en fotografía la imagen es
el contenido principal. Además son las que llevan `Product` con precio, así que
dejarlas fuera del índice era justo lo contrario de lo que busca el plan.

Donde sigue habiendo trabajo es en la **descripción**, que mejora el texto de la
página y el `meta description`. Las fotos sin descripción usan un texto de
respaldo generado con el nombre y el álbum, que es único pero plantillero.

`make audit_content` ya no es una puerta SEO, es el backlog de escritura:

```
190 pictures · 104 without a description · 48 with neither description nor place · 4 printable
```

Eliminado: `lib/gallery/indexability.ts`, su uso en la página y su filtro en el
sitemap.

## Qué se vende

El catálogo se elige por **rating del EXIF**, con `PRINT_MIN_RATING` en
`config/store.ts`, que vale 4, y un `--min-rating=N` para probar otros umbrales
sin tocar el código.

El reparto real de ratings en las 190 fotos es 135 con 3, 51 con 4 y 4 con 5.
O sea que el 3 es tu línea base de "publicada" y no filtra nada, y el 5 deja
solo 4 fotos. **El único umbral que de verdad selecciona es el 4**, que son
**55 fotos**, alrededor de un 29% de la galería.

Hay además una cláusula de rescate: lo que ya está en `products.json` entra
siempre, aunque baje de umbral. Ahora mismo no hace nada, porque las dos fotos
que estaban en venta con rating 3 ya se han subido a 4, pero sigue ahí a
propósito: sin ella, bajar una estrella por descuido archivaría precios vivos que
pueden estar en un carrito abierto o en una sesión de Checkout pasada, y eso en
Stripe no se deshace.

`--only=<pictureId>` se salta el umbral a propósito, para poner una foto
concreta a la venta sin mover el listón para todas.

Las 135 fotos que no entran siguen teniendo su página indexable, simplemente no
emiten `Product`, que es justo la regla de no publicar nunca un `Product` sin
precio real.

## Qué se ha hecho, fase por fase

### Fase 2, datos de la página

`lib/gallery/picture-page.ts` (nuevo): resuelve álbum, hermanos de álbum y
permalink de cada foto. Los JSON de disco se memoizan a nivel de módulo y se
devuelven copias, para que un `sort` o un `reverse` de quien consume no corrompa
la caché.

`types/gallery.d.ts`: `Picture.permalink`, `PictureSibling` y `location`
(faltaba en `RawPicture` aunque 97 de 190 fotos lo traen).

### Fase 3, datos estructurados

`lib/structured-data.ts` (nuevo) centraliza todo el JSON-LD del sitio:
`ImageObject`, `Product` con `AggregateOffer`, `BreadcrumbList`, y los migrados
`WebSite` y `BlogPosting`.

`components/json-ld.tsx` (nuevo) lo pinta. **Va fuera de `<Head>` a propósito**:
`next/head` solo respeta hijos directos, y un `<script>` envuelto en un
componente se cae en navegación de cliente. Está verificado en los docs locales
de Next.

El `Product` solo se emite si la foto tiene impresiones con precio real.

### Fase 4, la página

`pages/foto/[slug].tsx` y `components/picture-page.tsx` (nuevos).
`getStaticPaths` recorre locales × 190 fotos con `fallback: false`, o sea 570
rutas prerenderizadas. `getStaticProps` calcula álbum, hermanos, impresiones,
alternates y llama a `getPictureStructuredData` en servidor, para que
`lib/structured-data.ts` no entre en el bundle de cliente.

La página lleva título, descripción, canonical, 4 hreflang, og:_, twitter:_, el
mapa cuando hay coordenadas, la info técnica, el bloque de precios y la tira de
hermanos del álbum.

### Fase 5, consolidación de JSON-LD

`pages/index.tsx` y `pages/blog/[slug].tsx` tenían `<script>` inline dentro de
`<Head>`. Ahora usan `<JsonLd />` con los helpers compartidos. La tienda
(`components/store-page.tsx`, `pages/tienda/impresiones/index.tsx`) gana og:image
y twitter:image.

### Fase 6, enlaces

Lo de "Enlaces internos" de arriba, más dos añadidos en
`components/picture-detail.tsx`, que es el único archivo de la modal que cambia:
un botón "ver la página de la foto" y otro de "copiar enlace".

`lib/store/prints.ts` deja de apuntar al `?foto=` y apunta al permalink.

### Fase 7, sitemap

`next-sitemap.config.js` reescrito. Excluye `/foto/*` del barrido automático y
las reinyecta por `additionalPaths`, para traducir las inglesas y darle a cada
una su `lastmod` real a partir de `processingDate ?? createDate`. Comparte
`getSlug` con la app mediante `require('tsx/cjs')`, sin duplicar código.

De paso arregla un bug anterior: `/en/gallery/*` no estaba en el sitemap, porque
sus rutas físicas `/en/galeria/*` estaban excluidas y sus gemelas públicas nunca
se añadían.

Estado tras el build: **727 URLs**, de las cuales 570 son fotos (190 × 3), 41 de
galería inglesa y 0 fugas de `/en/foto`.

### Fase 8, inventario de Stripe

`config/store.ts` gana `PRINT_VARIANTS`, las 6 combinaciones de tamaño, borde y
precio, que antes estaban escondidas en el script indexadas por precio.

`bin/store/inventory.mts` reescrito:

- Un producto de Stripe **por foto** (`print_<pictureId>`) con las 6 variantes
  como precios, en lugar de un producto por variante. Ver "Cómo se modelan las
  opciones" más abajo.
- Catálogo por rating, con `PRINT_MIN_RATING` y `--min-rating=N`, y las que ya
  están en venta siempre dentro.
- Identidad estable por `lookup_key`, con el mismo formato de id que ya usaban
  los productos antiguos, así que **las filas de `products.json` conservan su
  `id` tal cual**.
- Upsert idempotente: busca por `lookup_key`, crea solo lo que falta, nunca
  borra.
- **Reconciliación de precios.** Si cambias un precio en `PRINT_VARIANTS`, el
  script lo detecta. Como el importe de un precio de Stripe es inmutable, crea
  uno nuevo, le transfiere el `lookup_key` y archiva el viejo con
  `active: false`.
- **Huérfanos.** Si quitas una variante o una foto, las filas que ya no
  corresponden a nada se detectan y se informan. Solo se archivan si pasas
  `--prune`, nunca por sorpresa.
- Dos pasadas: primero un plan de **solo lectura**, que se imprime como resumen
  del diff, y solo después las escrituras.
- Flags `--dry-run`, `--limit=N`, `--only=<pictureId>`, `--prune`.
- Las escrituras van espaciadas 50 ms para no acercarse al límite de Stripe.
- Una pasada parcial (`--limit` o `--only`) **fusiona** sus filas con el
  `products.json` existente en vez de reemplazarlo, que es lo que habría hecho
  el script anterior.

`Makefile`: el target `save` reenvía `$(ARGS)`, para que los flags lleguen al
script.

`eslint.config.mjs`: `no-undef` estaba desactivado solo para `.ts` y `.tsx`, no
para `.mts`, así que cualquier anotación de tipo en los scripts de `bin` saltaba
como error. Ahora los `.mts` también están cubiertos.

## Cómo se modelan las opciones

Stripe solo tiene dos piezas, **Product** y **Price**, y no existe ningún
concepto nativo de variante con opciones como en Shopify. El importe vive en el
Price, y un Price tiene un solo importe. Así que seis combinaciones a seis
precios distintos **tienen que ser seis Prices**, eso no se puede evitar.

Lo que sí se puede evitar, y es lo que estaba mal, es que sean seis **Products**.
Lo que tienes hoy es un producto por combinación, 24 productos para 4 fotos, y
por eso el dashboard parece un catálogo de 24 cosas sin relación en el que la
foto no existe como entidad.

La forma nueva es la canónica, y es literalmente "el producto es la foto y las
impresiones son opciones":

```
Product print_2020-01-25_0040 · "Dragged by the Storm"
  ├─ Price print_..._A4            · 30,00 € · metadata {size: A4, borderless: false}
  ├─ Price print_..._A4_borderless · 35,00 € · metadata {size: A4, borderless: true}
  ├─ Price print_..._A3            · 37,50 €
  ├─ Price print_..._A3_borderless · 42,50 €
  ├─ Price print_..._A2            · 45,00 €
  └─ Price print_..._A2_borderless · 50,00 €
```

Las opciones viven en el `metadata` y en el `lookup_key` de cada precio, y el
Checkout recibe el `priceId` de la combinación elegida. `use-shopping-cart` ya
mapea el id de la línea del carrito a un precio de Stripe, así que no hay que
cambiar nada del carrito.

En el dashboard pasas a ver **55 productos con 6 precios cada uno** en vez de 330
productos sueltos.

### En la web es otra discusión

`products.json` sigue siendo plano, una fila por variante, porque es la tabla de
`priceId` y el carrito necesita un id por línea. Eso está bien.

Lo que no está bien es que **el listado pinte una tarjeta por fila**. La ficha
debería ser la foto, con un selector de tamaño y borde que cambie el `priceId`,
que es exactamente cómo lo vive el cliente: no compras "A3 sin borde", compras
una foto y luego eliges.

Hay además un desperdicio medido: `components/print-card.tsx` importa
`data/store/products.json` entero **al navegador** solo para buscar el `priceId`
y la moneda de su fila. Está comprobado, los 24 `priceId` viajan en el chunk de
`/tienda/impresiones`. Con 330 filas son unos 139 KB de JSON en el bundle, y eso
debería bajar en props desde `getStaticProps`.

## Cómo se sincroniza con tu dashboard de Stripe

La sincronización es **en un solo sentido: el repositorio manda y Stripe
obedece**. La fuente de verdad son `data/pictures/metadata.json` (qué fotos hay)
y `PRINT_VARIANTS` en `config/store.ts` (qué tamaños y a qué precio). Stripe es
una proyección de eso, y `data/store/products.json` es el recibo de la última
sincronización.

Lo que eso implica en la práctica:

- **Añadir fotos es automático.** Metes la foto con 4 estrellas o más, corre
  `make save_metadata`, y en la siguiente sincronización aparecen su producto y
  sus 6 precios. No hay que tocar ninguna lista a mano, que es lo que pasaba
  antes con `PICTURES_FOR_PRINTING`: **lo que decide qué se vende es el rating
  que le pones en Lightroom**.
- **Ya está enganchado al build.** El target `build` del Makefile ejecuta
  `npm run save:inventory` antes de `npm run build`, así que un despliegue
  sincroniza Stripe y regenera `products.json` solo.
- **Cambiar un precio se hace en el código**, en `PRINT_VARIANTS`, no en el
  dashboard. El script crea el precio nuevo, mueve el `lookup_key` y archiva el
  viejo. Si lo cambias en el dashboard, la próxima sincronización no lo va a
  revertir, pero tampoco lo va a reflejar en la web, porque la web lee el precio
  de `products.json`. O sea que quedarían descuadrados: hazlo siempre en el
  código.
- **Nombre, imagen y metadatos sí se reconcilian.** Si renombras una foto en el
  EXIF, el producto de Stripe se actualiza. Si los editas en el dashboard, la
  próxima sincronización los sobreescribe.
- **El dashboard es para leer**, pedidos y pagos, no para editar el catálogo.
- **Nada se borra nunca.** Lo que sale del catálogo se archiva, y solo si lo
  pides con `--prune`.

Ejemplos:

```bash
# Ver qué pasaría, sin escribir nada en Stripe
make save_inventory ARGS="--dry-run"

# Probar otro umbral de rating sin tocar el código
make save_inventory ARGS="--dry-run --min-rating=5"

# Una sola foto, saltándose el umbral
make save_inventory ARGS="--dry-run --only=2020-01-25_0040"

# Las primeras 3, para probar la escritura con poco riesgo
make save_inventory ARGS="--limit=3"

# Sincronización completa
make save_inventory

# Completa, archivando además lo que ya no toca
make save_inventory ARGS="--prune"
```

`products.json` y `papers.json` solo se escriben con `NODE_ENV=production`, así
que ninguna prueba ensucia el repo.

## Cómo añadir una foto nueva

El orden importa, porque cada script lee lo que ha dejado el anterior:

```bash
make save_metadata      # lee el EXIF de public/pictures → data/pictures/metadata.json
make save_placeholders  # genera el degradado de carga → data/image/placeholders.json
make save_optimized     # webp a 640, 1080 y 1920 → public/pictures/optimized
make save_inventory     # sincroniza Stripe si la foto tiene 4 estrellas o más
```

`save_metadata` y `save_placeholders` borran y regeneran el fichero entero, así
que son idempotentes. `save_optimized` se salta los webp que ya existen, o sea
que solo procesa lo nuevo.

Lo único que hay que preparar en Lightroom es el **título**, las **keywords** y el
**rating**. Las keywords son las que asignan el álbum, con las reglas de
`GALLERY_ALBUMS` en `config/gallery.ts`: con `landscape` y sin `travel`,
`seascape` ni `seasonal`, la foto cae en Paisajes. Si una foto no encaja en
ninguna regla se queda sin álbum, así que conviene mirar el álbum resultante con
`make audit_content`.

### Sobre la compresión de los originales

No hay ningún script que comprima los JPEG de `public/pictures`. El único que
toca imágenes es `save_optimized`, y **nunca modifica el original**: solo escribe
derivados webp aparte. O sea que el peso de un original es exactamente el que
salió de Lightroom.

Mirando las 190, hay dos ajustes de exportación en juego:

- **164 ficheros con croma 4:4:4**, mediana de 20 MP, unos 0,137 MB por
  megapíxel. Es el ajuste de calidad alta.
- **23 ficheros con croma 4:2:0**, mediana de 67 MP, unos 0,060 MB por
  megapíxel. Lightroom baja a 4:2:0 cuando la calidad del preset baja, así que
  este es el ajuste más comprimido, y es el que vienen usando los panoramas
  grandes.

Las tres fotos nuevas son panoramas de 106 a 150 MP y salen en 4:2:0, o sea
**consistentes con los otros panoramas**, no con el preset de calidad alta.

Y el misterio del fichero de 2020 que pesaba 2 MB más: no es compresión
perdida, es que **se reexportó con más calidad que la vez original**. Los únicos
dos ficheros cuyo tamaño en disco no cuadraba con el `fileSize` guardado eran
`2019-03-05_0363.jpg` (2,70 → 4,45 MB) y `2020-01-18_0131.jpg` (2,60 → 4,54 MB),
justo los dos que se reexportaron para corregir el rating, y los dos salieron en
4:4:4.

En la práctica da bastante igual para la web, porque lo que se sirve son los
derivados webp y lo que pasa por `next/image`, no el original. Donde sí se nota
es en el peso del repositorio: **490 MB de originales** más 92 MB de webp.

## Estado del inventario, dry run real

Ejecutado contra tu cuenta, solo lecturas:

```
📋 55 pictures · 330 variants · rated 4+ · dry run

   2018-02-11_0022 · Sweet Awakening · product: reuse · 6 to adopt
   2019-03-05_0363 · Time to Get Back Home · product: reuse · 6 to adopt
   2020-01-18_0131 · Warm Awakening · product: reuse · 6 to adopt
   2020-01-25_0040 · Dragged by the Storm · product: reuse · 6 to adopt
   [...51 fotos más...] · product: create · 6 to create

   products · ✨ 51 to create · 🛠️ 0 to update
   prices · ✨ 306 to create · 🔗 24 to adopt · 💸 0 to reprice · ♻️ 0 untouched
```

Lo importante: **24 a adoptar y 0 a recrear**. Ninguno de los `priceId` vivos se
toca, así que ninguna sesión de Checkout histórica ni ningún carrito abierto se
rompe. Y **0 huérfanos**, porque la cláusula de rescate mantiene dentro a las dos
fotos con rating 3 que ya estaban en venta.

Sin el filtro por rating esto serían 186 productos y 1116 precios, así que el
umbral recorta la pasada de escritura a algo menos de un tercio.

## Una cosa que falta decidir antes de escribir en Stripe

**Cuántas fichas pinta `/tienda/impresiones`.** Hoy pinta una por variante: 4
fotos × 6 = 24. Medido sobre el build actual, cada ficha cuesta 1051 bytes de
props y `products.json` pesa 420 bytes por fila.

| catálogo                          | filas | fichas | props      | JSON en el bundle |
| --------------------------------- | ----- | ------ | ---------- | ----------------- |
| hoy, 4 fotos                      | 24    | 24     | 25 KB      | 10 KB             |
| rating 4+, una ficha por variante | 330   | 330    | 338 KB     | 139 KB            |
| rating 4+, una ficha por foto     | 330   | 55     | unos 58 KB | 139 KB            |
| las 190, una ficha por variante   | 1140  | 1140   | 1,17 MB    | 478 KB            |

El filtro por rating ya quita el caso catastrófico: 330 fichas pesan, pero la
página no se rompe. Aun así lo coherente con el resto del plan es **una ficha por
foto**, con "desde 30 €", enlazando a `/foto/<slug>`, que ya es la ficha de
producto de verdad con sus 6 precios y su `AggregateOffer`.

Eso mueve el selector de tamaño, papel y borde del listado a la página de la
foto, que es donde de verdad eliges. Es un cambio de UX en una página que ya
existe, así que no lo he hecho por mi cuenta.

**Por eso me he quedado en el dry run y no he ejecutado la pasada de escritura.**
En Stripe los precios no se borran, solo se archivan, así que conviene decidir la
forma del listado antes. El orden sano es: decidir el listado, escribir en Stripe
con claves de test, y al final en producción.

## Verificación

Pasa todo:

- `npm run typecheck` limpio.
- `npm run lint`, 0 errores (quedan 8 warnings que ya existían).
- `npm run test`, 15 de 15.
- `npm run build` correcto, con 570 rutas `/foto/` prerenderizadas y unos 15 KB
  de JSON por página.

Comprobado con Playwright sobre el Chrome del sistema, contra el build de
producción:

```
card href: /foto/night-spectrum
url after click: /galeria/viajes?foto=night-spectrum
viewer visible: true
h1 on page: Viajes
url after escape: /galeria/viajes
flat page h1: Night Spectrum
flat page robots meta: 0
```

O sea: el enlace es el bueno para Google, el click abre la modal sin salir del
álbum, Escape vuelve, y la página plana responde por su cuenta y ya sin `robots`.

Comprobado en el HTML del build:

- 60 enlaces reales a `/foto/...` por página de álbum, en los tres locales, y 0
  `?foto=`.
- 727 URLs en el sitemap, 570 de fotos.

Comprobado en runtime antes de estos cambios, y sin tocar desde entonces:

- `?foto=` sigue respondiendo `noindex, follow`.
- `/en/foto/*` redirige 308 a `/en/photo/*`, que responde 200.
- `Product` solo en las fotos con impresiones y precios numéricos reales.
- `contentLocation` con geo cuando hay coordenadas.

## Lo que queda

1. Que revises todo esto.
2. Decidir si `/tienda/impresiones` pasa a una ficha por foto con selector de
   variante, y de paso dejar de mandar `products.json` entero al navegador desde
   `print-card.tsx`.
3. Pasada de escritura del inventario, primero con claves de **test**.
4. Validar una página en el test de resultados enriquecidos de Google, que
   necesita URL pública, o sea después de desplegar.
5. Ir escribiendo descripciones, con `make audit_content` como backlog.

## Archivos

Nuevos:

```
bin/gallery/audit-content.mts
components/json-ld.tsx
components/picture-page.tsx
lib/gallery/picture-page.ts
lib/structured-data.ts
pages/foto/[slug].tsx
docs/plan-pagina-por-foto.md
```

Modificados:

```
Makefile
bin/store/inventory.mts
components/breadcrumb.tsx
components/gallery-list-items.tsx
components/home-latest-pictures.tsx
components/image.tsx
components/picture-card.tsx
components/picture-detail.tsx
components/store-page.tsx
config/store.ts
eslint.config.mjs
i18n.js
lib/gallery/albums.ts
lib/gallery/mappers.ts
lib/gallery/pictures.ts
lib/mappers.ts
lib/store/prints.ts
lib/utils/image.ts
locales/{ca,en,es}/common.json
next-sitemap.config.js
next.http.config.mjs
pages/_app.tsx
pages/blog/[slug].tsx
pages/index.tsx
pages/tienda/impresiones/index.tsx
types/gallery.d.ts
types/index.d.ts
types/store.d.ts
```
