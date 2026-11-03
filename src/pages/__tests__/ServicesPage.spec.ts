import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ServicesPage from '../ServicesPage.vue'

const serviceSearch = vi.fn()
const serviceDelete = vi.fn()
const menuSearch = vi.fn()
const notifySend = vi.fn()

vi.mock('@/composables/useApi', () => ({
    default: (endpoint: string) => {
        const byEndpoint: Record<string, any> = { // eslint-disable-line @typescript-eslint/no-explicit-any
            'service.search': serviceSearch,
            'service.delete': serviceDelete,
            'serviceMenu.search': menuSearch,
            'notification.send': notifySend
        }
        const fn = byEndpoint[endpoint]
        return { isLoading: { value: false }, run: fn, tryCatch: (f: () => Promise<unknown>) => f() }
    }
}))

const addToast = vi.fn()
const successToast = vi.fn()
vi.mock('@/composables/useToast', () => ({
    default: () => ({ successToast, errorToast: vi.fn(), addToast })
}))

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } })

const stubs = {
    PageTitle: { template: '<div><slot /></div>' },
    Table: { template: '<table><slot /></table>' },
    TableHeader: { template: '<thead><slot /></thead>' },
    TableBody: { template: '<tbody><slot /></tbody>' },
    TableRow: { template: '<tr><slot /></tr>' },
    TableHead: { template: '<th><slot /></th>' },
    TableCell: { template: '<td><slot /></td>' },
    SortableTableHead: { template: '<th><slot /></th>' },
    Overlay: { template: '<div><slot /></div>' },
    DataPagination: { template: '<div></div>' },
    Format8601: { template: '<span></span>' },
    Button: { template: '<button><slot /></button>' },
    ServiceUpsertModal: { template: '<div></div>' },
    PopConfirm: { template: '<div><slot name="reference" /><button class="confirm-btn" @click="$emit(\'confirm\')"></button></div>', emits: ['confirm'] },
    // The real component reaches into useAppStore() (Pinia) for the admin's tenant timezone —
    // irrelevant to these tests and not worth wiring up a Pinia instance just to mount it.
    DateTimePicker: { template: '<input />' }
}

function mountPage() {
    return mount(ServicesPage, { global: { plugins: [i18n], stubs } })
}

// Fixtures use times relative to the real clock (not fixed literals) so the notify button's
// visibility — which depends on end_at vs. Date.now() — stays correct no matter when these
// tests run.
const futureStart = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
const futureEnd = new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString()
const pastStart = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
const pastEnd = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

describe('ServicesPage notify action', () => {
    beforeEach(() => {
        serviceSearch.mockReset()
        serviceDelete.mockReset()
        menuSearch.mockReset()
        notifySend.mockReset()
        addToast.mockReset()
        successToast.mockReset()
        menuSearch.mockResolvedValue({ data: [] })
    })

    it('shows the already-notified indicator when last_notified_at is set', async () => {
        serviceSearch.mockResolvedValue({ data: [
            { id: 'svc1', start_at: futureStart, end_at: futureEnd, notes: '', last_notified_at: pastStart }
        ], pagination: { total: 1 } })

        const wrapper = mountPage()
        await flushPromises()

        expect(wrapper.find('[data-test="last-notified"]').exists()).toBe(true)
    })

    it('sends a notification and shows success for a real send', async () => {
        serviceSearch.mockResolvedValue({ data: [
            { id: 'svc1', start_at: futureStart, end_at: futureEnd, notes: '', last_notified_at: null }
        ], pagination: { total: 1 } })
        notifySend.mockResolvedValue({ data: { sent: true, recipientCount: 5 } })

        const wrapper = mountPage()
        await flushPromises()

        const confirmButtons = wrapper.findAll('.confirm-btn')
        await confirmButtons[0]!.trigger('click') // notify is the first PopConfirm in the row
        await flushPromises()

        expect(notifySend).toHaveBeenCalledWith('svc1')
        expect(successToast).toHaveBeenCalled()
        expect(addToast).not.toHaveBeenCalled()
    })

    it('shows a distinct message when there are no subscribers, not a success toast', async () => {
        serviceSearch.mockResolvedValue({ data: [
            { id: 'svc1', start_at: futureStart, end_at: futureEnd, notes: '', last_notified_at: null }
        ], pagination: { total: 1 } })
        notifySend.mockResolvedValue({ data: { sent: true, recipientCount: 0 } })

        const wrapper = mountPage()
        await flushPromises()

        const confirmButtons = wrapper.findAll('.confirm-btn')
        await confirmButtons[0]!.trigger('click')
        await flushPromises()

        expect(addToast).toHaveBeenCalled()
        expect(successToast).not.toHaveBeenCalled()
    })

    it('hides the notify button once the service has ended', async () => {
        serviceSearch.mockResolvedValue({ data: [
            { id: 'past', start_at: pastStart, end_at: pastEnd, notes: '', last_notified_at: null },
            { id: 'future', start_at: futureStart, end_at: futureEnd, notes: '', last_notified_at: null }
        ], pagination: { total: 2 } })

        const wrapper = mountPage()
        await flushPromises()

        expect(wrapper.findAll('[data-test="notify-subscribers"]')).toHaveLength(1)
    })

    it('defaults the ends-after filter to now, sending it as an end_at gte param', async () => {
        serviceSearch.mockResolvedValue({ data: [], pagination: { total: 0 } })

        const before = Date.now()
        mountPage()
        await flushPromises()

        expect(serviceSearch).toHaveBeenCalled()
        const params = serviceSearch.mock.calls[0]![0]
        expect(params.end_at).toBeTruthy()

        const sent = JSON.parse(params.end_at)
        expect(sent.gte).toBeTruthy()
        expect(new Date(sent.gte).getTime()).toBeGreaterThanOrEqual(before)
        expect(new Date(sent.gte).getTime()).toBeLessThanOrEqual(Date.now())
    })

    it('tags only the soonest not-yet-ended service as Next', async () => {
        serviceSearch.mockResolvedValue({ data: [
            { id: 'later', start_at: futureEnd, end_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), notes: '', last_notified_at: null },
            { id: 'soonest', start_at: futureStart, end_at: futureEnd, notes: '', last_notified_at: null },
            { id: 'already-ended', start_at: pastStart, end_at: pastEnd, notes: '', last_notified_at: null }
        ], pagination: { total: 3 } })

        const wrapper = mountPage()
        await flushPromises()

        const badges = wrapper.findAll('[data-test="next-upcoming"]')
        expect(badges).toHaveLength(1)

        // Row order follows the array passed to serviceSearch above — 'soonest' is index 1.
        const rows = wrapper.findAll('tbody tr')
        const taggedRow = badges[0]!.element.closest('tr')
        expect(taggedRow).toBe(rows[1]!.element)
    })
})
