import { describe, it, expect } from 'vitest'
import { serviceHasEnded, nextUpcomingServiceId, menuProblem } from '../services'

const now = Date.parse('2026-06-01T12:00:00Z')
const at = (hours: number) => new Date(now + hours * 3600_000).toISOString()

describe('serviceHasEnded', () => {
    it('is true only once end_at has passed', () => {
        expect(serviceHasEnded({ end_at: at(-1) }, now)).toBe(true)
        expect(serviceHasEnded({ end_at: at(1) }, now)).toBe(false)
    })
})

describe('nextUpcomingServiceId', () => {
    it('picks the earliest-starting service that has not ended, including one in progress', () => {
        const services = [
            { id: 'later', start_at: at(24), end_at: at(26) },
            { id: 'in-progress', start_at: at(-1), end_at: at(1) },
            { id: 'ended', start_at: at(-5), end_at: at(-4) }
        ]

        expect(nextUpcomingServiceId(services, now)).toBe('in-progress')
    })

    it('ignores services missing a start or end and returns null when none qualify', () => {
        expect(nextUpcomingServiceId([{ id: 'x', start_at: null, end_at: at(2) }], now)).toBeNull()
        expect(nextUpcomingServiceId([], now)).toBeNull()
    })
})

describe('menuProblem', () => {
    const menus = new Map([
        ['pub', { published: true }],
        ['draft', { published: false }]
    ])

    it('flags deleted and unpublished menus but not a missing or published one', () => {
        expect(menuProblem('gone', menus)).toBe('deleted')
        expect(menuProblem('draft', menus)).toBe('unpublished')
        expect(menuProblem('pub', menus)).toBeNull()
        expect(menuProblem(null, menus)).toBeNull()
    })
})
