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
      name: '@kikoruiz/flow-theme',
      state: {
        theme: {
          menu: [['Home', '/']],
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
