import Head from 'next/head'
import getPortfolioAlbums from '../lib/portfolio/albums.js'

export default function Home({albums}) {
  return (
    <div>
      <Head>
        <title>Kiko Ruiz</title>
        <meta name="description" content="Kiko Ruiz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ul>
          {albums.map(({name}, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </main>

      <footer></footer>
    </div>
  )
}

export async function getStaticProps() {
  const albums = await getPortfolioAlbums()

  return {
    props: {albums}
  }
}
