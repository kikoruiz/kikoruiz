import {CheckGroup, RetryStrategyBuilder} from 'checkly/constructs'

new CheckGroup('web-funnel', {
  name: 'Web Funnel',
  activated: true,
  muted: false,
  runParallel: false,
  runtimeId: '2024.02',
  locations: ['eu-west-3', 'eu-south-1'],
  tags: [],
  concurrency: 1,
  environmentVariables: [],
  apiCheckDefaults: {
    url: '',
    headers: [],
    queryParameters: [],
    assertions: []
  },
  retryStrategy: RetryStrategyBuilder.linearStrategy({
    baseBackoffSeconds: 60,
    maxRetries: 2,
    maxDurationSeconds: 600,
    sameRegion: true
  })
})
