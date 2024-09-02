import {defineConfig} from 'checkly'

const config = defineConfig({
  projectName: 'kikoruiz',
  logicalId: 'kikoruiz',
  repoUrl: 'https://github.com/kikoruiz/kikoruiz',
  checks: {
    frequency: 720,
    locations: ['eu-west-1'],
    checkMatch: '**/__checks__/**/*.check.ts',
    playwrightConfig: {},
    browserChecks: {
      testMatch: '**/__checks__/**/*.spec.ts'
    }
  },
  cli: {
    runLocation: 'eu-west-1',
    reporters: ['list']
  }
})

export default config
