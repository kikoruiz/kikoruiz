import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore
} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {TutorialStep, getActiveStep, getReachedStep} from 'lib/blog/steps'
import {getScrollTopBelowHeader} from 'lib/utils/scroll'

// How far under the place a link leaves its heading, in pixels, a heading still
// counts as the step being read. The line sits next to where the links land
// instead of at a fraction of the window, so that after following a link the
// next heading cannot be above it, however tall the window is.
const LANDING_TOLERANCE = 60

// The space left between the header and the heading a step leads to, which is
// the one the headings keep as their scroll margin.
const STEP_GAP_IN_REM = 1.5
const SMOOTH_SCROLL_SETTLE_TIME = 1000
// How long the step a link leads to stays as the one being read, whatever the
// position of the page. Near the end of the article the page cannot scroll far
// enough to put the heading where the link wants it.
const PINNED_STEP_TIME = SMOOTH_SCROLL_SETTLE_TIME + 300

// How fast the tip of the line travels, in pixels per millisecond. It is the
// same whether it goes a step or the whole way, so a long jump takes longer.
const LINE_SPEED = 0.7
function useActiveStep(ids: string[]) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const pinnedRef = useRef<{index: number; at: number} | null>(null)
  const key = ids.join()

  useEffect(() => {
    const headings = key
      .split(',')
      .map(id => document.getElementById(id))
      .filter(Boolean)

    if (headings.length === 0) return

    function update() {
      const pinned = pinnedRef.current

      if (pinned && performance.now() - pinned.at < PINNED_STEP_TIME) {
        setActiveIndex(pinned.index)

        return
      }

      const header = document.querySelector('header')
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0
      const gap =
        STEP_GAP_IN_REM *
        parseFloat(getComputedStyle(document.documentElement).fontSize)

      setActiveIndex(
        getActiveStep({
          tops: headings.map(heading => heading.getBoundingClientRect().top),
          line: headerBottom + gap + LANDING_TOLERANCE,
          isAtBottom:
            window.scrollY > 0 &&
            window.innerHeight + window.scrollY >=
              document.documentElement.scrollHeight - 2
        })
      )
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

  const pin = useCallback((index: number) => {
    pinnedRef.current = {index, at: performance.now()}
    setActiveIndex(index)
  }, [])

  return {activeIndex, pin}
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)

  query.addEventListener('change', onChange)

  return () => query.removeEventListener('change', onChange)
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

// The one value everything else is drawn from: how far down the track the tip
// of the line has got. It chases `target` at a steady speed, so the line and
// the circles it passes through always change in order, however many steps a
// jump covers and however many times the target moves on the way.
function useLineOffset(target: number | null) {
  const [offset, setOffset] = useState(0)
  const reducesMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    () => false
  )
  const currentRef = useRef(0)
  const isPlacedRef = useRef(false)

  useEffect(() => {
    if (target === null) return

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
  }, [target, reducesMotion])

  // With reduced motion the tip is where it has to be as soon as the step
  // changes, not a frame later.
  return reducesMotion && target !== null ? target : offset
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
  const {activeIndex, pin} = useActiveStep(steps.map(({id}) => id))
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

  function handleClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    index: number
  ) {
    const heading = document.getElementById(id)

    if (!heading) return

    event.preventDefault()
    pin(index)

    const gap =
      STEP_GAP_IN_REM *
      parseFloat(getComputedStyle(document.documentElement).fontSize)
    const isSmooth = !window.matchMedia(REDUCED_MOTION_QUERY).matches
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
          // The step you are already reading has nowhere to scroll to, so its
          // link stops being one.
          const isCurrent = index === activeIndex
          const Tag = isCurrent ? 'span' : 'a'

          return (
            <li
              key={id}
              className="relative motion-safe:animate-fade-in motion-safe:[animation-fill-mode:backwards]"
              style={{animationDelay: `${index * 90}ms`}}
            >
              <Tag
                {...(!isCurrent && {
                  href: `#${id}`,
                  onClick: event => handleClick(event, id, index)
                })}
                aria-current={isCurrent ? 'step' : undefined}
                className={`group flex gap-3${isCurrent ? ' cursor-default' : ''}`}
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
              </Tag>
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
