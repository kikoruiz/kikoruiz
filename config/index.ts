import {GALLERY_ALBUMS} from './gallery'

export const DEFAULT_ORIGIN = 'https://kikoruiz.es'

export const SECTIONS = [
  {id: 'about-me', highlightedPicture: '/pictures/2022-08-27_0108.jpg'},
  {
    id: 'gallery',
    categories: GALLERY_ALBUMS,
    localePrefix: 'gallery.albums.',
    highlightedPicture: '/pictures/2021-12-04_0135.jpg'
  },
  {id: 'blog', highlightedPicture: '/blog/2022-09-17_hello-world.jpg'}
]

export const PERSONAL_INFO = {
  phone: '+34619602535',
  email: 'hola@kikoruiz.es',
  location: 'Sant Cugat del Vallès (Barcelona)',
  birthday: '1983-08-27'
}

export const BLOG = {
  AUTHORS: [{slug: 'kiko-ruiz', name: 'Kiko Ruiz'}],
  TAGS: ['photography', 'personal']
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
      url: 'https://www.linkedin.com/in/kikoruiz/'
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
