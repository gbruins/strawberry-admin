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
    PopConfirm: { template: '<div><slot name="reference" /><button class="confirm-btn" @click="$emit(\'confirm\')"></button></div>', emits: ['confirm'] }
}

function mountPage() {
    return mount(ServicesPage, { global: { plugins: [i18n], stubs } })
}

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
            { id: 'svc1', start_at: '2026-01-01T19:00:00.000Z', end_at: '2026-01-02T02:00:00.000Z', notes: '', last_notified_at: '2026-01-01T12:00:00.000Z' }
        ], pagination: { total: 1 } })

        const wrapper = mountPage()
        await flushPromises()

        expect(wrapper.find('[data-test="last-notified"]').exists()).toBe(true)
    })

    it('sends a notification and shows success for a real send', async () => {
        serviceSearch.mockResolvedValue({ data: [
            { id: 'svc1', start_at: '2026-01-01T19:00:00.000Z', end_at: '2026-01-02T02:00:00.000Z', notes: '', last_notified_at: null }
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
            { id: 'svc1', start_at: '2026-01-01T19:00:00.000Z', end_at: '2026-01-02T02:00:00.000Z', notes: '', last_notified_at: null }
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
})
