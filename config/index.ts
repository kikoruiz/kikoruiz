import {GALLERY_ALBUMS} from './gallery'

export const DEFAULT_ORIGIN = 'https://www.kikoruiz.es'

export const SECTIONS = [
  {
    id: 'gallery',
    categories: GALLERY_ALBUMS,
    localePrefix: 'gallery.albums.',
    highlightedPicture: '/pictures/2022-01-04_0125.jpg'
  },
  {
    id: 'store',
    categories: [{id: 'prints'}],
    localePrefix: 'store.categories.',
    highlightedPicture: '/store/prints.jpg'
  },
  {id: 'blog', highlightedPicture: '/blog/_default.jpg'},
  {
    id: 'about-me',
    categories: [{id: 'resume'}],
    localePrefix: 'about-me.pages.',
    highlightedPicture: '/pictures/2022-08-27_0108.jpg'
  }
]

export const SPECIAL_SUBSECTIONS = ['tags']

export const LEGAL_PAGES = [
  'privacy-policy',
  'cookies-policy',
  'terms-and-conditions',
  'copyright'
]
export const SIMPLE_PAGES = ['error']

export const COOKIES_BY_TYPE = {
  NECESSARY: true,
  THIRD_PARTY: [{id: 'google-analytics', prefix: '_ga'}]
}

export const PERSONAL_INFO = {
  phone: '+34619602535',
  email: 'hola@kikoruiz.es',
  location: 'Sant Cugat del Vallès (Barcelona)',
  birthday: '1983-08-27'
}

export const BLOG = {
  AUTHORS: [{slug: 'kiko-ruiz', name: 'Kiko Ruiz'}],
  TAGS: [
    'photography',
    'personal'
    // 'tutorial'
  ],
  TITLE_SEPARATOR: ':',
  AVAILABLE_LOCALES: ['es', 'en', 'ca']
}

export const BRANDS = {
  SOCIAL: [
    {
      name: 'WhatsApp',
      slug: 'whatsapp',
      url: 'https://wa.me/34619602535'
    },
    {
      name: 'Instagram',
      slug: 'instagram',
      url: 'https://www.instagram.com/kikoruiz'
    },
    {
      name: 'Facebook',
      slug: 'facebook',
      url: 'https://www.facebook.com/kikoruiz.photography'
    },
    {
      name: '500px',
      slug: '500px',
      url: 'https://500px.com/p/kikoruiz'
    },
    {
      name: 'Vero',
      slug: 'vero',
      url: 'https://vero.co/kikoruiz'
    },
    {
      name: 'Twitter',
      slug: 'twitter',
      url: 'https://twitter.com/kikoruizlloret'
    },
    {
      name: 'GitHub',
      slug: 'github',
      url: 'https://github.com/kikoruiz'
    },
    {
      name: 'YouTube',
      slug: 'youtube',
      url: 'https://www.youtube.com/user/kikoruizlloret'
    },
    {
      name: 'Linkedin',
      slug: 'linkedin',
      url: 'https://www.linkedin.com/in/kikoruiz'
    },
    {
      name: 'Strava',
      slug: 'strava',
      url: 'https://www.strava.com/athletes/2109273'
    }
  ],
  TOOLS: [
    {
      name: 'Next.js',
      slug: 'nextjs',
      url: 'https://nextjs.org'
    },
    {
      name: 'Vercel',
      slug: 'vercel',
      url: 'https://vercel.com'
    },
    {
      name: 'Tailwind CSS',
      slug: 'tailwindcss',
      url: 'https://tailwindcss.com'
    }
  ]
}

export const REQUEST_STATUS_OPTIONS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
}

export const HERO_DEFAULT_DATA = {
  alt: 'Kiko Ruiz Photography'
}
export const HERO_IMAGES = [
  '2021-12-04_0153',
  '2019-03-04_0001',
  '2019-03-07_0175',
  '2020-01-25_0040',
  '2020-09-27_0057',
  '2021-10-24_0031',
  '2021-12-10_0008',
  '2022-06-25_0028',
  '2023-04-02_0102'
]
export const LATEST_PICTURES_LENGTH = 6
