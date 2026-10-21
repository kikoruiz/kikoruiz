import {describe, expect, it} from 'vitest'
import {
  getActiveStep,
  getNodeText,
  getReachedStep,
  getStepId,
  getTutorialSteps
} from 'lib/blog/steps'

describe('getTutorialSteps', () => {
  it('takes every second level heading as a step, in order', () => {
    const body = ['Intro', '## Uno', 'text', '### Detalle', '## Dos'].join('\n')

    expect(getTutorialSteps(body)).toEqual([
      {id: 'uno', title: 'Uno'},
      {id: 'dos', title: 'Dos'}
    ])
  })

  it('builds ids without accents or spaces', () => {
    expect(getTutorialSteps('## Calibrar el monitor y la luz')).toEqual([
      {
        id: 'calibrar-el-monitor-y-la-luz',
        title: 'Calibrar el monitor y la luz'
      }
    ])
    expect(getStepId('Prueba de impresión')).toBe('prueba-de-impresion')
  })

  it('reads the text a heading renders, not its markdown', () => {
    expect(
      getTutorialSteps('## Perfil **ICC** de [Hahnemühle](https://x.y) y `D65`')
    ).toEqual([
      {
        id: 'perfil-icc-de-hahnemuhle-y-d65',
        title: 'Perfil ICC de Hahnemühle y D65'
      }
    ])
  })

  it('ignores headings inside code blocks', () => {
    const body = ['## Real', '```', '## Falso', '```', '## Otro'].join('\n')

    expect(getTutorialSteps(body).map(({title}) => title)).toEqual([
      'Real',
      'Otro'
    ])
  })

  it('ignores first and third level headings', () => {
    expect(getTutorialSteps('# Título\n### Sub')).toEqual([])
  })

  it('gives the same id as the heading rendered in the article', () => {
    const [{id}] = getTutorialSteps('## Perfil **ICC** de `D65`')
    const rendered = getNodeText({
      children: [
        {type: 'text', value: 'Perfil '},
        {children: [{type: 'text', value: 'ICC'}]},
        {type: 'text', value: ' de '},
        {children: [{type: 'text', value: 'D65'}]}
      ]
    })

    expect(getStepId(rendered)).toBe(id)
  })
})

describe('getReachedStep', () => {
  // Eight circles, 60 pixels apart.
  const centers = Array.from({length: 8}, (_, index) => 18 + index * 60)

  it('is the step being read when there is nothing to measure yet', () => {
    expect(getReachedStep({centers: [], offset: 0, activeIndex: 4})).toBe(4)
  })

  it('is none before the first heading, with the line at rest', () => {
    expect(getReachedStep({centers, offset: 0, activeIndex: -1})).toBe(-1)
  })

  it('is the first step when it is the one being read', () => {
    expect(getReachedStep({centers, offset: 0, activeIndex: 0})).toBe(0)
  })

  it('is the last circle the tip has gone through, in between two', () => {
    expect(getReachedStep({centers, offset: 130, activeIndex: 7})).toBe(2)
    expect(getReachedStep({centers, offset: 179, activeIndex: 7})).toBe(2)
  })

  it('counts a circle as reached when the tip is on it', () => {
    expect(getReachedStep({centers, offset: 180, activeIndex: 7})).toBe(3)
    expect(getReachedStep({centers, offset: 179.6, activeIndex: 7})).toBe(3)
  })

  it('reads the same going back up', () => {
    expect(getReachedStep({centers, offset: 130, activeIndex: 0})).toBe(2)
  })

  it('is the last step once the line has arrived', () => {
    expect(getReachedStep({centers, offset: 420, activeIndex: 7})).toBe(7)
  })

  it('never goes ahead of the line, whatever step is being read', () => {
    expect(getReachedStep({centers, offset: 60, activeIndex: 7})).toBe(1)
  })
})

describe('getActiveStep', () => {
  // Headings 236 to 680 pixels apart, the closest and the furthest in the
  // tutorial, with the activation line 84 pixels under the header (24 and 60).
  const line = 146 + 24 + 60

  it('is none while no heading has got up to the line', () => {
    expect(
      getActiveStep({tops: [400, 900, 1300], line, isAtBottom: false})
    ).toBe(-1)
  })

  it('is the last heading that has got up to the line', () => {
    expect(
      getActiveStep({tops: [-900, -300, 120, 560], line, isAtBottom: false})
    ).toBe(2)
  })

  it('is the heading a link has just brought next to the header', () => {
    // Where a link leaves its heading: 24 pixels under the header.
    const landed = 146 + 24

    for (const gapToNext of [236, 264, 312, 376, 536, 680]) {
      expect(
        getActiveStep({
          tops: [landed - 1000, landed, landed + gapToNext],
          line,
          isAtBottom: false
        })
      ).toBe(1)
    }
  })

  it('does not depend on how tall the window is', () => {
    // The line is measured from the header, so the same positions give the
    // same step in a window of any height.
    const tops = [-500, 170, 406]

    expect(getActiveStep({tops, line, isAtBottom: false})).toBe(1)
  })

  it('is the last step at the bottom of the page, even if its heading is lower', () => {
    expect(
      getActiveStep({tops: [-900, -300, 700], line, isAtBottom: true})
    ).toBe(2)
  })

  it('has no step to give when there are no headings', () => {
    expect(getActiveStep({tops: [], line, isAtBottom: true})).toBe(-1)
  })
})
