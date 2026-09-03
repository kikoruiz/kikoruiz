import next from 'eslint-config-next'
import prettier from 'eslint-config-prettier'

const config = [
  ...next,
  prettier,
  {
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'off',
      'spaced-comment': ['warn', 'always', {markers: ['/']}],
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/use-memo': 'warn',
      'react-hooks/refs': 'warn'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
]

export default config
