#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

import {pascalCase} from 'change-case'

const componentsDir = path.join(process.cwd(), 'components')
const components = fs
  .readdirSync(componentsDir)
  .filter(filename => filename.endsWith('.tsx'))

function addDisplayName() {
  components.forEach(component => {
    const componentFile = fs.readFileSync(`${componentsDir}/${component}`)
    const content = componentFile.toString()
    const componentName = pascalCase(component.replace('.tsx', ''))
    const displayNameLine = `${componentName}.displayName = '${componentName}`
    const hasDisplayName = content.includes(displayNameLine)
    const needsDisplayName = content.match(
      /export default (function|memo|forwardRef)/
    )

    if (hasDisplayName || !needsDisplayName) return

    const editedContent = `${content}
${displayNameLine}'
`

    fs.writeFileSync(`${componentsDir}/${component}`, editedContent)
  })

  console.log('\n✅ Components have been updated.\n')
  process.exit(0)
}

addDisplayName()
