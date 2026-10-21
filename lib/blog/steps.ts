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
