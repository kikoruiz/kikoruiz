import papers from 'data/store/papers.json'

export const DEFAULT_PRINT_PRICE = 45
export const DEFAULT_PRINT_SIZE = 'A2'
export const DEFAULT_UNIT_OF_MEASUREMENT = 'mm'
export const DEFAULT_PRINT_PAPER = 'hahnemuhle-photo-pearl-310'

export const PRINT_SIZES = {
  A2: {mm: '420x594', cm: '42x59.4', in: '16.5x23.4'},
  A3: {mm: '297x420', cm: '29.7x42', in: '11.7x16.5'},
  A4: {mm: '210x297', cm: '21x29.7', in: '8.3x11.7'}
}
export const UNITS_OF_MEASUREMENT = ['mm', 'cm', 'in']

export const FILTER_OPTIONS = {
  size: Object.keys(PRINT_SIZES).map(key => ({
    value: key.toLowerCase(),
    name: key
  })),
  sizeOption: ['with-border', 'borderless'],
  paper: Object.keys(papers).map(key => ({
    value: key,
    name: `${papers[key].brand} ${papers[key].type}`
  }))
}
export const SIMPLE_FILTERS = ['size-option']
