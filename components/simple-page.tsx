import HomeBlock from 'components/home-block'
import Logo from 'assets/brand/logo.svg'

export default function SimplePage({title}: {title: string}) {
  return (
    <HomeBlock className="relative flex items-center justify-center px-12 mt-9 sm:mt-3">
      <h1 className="absolute left-0 p-6 text-center font-black drop-shadow-lg text-3xl sm:text-4xl">
        {title}
      </h1>

      <Logo className="w-fit fill-white/5 lg:w-[45%]" />
    </HomeBlock>
  )
}
