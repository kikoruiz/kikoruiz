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
  },
  {
    // The `bin` scripts are TypeScript too, and `no-undef` cannot see type-only
    // identifiers. The `@typescript-eslint` plugin is not registered for this
    // extension, so only the core rule can be turned off here.
    files: ['**/*.mts'],
    rules: {
      'no-undef': 'off'
    }
  }
]

export default config
