import HomeBlock from 'components/home-block'
import Logo from 'assets/brand/logo.svg'

export default function ErrorPage({title}: {title: string}) {
  return (
    <div className="p-3">
      <HomeBlock className="flex items-center justify-center px-12 mt-9 sm:mt-3">
        <h1 className="absolute font-black drop-shadow-lg text-3xl sm:text-4xl">
          {title}
        </h1>

        <Logo className="w-fit fill-white/5 lg:w-[45%]" />
      </HomeBlock>
    </div>
  )
}
