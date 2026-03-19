import { validateConfig, buildConceptionInfo, getMilestoneConfig } from '../config'
import { getLmpEquivalent } from '../pregnancy'

describe('validateConfig', () => {
  it('accepts a valid minimal config', () => {
    const config = validateConfig({
      conceptionType: 'ivf-5day',
      date: '2023-04-18',
    })
    expect(config.conceptionType).toBe('ivf-5day')
    expect(config.date).toBe('2023-04-18')
    expect(config.milestones).toBeUndefined()
  })

  it('accepts a valid config with milestones', () => {
    const config = validateConfig({
      conceptionType: 'lmp',
      date: '2023-03-30',
      milestones: [
        { label: 'Halfway', weeks: 20 },
      ],
    })
    expect(config.milestones).toHaveLength(1)
    expect(config.milestones![0]).toEqual({ label: 'Halfway', weeks: 20 })
  })

  it('accepts all valid conception types', () => {
    const types = ['lmp', 'natural', 'ivf-fresh', 'ivf-3day', 'ivf-5day', 'ivf-6day']
    for (const type of types) {
      const config = validateConfig({ conceptionType: type, date: '2023-01-01' })
      expect(config.conceptionType).toBe(type)
    }
  })

  it('rejects null/undefined', () => {
    expect(() => validateConfig(null)).toThrow('Config must be a JSON object')
    expect(() => validateConfig(undefined)).toThrow('Config must be a JSON object')
  })

  it('rejects missing conceptionType', () => {
    expect(() => validateConfig({ date: '2023-01-01' })).toThrow('"conceptionType"')
  })

  it('rejects invalid conceptionType', () => {
    expect(() =>
      validateConfig({ conceptionType: 'magic', date: '2023-01-01' })
    ).toThrow('Invalid conceptionType "magic"')
  })

  it('rejects missing date', () => {
    expect(() => validateConfig({ conceptionType: 'lmp' })).toThrow('"date"')
  })

  it('rejects invalid date', () => {
    expect(() =>
      validateConfig({ conceptionType: 'lmp', date: 'not-a-date' })
    ).toThrow('Invalid date')
  })

  it('rejects non-array milestones', () => {
    expect(() =>
      validateConfig({ conceptionType: 'lmp', date: '2023-01-01', milestones: 'bad' })
    ).toThrow('"milestones" must be an array')
  })

  it('rejects milestone with missing label', () => {
    expect(() =>
      validateConfig({
        conceptionType: 'lmp',
        date: '2023-01-01',
        milestones: [{ weeks: 10 }],
      })
    ).toThrow('milestones[0].label')
  })

  it('rejects milestone with invalid weeks', () => {
    expect(() =>
      validateConfig({
        conceptionType: 'lmp',
        date: '2023-01-01',
        milestones: [{ label: 'Test', weeks: -1 }],
      })
    ).toThrow('milestones[0].weeks')
  })
})

describe('buildConceptionInfo', () => {
  it('builds lmp ConceptionInfo', () => {
    const info = buildConceptionInfo({ conceptionType: 'lmp', date: '2023-03-30' })
    expect(info.type).toBe('lmp')
    if (info.type === 'lmp') {
      expect(info.lmpDate.getUTCMonth()).toBe(2) // March
      expect(info.lmpDate.getUTCDate()).toBe(30)
    }
  })

  it('builds ivf-5day ConceptionInfo', () => {
    const info = buildConceptionInfo({ conceptionType: 'ivf-5day', date: '2023-04-18' })
    expect(info.type).toBe('ivf-5day')
    if (info.type === 'ivf-5day') {
      expect(info.transferDate.getUTCMonth()).toBe(3) // April
      expect(info.transferDate.getUTCDate()).toBe(18)
    }
  })

  it('builds natural ConceptionInfo', () => {
    const info = buildConceptionInfo({ conceptionType: 'natural', date: '2023-04-13' })
    expect(info.type).toBe('natural')
  })

  it('builds ivf-fresh ConceptionInfo', () => {
    const info = buildConceptionInfo({ conceptionType: 'ivf-fresh', date: '2023-04-13' })
    expect(info.type).toBe('ivf-fresh')
  })

  it('builds ivf-3day ConceptionInfo', () => {
    const info = buildConceptionInfo({ conceptionType: 'ivf-3day', date: '2023-04-16' })
    expect(info.type).toBe('ivf-3day')
  })

  it('builds ivf-6day ConceptionInfo', () => {
    const info = buildConceptionInfo({ conceptionType: 'ivf-6day', date: '2023-04-19' })
    expect(info.type).toBe('ivf-6day')
  })

  it('produces correct LMP when used with pregnancy module', () => {
    const info = buildConceptionInfo({ conceptionType: 'ivf-5day', date: '2023-04-18' })
    const lmp = getLmpEquivalent(info)
    expect(lmp.getUTCFullYear()).toBe(2023)
    expect(lmp.getUTCMonth()).toBe(2) // March
    expect(lmp.getUTCDate()).toBe(30)
  })
})

describe('getMilestoneConfig', () => {
  it('returns defaults when milestones not specified', () => {
    const milestones = getMilestoneConfig({
      conceptionType: 'lmp',
      date: '2023-01-01',
    })
    expect(milestones).toHaveLength(4)
    expect(milestones[0].label).toBe('Second Trimester')
  })

  it('returns custom milestones when specified', () => {
    const milestones = getMilestoneConfig({
      conceptionType: 'lmp',
      date: '2023-01-01',
      milestones: [{ label: 'Custom', weeks: 20 }],
    })
    expect(milestones).toHaveLength(1)
    expect(milestones[0].label).toBe('Custom')
  })
})
