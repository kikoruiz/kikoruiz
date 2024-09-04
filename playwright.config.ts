import {defineConfig} from '@playwright/test'
import type {PlaywrightConfig} from 'checkly/dist/constructs/playwright-config'

const config: PlaywrightConfig = {
  use: {
    extraHTTPHeaders: {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
      'x-vercel-set-bypass-cookie': true | 'samesitenone'(optional)
    }
  }
}

export default defineConfig(config)
