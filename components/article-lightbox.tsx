import {useEffect} from 'react'

interface ArticleLightboxProps {
  src: string
  alt: string
  onClose: () => void
}

export default function ArticleLightbox({
  src,
  alt,
  onClose
}: ArticleLightboxProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-20 h-screen w-screen">
      <button
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 z-0 h-full w-full touch-auto bg-neutral-900/60 backdrop-blur transition-opacity"
        onClick={onClose}
      />

      <div className="absolute right-3 top-3 z-20 sm:right-6 sm:top-6">
        <button
          aria-label="Close"
          title="Close"
          className="group relative flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
          onClick={onClose}
        >
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

      <div className="flex h-full w-full items-center justify-center p-6 pt-24 sm:p-12 sm:pt-24">
        <img
          src={src}
          alt={alt}
          className="relative z-10 max-h-full max-w-full rounded-sm object-contain drop-shadow-xl"
        />
      </div>
    </div>
  )
}

ArticleLightbox.displayName = 'ArticleLightbox'
