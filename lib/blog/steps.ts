import {getSlug} from '../utils'

export interface TutorialStep {
  id: string
  title: string
}

interface TextNode {
  type?: string
  value?: string
  children?: TextNode[]
}

const STEP_HEADING = /^##\s+(.+?)\s*$/
const CODE_FENCE = /^\s*(```|~~~)/

// What a heading says once rendered, so the id built here and the one built
// from the rendered heading in the article can never drift apart.
function stripInlineMarkdown(markdown: string) {
  return markdown
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__|\*|_|`)/g, '')
}

export function getStepId(title: string) {
  return getSlug(title)
}

export function getNodeText(node: TextNode): string {
  if (node.type === 'text') return node.value ?? ''

  return (node.children ?? []).map(getNodeText).join('')
}

export function getTutorialSteps(body: string): TutorialStep[] {
  let isInsideCode = false

  return body.split('\n').flatMap(line => {
    if (CODE_FENCE.test(line)) {
      isInsideCode = !isInsideCode

      return []
    }

    const [, heading] = isInsideCode ? [] : (line.match(STEP_HEADING) ?? [])

    if (!heading) return []

    const title = stripInlineMarkdown(heading)

    return [{id: getStepId(title), title}]
  })
}

// A circle counts as reached when the tip of the line is this close to its
// middle, in pixels.
const REACH_TOLERANCE = 0.5

// The step the tip of the line has got to, given how far down the track it is
// and where the middle of every circle sits. Once the line has stopped it is the
// step being read, and on its way it is the last circle it went through.
export function getReachedStep({
  centers,
  offset,
  activeIndex
}: {
  centers: number[]
  offset: number
  activeIndex: number
}) {
  if (centers.length === 0 || (activeIndex <= 0 && offset <= REACH_TOLERANCE)) {
    return activeIndex
  }

  let reached = 0

  centers.forEach((center, index) => {
    if (center - centers[0] <= offset + REACH_TOLERANCE) reached = index
  })

  return reached
}

// The step being read: the last heading that has got up to the activation
// line. At the very bottom of the page it is the last one, since a short final
// section may never get its heading that far up.
export function getActiveStep({
  tops,
  line,
  isAtBottom
}: {
  tops: number[]
  line: number
  isAtBottom: boolean
}) {
  if (isAtBottom && tops.length > 0) return tops.length - 1

  let active = -1

  tops.forEach((top, index) => {
    if (top <= line) active = index
  })

  return active
}
