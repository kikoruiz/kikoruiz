// Where to scroll for an element to sit `gap` pixels under the sticky header,
// measured from the page as it is right now rather than from a value taken
// earlier, since the header changes height with its content.
export function getScrollTopBelowHeader(element: Element, gap = 0) {
  const header = document.querySelector('header')
  const headerBottom = header ? header.getBoundingClientRect().bottom : 0

  return Math.max(
    0,
    Math.round(
      element.getBoundingClientRect().top + window.scrollY - headerBottom - gap
    )
  )
}
