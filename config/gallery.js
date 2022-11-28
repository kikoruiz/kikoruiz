export const GALLERY_ALBUMS = [
  {
    id: 'landscapes',
    tags: ['landscape'],
    excludeTags: ['travel', 'seascape', 'seasonal'],
    highlightedPicture: '2020-10-17_0213.jpg'
  },
  {
    id: 'seascapes',
    tags: ['seascape'],
    excludeTags: ['landscape'],
    highlightedPicture: '2021-12-04_0135.jpg'
  },
  {
    id: 'astro',
    tags: ['moon', 'sun'],
    excludeTags: ['landscape', 'seascape', 'travel'],
    highlightedPicture: '2018-11-24_0178.jpg'
  },
  {
    id: 'portraits',
    tags: ['portrait'],
    highlightedPicture: '2017-06-11_0014.jpg'
  },
  {
    id: 'travel',
    tags: ['travel'],
    highlightedPicture: '2021-10-27_0280.jpg'
  },
  {
    id: 'seasonal',
    tags: ['seasonal'],
    highlightedPicture: '2022-11-13_0023.jpg'
  },
  {
    id: 'night',
    tags: ['night photography'],
    highlightedPicture: '2022-06-25_0028.jpg'
  }
]

export const SORTING_OPTIONS = [
  'picture-group',
  'date',
  'name',
  'metadata-group',
  'metadata.shutter-speed',
  'metadata.aperture',
  'metadata.iso',
  'metadata.focal-length'
]
export const DEFAULT_SORTING_OPTION = 'date'
export const DISABLED_SORTING_OPTIONS = ['picture-group', 'metadata-group']
export const PENDING_EVAL_SORTING_OPTIONS = ['metadata.shutter-speed']
