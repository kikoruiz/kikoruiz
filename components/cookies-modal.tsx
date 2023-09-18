import useTranslation from 'next-translate/useTranslation'

export default function CookiesModal({
  isModalOpen,
  setIsModalOpen
}: CookiesModalProps) {
  const {t} = useTranslation()

  function closeModal() {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <>
      <button
        aria-hidden="true"
        tabIndex={-1}
        className="fixed z-20 inset-0 h-screen w-screen bg-neutral-900/60 backdrop-blur transition-opacity opacity-1 touch-none cursor-pointer"
        onClick={closeModal}
      />

      <div className="fixed text-sm top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 max-w-xl bg-neutral-900 drop-shadow-2xl rounded border border-neutral-700 p-12">
        <div className="absolute right-3 top-3 z-20 flex flex-row-reverse gap-3 sm:right-6 sm:top-6">
          <button
            aria-label={t('cookies.modal.close')}
            title={t('cookies.modal.close')}
            className="group relative flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
            onClick={closeModal}
          >
            <span className="sr-only">{t('cookies.modal.close')}</span>

            <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
              <span
                aria-hidden="true"
                className="absolute flex h-0.5 w-5 rotate-45 transform bg-current group-hover:bg-current"
              />

              <span
                aria-hidden="true"
                className="absolute flex h-0.5 w-5 -rotate-45 transform bg-current group-hover:bg-current"
              />
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

interface CookiesModalProps {
  isModalOpen: boolean
  setIsModalOpen: (isModalOpen: boolean) => void
}
