const http = {
  headers: [
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'kikoruiz.vercel.app'
        }
      ],
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex'
        }
      ]
    },
    // Opening a picture through a query param still works, for the links that
    // were shared before every picture had a URL of its own, but only that URL
    // belongs in the index.
    {
      source: '/:path*',
      has: [{type: 'query', key: 'foto'}],
      headers: [{key: 'X-Robots-Tag', value: 'noindex, follow'}]
    },
    {
      source: '/:path*',
      has: [{type: 'query', key: 'picture'}],
      headers: [{key: 'X-Robots-Tag', value: 'noindex, follow'}]
    }
  ],
  redirects: [
    // A gallery tag's URL comes from its translated name, so renaming the one
    // for this land to what it is actually called moved its three pages. They
    // were indexed under the old names, and a tag page is the kind of URL
    // people link to, so the old ones keep pointing at the new.
    {
      // `es` is the default locale, so it carries no prefix in the URL, but a
      // `locale: false` rule still has to name it to match, per this version's
      // redirects guide.
      source: '/es/galeria/tags/comunidad-valenciana',
      destination: '/galeria/tags/pais-valencia',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/galeria/tags/comunitat-valenciana',
      destination: '/ca/galeria/tags/pais-valencia',
      locale: false,
      permanent: true
    },
    {
      source: '/en/gallery/tags/comunitat-valenciana',
      destination: '/en/gallery/tags/pais-valencia',
      locale: false,
      permanent: true
    },
    {
      source: '/en/galeria',
      destination: '/en/gallery',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/tienda',
      destination: '/ca/botiga',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/tenda',
      destination: '/ca/botiga',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/tenda/impressions',
      destination: '/ca/botiga/impressions',
      locale: false,
      permanent: true
    },
    {
      source: '/en/tienda',
      destination: '/en/store',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/tienda/impresiones',
      destination: '/ca/botiga/impressions',
      locale: false,
      permanent: true
    },
    {
      source: '/en/tienda/impresiones',
      destination: '/en/store/prints',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/tienda/descargas',
      destination: '/ca/botiga/descarregues',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/tenda/descarregues',
      destination: '/ca/botiga/descarregues',
      locale: false,
      permanent: true
    },
    {
      source: '/en/tienda/descargas',
      destination: '/en/store/downloads',
      locale: false,
      permanent: true
    },
    {
      source: '/en/sobre-mi',
      destination: '/en/about-me',
      locale: false,
      permanent: true
    },
    {
      source: '/en/sobre-mi/curriculum',
      destination: '/en/about-me/resume',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/politica-de-privacidad',
      destination: '/ca/politica-de-privacitat',
      locale: false,
      permanent: true
    },
    {
      source: '/en/politica-de-privacidad',
      destination: '/en/privacy-policy',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/politica-de-cookies',
      destination: '/ca/politica-de-galetes',
      locale: false,
      permanent: true
    },
    {
      source: '/en/politica-de-cookies',
      destination: '/en/cookies-policy',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/derechos-de-autor',
      destination: '/ca/drets-d-autor',
      locale: false,
      permanent: true
    },
    {
      source: '/en/derechos-de-autor',
      destination: '/en/copyright',
      locale: false,
      permanent: true
    },
    {
      source: '/ca/terminos-y-condiciones',
      destination: '/ca/termes-i-condicions',
      locale: false,
      permanent: true
    },
    {
      source: '/en/terminos-y-condiciones',
      destination: '/en/terms-and-conditions',
      locale: false,
      permanent: true
    }
  ],
  rewrites: [
    {
      source: '/en/gallery',
      destination: '/en/galeria',
      locale: false
    },
    {
      source: '/en/gallery/:slug',
      destination: '/en/galeria/:slug',
      locale: false
    },
    {
      source: '/en/gallery/tags/:tag',
      destination: '/en/galeria/tags/:tag',
      locale: false
    },
    {
      source: '/en/gallery/:slug/:picture',
      destination: '/en/galeria/:slug/:picture',
      locale: false
    },
    {
      source: '/ca/botiga',
      destination: '/ca/tienda',
      locale: false
    },
    {
      source: '/en/store',
      destination: '/en/tienda',
      locale: false
    },
    {
      source: '/ca/botiga/impressions',
      destination: '/ca/tienda/impresiones',
      locale: false
    },
    {
      source: '/en/store/prints',
      destination: '/en/tienda/impresiones',
      locale: false
    },
    {
      source: '/ca/botiga/descarregues',
      destination: '/ca/tienda/descargas',
      locale: false
    },
    {
      source: '/en/store/downloads',
      destination: '/en/tienda/descargas',
      locale: false
    },
    {
      source: '/en/about-me',
      destination: '/en/sobre-mi',
      locale: false
    },
    {
      source: '/en/about-me/resume',
      destination: '/en/sobre-mi/curriculum',
      locale: false
    },
    {
      source: '/ca/politica-de-privacitat',
      destination: '/ca/politica-de-privacidad',
      locale: false
    },
    {
      source: '/en/privacy-policy',
      destination: '/en/politica-de-privacidad',
      locale: false
    },
    {
      source: '/ca/politica-de-galetes',
      destination: '/ca/politica-de-cookies',
      locale: false
    },
    {
      source: '/en/cookies-policy',
      destination: '/en/politica-de-cookies',
      locale: false
    },
    {
      source: '/ca/drets-d-autor',
      destination: '/ca/derechos-de-autor',
      locale: false
    },
    {
      source: '/en/copyright',
      destination: '/en/derechos-de-autor',
      locale: false
    },
    {
      source: '/ca/termes-i-condicions',
      destination: '/ca/terminos-y-condiciones',
      locale: false
    },
    {
      source: '/en/terms-and-conditions',
      destination: '/en/terminos-y-condiciones',
      locale: false
    }
  ]
}

export default http
