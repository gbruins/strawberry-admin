import { describe, it, expect } from 'vitest'
import { adjacentStatus, formatWaitTime, isUrgent, groupTicketsByStatus, WAIT_WARNING_MS, type KitchenTicket } from '../kitchenTickets'

const now = Date.parse('2026-06-01T18:00:00Z')
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString()

function ticket(id: string, status: KitchenTicket['kitchen_status'], updatedMinutesAgo: number | null): KitchenTicket {
    return {
        id,
        pickup_code: id,
        kitchen_status: status,
        kitchen_status_updated_at: updatedMinutesAgo === null ? null : minutesAgo(updatedMinutesAgo),
        customer_note: null
    }
}

describe('adjacentStatus', () => {
    it('moves one stage forward or back and stops at either end', () => {
        expect(adjacentStatus('queued', 1)).toBe('in_progress')
        expect(adjacentStatus('in_progress', 1)).toBe('completed')
        expect(adjacentStatus('in_progress', -1)).toBe('queued')
        expect(adjacentStatus('completed', 1)).toBeNull()
        expect(adjacentStatus('queued', -1)).toBeNull()
    })
})

describe('formatWaitTime', () => {
    it('formats minutes and hours since the timestamp', () => {
        expect(formatWaitTime(minutesAgo(0.5), now)).toBe('<1m')
        expect(formatWaitTime(minutesAgo(12), now)).toBe('12m')
        expect(formatWaitTime(minutesAgo(65), now)).toBe('1h 5m')
        expect(formatWaitTime(null, now)).toBe('')
    })

    it('never shows a negative wait for a timestamp slightly in the future (clock skew)', () => {
        expect(formatWaitTime(new Date(now + 30_000).toISOString(), now)).toBe('<1m')
    })
})

describe('isUrgent', () => {
    it('flags queued/in-progress tickets at the warning threshold, never completed ones', () => {
        const threshold = WAIT_WARNING_MS / 60_000

        expect(isUrgent(ticket('a', 'queued', threshold), now)).toBe(true)
        expect(isUrgent(ticket('b', 'in_progress', threshold - 1), now)).toBe(false)
        expect(isUrgent(ticket('c', 'completed', 120), now)).toBe(false)
        expect(isUrgent(ticket('d', 'queued', null), now)).toBe(false)
    })
})

describe('groupTicketsByStatus', () => {
    it('groups by stage with the longest-waiting ticket first', () => {
        const grouped = groupTicketsByStatus([
            ticket('newer', 'queued', 2),
            ticket('cooking', 'in_progress', 5),
            ticket('older', 'queued', 9),
            ticket('done', 'completed', 1)
        ])

        expect(grouped.queued.map((t) => t.id)).toEqual(['older', 'newer'])
        expect(grouped.in_progress.map((t) => t.id)).toEqual(['cooking'])
        expect(grouped.completed.map((t) => t.id)).toEqual(['done'])
    })
})
