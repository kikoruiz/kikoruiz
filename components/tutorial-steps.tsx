import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {TutorialStep, getReachedStep} from 'lib/blog/steps'
import {getScrollTopBelowHeader} from 'lib/utils/scroll'

// How far down the viewport a heading has to get before its step is the one
// being read, as a fraction of the viewport height.
const ACTIVATION_LINE = 0.35

// The space left between the header and the heading a step leads to, which is
// the one the headings keep as their scroll margin.
const STEP_GAP_IN_REM = 1.5
const SMOOTH_SCROLL_SETTLE_TIME = 1000

// How fast the tip of the line travels, in pixels per millisecond. It is the
// same whether it goes a step or the whole way, so a long jump takes longer.
const LINE_SPEED = 0.7
function useActiveStep(ids: string[]) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const key = ids.join()

  useEffect(() => {
    const headings = key
      .split(',')
      .map(id => document.getElementById(id))
      .filter(Boolean)

    if (headings.length === 0) return

    function update() {
      const line = window.innerHeight * ACTIVATION_LINE
      let next = -1

      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= line) next = index
      })
      setActiveIndex(next)
    }

    update()

    // The step is worked out from where the headings are, once per frame at
    // most. Waiting for headings to enter or leave a zone would miss a jump
    // that clears several of them at once, like the End key or a dragged
    // scrollbar.
    let frame = 0

    function schedule() {
      if (frame) return

      frame = requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    window.addEventListener('scroll', schedule, {passive: true})
    window.addEventListener('resize', schedule)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [key])

  return activeIndex
}

// The one value everything else is drawn from: how far down the track the tip
// of the line has got. It chases `target` at a steady speed, so the line and
// the circles it passes through always change in order, however many steps a
// jump covers and however many times the target moves on the way.
function useLineOffset(target: number | null) {
  const [offset, setOffset] = useState(0)
  const currentRef = useRef(0)
  const isPlacedRef = useRef(false)

  useEffect(() => {
    if (target === null) return

    const reducesMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // The first reading, and any with reduced motion, put the tip in place.
    if (!isPlacedRef.current || reducesMotion) {
      isPlacedRef.current = true
      currentRef.current = target
      setOffset(target)

      return
    }

    let frame: number
    let last = performance.now()

    function step(now: number) {
      const reach = LINE_SPEED * (now - last)
      const distance = target - currentRef.current

      last = now
      currentRef.current =
        Math.abs(distance) <= reach
          ? target
          : currentRef.current + Math.sign(distance) * reach
      setOffset(currentRef.current)

      if (currentRef.current !== target) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(frame)
  }, [target])

  return offset
}

// Where the middle of each circle sits inside the list. The line is drawn from
// these, since a title that wraps makes a step taller than the next one.
function useCircleCenters(count: number) {
  const listRef = useRef<HTMLOListElement>(null)
  const circleRefs = useRef<HTMLSpanElement[]>([])
  const [centers, setCenters] = useState<number[]>([])

  useLayoutEffect(() => {
    const list = listRef.current

    function measure() {
      const next = circleRefs.current
        .slice(0, count)
        .map(
          circle =>
            (circle.offsetParent as HTMLElement).offsetTop +
            circle.offsetTop +
            circle.offsetHeight / 2
        )

      setCenters(current =>
        current.length === next.length &&
        current.every((center, index) => center === next[index])
          ? current
          : next
      )
    }

    measure()

    // Titles wrap differently when the rail changes width, and again once the
    // web font replaces the fallback one.
    const observer = new ResizeObserver(measure)

    observer.observe(list)

    return () => observer.disconnect()
  }, [count])

  return {listRef, circleRefs, centers}
}

export default function TutorialSteps({
  steps,
  className = ''
}: TutorialStepsProps) {
  const {t} = useTranslation('blog')
  const activeIndex = useActiveStep(steps.map(({id}) => id))
  const {listRef, circleRefs, centers} = useCircleCenters(steps.length)
  const hasCenters = centers.length === steps.length
  const firstCenter = centers[0]
  const target =
    hasCenters && activeIndex > 0 ? centers[activeIndex] - firstCenter : 0
  const offset = useLineOffset(hasCenters ? target : null)
  // The step the tip of the line has reached, which is the one lit up.
  const reachedIndex = hasCenters
    ? getReachedStep({centers, offset, activeIndex})
    : activeIndex

  const gradientLength =
    hasCenters && reachedIndex > 0
      ? centers[reachedIndex] - centers[reachedIndex - 1]
      : 0

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const heading = document.getElementById(id)

    if (!heading) return

    event.preventDefault()

    const gap =
      STEP_GAP_IN_REM *
      parseFloat(getComputedStyle(document.documentElement).fontSize)
    const isSmooth = !window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
    let hasBeenMoved = false
    const markAsMoved = () => {
      hasBeenMoved = true
    }

    window.scrollTo({
      top: getScrollTopBelowHeader(heading, gap),
      behavior: isSmooth ? 'smooth' : 'auto'
    })
    window.history.replaceState(null, '', `#${id}`)

    // Images and fonts can still move the page while it scrolls, so once it
    // stops the heading is put back where it belongs, unless the visitor has
    // taken over in the meantime.
    window.addEventListener('wheel', markAsMoved, {once: true, passive: true})
    window.addEventListener('touchmove', markAsMoved, {
      once: true,
      passive: true
    })
    window.setTimeout(
      () => {
        window.removeEventListener('wheel', markAsMoved)
        window.removeEventListener('touchmove', markAsMoved)

        const top = getScrollTopBelowHeader(heading, gap)

        if (!hasBeenMoved && Math.abs(top - window.scrollY) > 2) {
          window.scrollTo({top, behavior: 'auto'})
        }
      },
      isSmooth ? SMOOTH_SCROLL_SETTLE_TIME : 100
    )
  }

  return (
    <nav
      aria-label={t('post.steps')}
      className={`rounded-md bg-neutral-800/60 p-6 min-[1500px]:rounded-none min-[1500px]:bg-transparent min-[1500px]:p-0 ${className}`}
    >
      <p className="mb-3 text-xs font-black uppercase tracking-widest text-neutral-500">
        {t('post.steps')}
      </p>

      <ol ref={listRef} className="relative">
        {hasCenters && steps.length > 1 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[17px] w-0.5 bg-orange-200/20"
            style={{
              top: firstCenter,
              height: centers[steps.length - 1] - firstCenter
            }}
          >
            <span
              className="absolute inset-x-0 top-0 overflow-hidden bg-orange-300"
              style={{height: offset}}
            >
              {/* The stretch that leads into the step being read is the only
                  one with the gradient, riding the tip of the line. */}
              <span
                className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-orange-200 to-orange-500"
                style={{height: gradientLength}}
              />
            </span>
          </span>
        )}

        {steps.map(({id, title}, index) => {
          const isDone = index < reachedIndex
          const isActive = index === reachedIndex
          const isLast = index === steps.length - 1

          return (
            <li
              key={id}
              className="relative motion-safe:animate-fade-in motion-safe:[animation-fill-mode:backwards]"
              style={{animationDelay: `${index * 90}ms`}}
            >
              <a
                href={`#${id}`}
                aria-current={index === activeIndex ? 'step' : undefined}
                onClick={event => handleClick(event, id)}
                className="group flex gap-3"
              >
                <span
                  ref={element => {
                    circleRefs.current[index] = element
                  }}
                  aria-hidden="true"
                  className={`relative z-[1] flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black leading-none transition-all motion-reduce:transition-none ${
                    isActive ? 'duration-100' : 'duration-200'
                  } ${
                    isDone
                      ? 'border-orange-300 bg-orange-300 text-neutral-900'
                      : isActive
                        ? 'scale-110 border-orange-500 bg-neutral-900 text-orange-300 shadow-[0_0_0_6px_rgba(249,115,22,0.15)]'
                        : 'border-orange-200/30 bg-neutral-900 text-neutral-500 group-hover:border-orange-300 group-hover:text-orange-300'
                  }`}
                >
                  {index + 1}
                </span>

                <span
                  className={isLast ? '' : 'pb-[1.125rem] min-[1500px]:pb-6'}
                >
                  <span
                    className={`flex min-h-9 items-center text-balance text-sm leading-[18px] transition-colors motion-reduce:transition-none ${
                      isActive ? 'duration-100' : 'duration-150'
                    } ${
                      isActive
                        ? 'font-bold text-orange-300'
                        : isDone
                          ? 'font-light text-neutral-300'
                          : 'font-light text-neutral-500 group-hover:text-neutral-300'
                    }`}
                  >
                    {title}
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

TutorialSteps.displayName = 'TutorialSteps'

interface TutorialStepsProps {
  steps: TutorialStep[]
  className?: string
}
