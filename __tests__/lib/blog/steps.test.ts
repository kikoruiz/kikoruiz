import {describe, expect, it} from 'vitest'
import {getNodeText, getStepId, getTutorialSteps} from 'lib/blog/steps'

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
