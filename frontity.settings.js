const settings = {
  name: 'Kiko Ruiz',
  state: {
    frontity: {
      url: 'https://kikoruiz.es',
      title: 'Kiko Ruiz Web Site',
      description: 'All about me and my world.'
    }
  },
  packages: [
    {
      name: '@frontity/mars-theme',
      state: {
        theme: {
          menu: [
            ['Home', '/'],
            ['Nature', '/category/nature/'],
            ['Travel', '/category/travel/'],
            ['Japan', '/tag/japan/'],
            ['About Us', '/about-us/']
          ],
          featured: {
            showOnList: false,
            showOnPost: false
          }
        }
      }
    },
    {
      name: '@frontity/wp-source',
      state: {
        source: {
          api: 'https://test.frontity.io/wp-json'
        }
      }
    },
    '@frontity/tiny-router',
    '@frontity/html2react'
  ]
}

export default settings
