import {useEffect, useRef, useState} from 'react'

// A CSS `transition` cannot animate a gradient's own stop position, so a mask
// built from one jumps straight to its new value instead of easing into it.
// This tweens the number driving that stop with `requestAnimationFrame`
// instead, landing on real intermediate values a transition never would.
export function useAnimatedValue(target: number, duration = 300) {
  const [value, setValue] = useState(target)
  // Only ever written inside `tick`, in lockstep with `value` itself, so
  // reading it here during render is never required.
  const valueRef = useRef(target)

  useEffect(() => {
    const from = valueRef.current
    const delta = target - from

    if (delta === 0) return undefined

    const start = performance.now()
    let frame: number

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const next = from + delta * progress

      valueRef.current = next
      setValue(next)

      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}
